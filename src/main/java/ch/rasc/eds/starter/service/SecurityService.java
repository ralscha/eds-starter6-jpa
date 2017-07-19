package ch.rasc.eds.starter.service;

import static ch.ralscha.extdirectspring.annotation.ExtDirectMethodType.POLL;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestParam;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.ralscha.extdirectspring.annotation.ExtDirectMethodType;
import ch.ralscha.extdirectspring.bean.ExtDirectFormPostResult;
import ch.rasc.eds.starter.Application;
import ch.rasc.eds.starter.config.security.JpaUserDetails;
import ch.rasc.eds.starter.config.security.RequireAdminAuthority;
import ch.rasc.eds.starter.config.security.RequireAnyAuthority;
import ch.rasc.eds.starter.dto.UserDetailDto;
import ch.rasc.eds.starter.entity.QUser;
import ch.rasc.eds.starter.entity.User;
import ch.rasc.eds.starter.util.JPAQueryFactory;
import ch.rasc.eds.starter.util.TotpAuthUtil;
import ch.rasc.eds.starter.web.CsrfController;

@Service
public class SecurityService {
	public static final String AUTH_USER = "authUser";

	private final JPAQueryFactory jpaQueryFactory;

	private final PasswordEncoder passwordEncoder;

	private final MailService mailService;

	private final ApplicationEventPublisher applicationEventPublisher;

	public SecurityService(JPAQueryFactory jpaQueryFactory,
			PasswordEncoder passwordEncoder, MailService mailService,
			ApplicationEventPublisher applicationEventPublisher) {
		this.jpaQueryFactory = jpaQueryFactory;
		this.passwordEncoder = passwordEncoder;
		this.mailService = mailService;
		this.applicationEventPublisher = applicationEventPublisher;
	}

	@ExtDirectMethod
	@Transactional
	public UserDetailDto getAuthUser(
			@AuthenticationPrincipal JpaUserDetails jpaUserDetails) {

		if (jpaUserDetails != null) {
			User user = jpaUserDetails.getUser(this.jpaQueryFactory);
			UserDetailDto userDetailDto = new UserDetailDto(jpaUserDetails, user, null);

			if (!jpaUserDetails.isPreAuth()) {
				user.setLastAccess(ZonedDateTime.now(ZoneOffset.UTC));
			}

			return userDetailDto;
		}

		return null;
	}

	@ExtDirectMethod(ExtDirectMethodType.FORM_POST)
	@PreAuthorize("hasAuthority('PRE_AUTH')")
	@Transactional
	public ExtDirectFormPostResult signin2fa(HttpServletRequest request,
			@AuthenticationPrincipal JpaUserDetails jpaUserDetails,
			@RequestParam("code") int code) {

		User user = jpaUserDetails.getUser(this.jpaQueryFactory);
		if (user != null) {
			if (TotpAuthUtil.verifyCode(user.getSecret(), code, 3)) {
				user.setLastAccess(ZonedDateTime.now(ZoneOffset.UTC));
				jpaUserDetails.grantAuthorities();

				Authentication newAuth = new UsernamePasswordAuthenticationToken(
						jpaUserDetails, null, jpaUserDetails.getAuthorities());
				SecurityContextHolder.getContext().setAuthentication(newAuth);

				ExtDirectFormPostResult result = new ExtDirectFormPostResult();
				result.addResultProperty(AUTH_USER, new UserDetailDto(jpaUserDetails,
						user, CsrfController.getCsrfToken(request)));
				return result;
			}

			BadCredentialsException excp = new BadCredentialsException(
					"Bad verification code");
			AuthenticationFailureBadCredentialsEvent event = new AuthenticationFailureBadCredentialsEvent(
					SecurityContextHolder.getContext().getAuthentication(), excp);
			this.applicationEventPublisher.publishEvent(event);

			user = jpaUserDetails.getUser(this.jpaQueryFactory);
			if (user.getLockedOutUntil() != null) {
				HttpSession session = request.getSession(false);
				if (session != null) {
					Application.logger.debug("Invalidating session: " + session.getId());
					session.invalidate();
				}
				SecurityContext context = SecurityContextHolder.getContext();
				context.setAuthentication(null);
				SecurityContextHolder.clearContext();
			}
		}

		return new ExtDirectFormPostResult(false);
	}

	@ExtDirectMethod(ExtDirectMethodType.FORM_POST)
	@Transactional
	public ExtDirectFormPostResult resetRequest(@RequestParam("email") String email) {
		List<User> users = this.jpaQueryFactory
				.selectFrom(QUser.user).where(QUser.user.loginName.eq(email)
						.or(QUser.user.email.eq(email)).and(QUser.user.deleted.isFalse()))
				.fetch();

		if (users.size() > 1) {
			users = users.stream().filter(u -> u.getLoginName().equals(email))
					.collect(Collectors.toList());
		}

		if (users.size() == 1) {
			User user = users.iterator().next();

			String token = UUID.randomUUID().toString();
			this.mailService.sendPasswortResetEmail(user, token);

			user.setPasswordResetTokenValidUntil(
					ZonedDateTime.now(ZoneOffset.UTC).plusHours(4));
			user.setPasswordResetToken(token);
		}

		return new ExtDirectFormPostResult();
	}

	@ExtDirectMethod(ExtDirectMethodType.FORM_POST)
	@Transactional
	public ExtDirectFormPostResult reset(@RequestParam("newPassword") String newPassword,
			@RequestParam("newPasswordRetype") String newPasswordRetype,
			@RequestParam("token") String token) {

		if (StringUtils.hasText(token) && StringUtils.hasText(newPassword)
				&& StringUtils.hasText(newPasswordRetype)
				&& newPassword.equals(newPasswordRetype)) {
			String decodedToken = new String(Base64.getUrlDecoder().decode(token));
			User user = this.jpaQueryFactory.selectFrom(QUser.user)
					.where(QUser.user.passwordResetToken.eq(decodedToken),
							QUser.user.deleted.isFalse(), QUser.user.enabled.isTrue())
					.fetchFirst();
			if (user != null && user.getPasswordResetTokenValidUntil() != null) {

				ExtDirectFormPostResult result;

				if (user.getPasswordResetTokenValidUntil()
						.isAfter(ZonedDateTime.now(ZoneOffset.UTC))) {
					user.setPasswordHash(this.passwordEncoder.encode(newPassword));
					user.setSecret(null);

					JpaUserDetails principal = new JpaUserDetails(user);
					UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
							principal, null, principal.getAuthorities());
					SecurityContextHolder.getContext().setAuthentication(authToken);

					result = new ExtDirectFormPostResult();
					result.addResultProperty(AUTH_USER,
							new UserDetailDto(principal, user, null));
				}
				else {
					result = new ExtDirectFormPostResult(false);
				}
				user.setPasswordResetToken(null);
				user.setPasswordResetTokenValidUntil(null);
				this.jpaQueryFactory.getEntityManager().merge(user);

				return result;
			}
		}

		return new ExtDirectFormPostResult(false);
	}

	@ExtDirectMethod
	@RequireAdminAuthority
	@Transactional(readOnly = true)
	public UserDetailDto switchUser(Long userId) {
		User switchToUser = this.jpaQueryFactory.getEntityManager().find(User.class,
				userId);
		if (switchToUser != null) {

			JpaUserDetails principal = new JpaUserDetails(switchToUser);
			UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
					principal, null, principal.getAuthorities());

			SecurityContextHolder.getContext().setAuthentication(token);

			return new UserDetailDto(principal, switchToUser, null);
		}

		return null;
	}

	@ExtDirectMethod(value = POLL, event = "heartbeat")
	@RequireAnyAuthority
	public void heartbeat() {
		// nothing here
	}

}

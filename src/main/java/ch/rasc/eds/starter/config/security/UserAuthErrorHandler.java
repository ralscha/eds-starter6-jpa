package ch.rasc.eds.starter.config.security;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import ch.rasc.eds.starter.Application;
import ch.rasc.eds.starter.config.AppProperties;
import ch.rasc.eds.starter.entity.QUser;
import ch.rasc.eds.starter.entity.User;
import ch.rasc.eds.starter.util.JPAQueryFactory;

@Component
public class UserAuthErrorHandler
		implements ApplicationListener<AuthenticationFailureBadCredentialsEvent> {

	private final JPAQueryFactory jpaQueryFactory;

	private final Integer loginLockAttempts;

	private final Integer loginLockMinutes;

	private final TransactionTemplate transactionTemplate;

	public UserAuthErrorHandler(JPAQueryFactory jpaQueryFactory,
			TransactionTemplate transactionTemplate, AppProperties appProperties) {
		this.jpaQueryFactory = jpaQueryFactory;
		this.transactionTemplate = transactionTemplate;
		this.loginLockAttempts = appProperties.getLoginLockAttempts();
		this.loginLockMinutes = appProperties.getLoginLockMinutes();
	}

	@Override
	public void onApplicationEvent(AuthenticationFailureBadCredentialsEvent event) {
		this.transactionTemplate.execute(ts -> {
			updateLockedProperties(event);
			return null;
		});
	}

	private void updateLockedProperties(AuthenticationFailureBadCredentialsEvent event) {
		Object principal = event.getAuthentication().getPrincipal();

		if (this.loginLockAttempts != null
				&& (principal instanceof String || principal instanceof JpaUserDetails)) {

			User user = null;
			if (principal instanceof String) {
				user = this.jpaQueryFactory.selectFrom(QUser.user)
						.where(QUser.user.loginName.eq((String) principal))
						.where(QUser.user.deleted.isFalse()).fetchFirst();
			}
			else {
				user = ((JpaUserDetails) principal).getUser(this.jpaQueryFactory);
			}

			if (user != null) {
				if (user.getFailedLogins() == null) {
					user.setFailedLogins(1);
				}
				else {
					user.setFailedLogins(user.getFailedLogins() + 1);
				}

				if (user.getFailedLogins() >= this.loginLockAttempts) {
					if (this.loginLockMinutes != null) {
						user.setLockedOutUntil(ZonedDateTime.now(ZoneOffset.UTC)
								.plusMinutes(this.loginLockMinutes));
					}
					else {
						user.setLockedOutUntil(
								ZonedDateTime.now(ZoneOffset.UTC).plusYears(1000));
					}
				}
				this.jpaQueryFactory.getEntityManager().merge(user);
			}
			else {
				Application.logger.warn("Unknown user login attempt: {}", principal);
			}
		}
		else {
			Application.logger.warn("Invalid login attempt: {}", principal);
		}
	}

}

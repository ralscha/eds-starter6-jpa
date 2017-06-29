package ch.rasc.eds.starter.config.security;

import java.security.SecureRandom;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Base64;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.rememberme.AbstractRememberMeServices;
import org.springframework.security.web.authentication.rememberme.CookieTheftException;
import org.springframework.security.web.authentication.rememberme.InvalidCookieException;
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.util.StringUtils;

import com.querydsl.core.Tuple;

import ch.rasc.eds.starter.Application;
import ch.rasc.eds.starter.config.AppProperties;
import ch.rasc.eds.starter.entity.PersistentLogin;
import ch.rasc.eds.starter.entity.QPersistentLogin;
import ch.rasc.eds.starter.entity.QUser;
import ch.rasc.eds.starter.entity.User;
import ch.rasc.eds.starter.util.JPAQueryFactory;

/**
 * Copy of the CustomPersistentRememberMeServices class from the
 * <a href="https://jhipster.github.io/">JHipster</a> project
 *
 * Custom implementation of Spring Security's RememberMeServices.
 * <p/>
 * Persistent tokens are used by Spring Security to automatically log in users.
 * <p/>
 * This is a specific implementation of Spring Security's remember-me authentication, but
 * it is much more powerful than the standard implementations:
 * <ul>
 * <li>It allows a user to see the list of his currently opened sessions, and invalidate
 * them</li>
 * <li>It stores more information, such as the IP address and the user agent, for audit
 * purposes
 * <li>
 * <li>When a user logs out, only his current session is invalidated, and not all of his
 * sessions</li>
 * </ul>
 * <p/>
 * This is inspired by:
 * <ul>
 * <li><a href="http://jaspan.com/improved_persistent_login_cookie_best_practice">Improved
 * Persistent Login Cookie Best Practice</a></li>
 * <li><a href="https://github.com/blog/1661-modeling-your-app-s-user-session">Github's
 * "Modeling your App's User Session"</a></li></li>
 * </ul>
 * <p/>
 * The main algorithm comes from Spring Security's PersistentTokenBasedRememberMeServices,
 * but this class couldn't be cleanly extended.
 * <p/>
 */
@Component
public class CustomPersistentRememberMeServices extends AbstractRememberMeServices {

	private static final int DEFAULT_SERIES_LENGTH = 16;

	private static final int DEFAULT_TOKEN_LENGTH = 16;

	private final SecureRandom random;

	private final JPAQueryFactory jpaQueryFactory;

	private final int tokenValidInSeconds;

	private final TransactionTemplate transactionTemplate;

	public CustomPersistentRememberMeServices(JPAQueryFactory jpaQueryFactory,
			TransactionTemplate transactionTemplate,
			UserDetailsService userDetailsService, AppProperties appProperties) {
		super(appProperties.getRemembermeCookieKey(), userDetailsService);

		this.tokenValidInSeconds = 60 * 60 * 24
				* appProperties.getRemembermeCookieValidInDays();

		this.jpaQueryFactory = jpaQueryFactory;
		this.transactionTemplate = transactionTemplate;
		this.random = new SecureRandom();
	}

	@Override
	protected UserDetails processAutoLoginCookie(String[] cookieTokens,
			HttpServletRequest request, HttpServletResponse response) {

		String series = getPersistentToken(cookieTokens);

		return this.transactionTemplate.execute(ts -> {
			this.jpaQueryFactory.update(QPersistentLogin.persistentLogin)
					.set(QPersistentLogin.persistentLogin.lastUsed,
							ZonedDateTime.now(ZoneOffset.UTC))
					.set(QPersistentLogin.persistentLogin.token, generateTokenData())
					.set(QPersistentLogin.persistentLogin.ipAddress,
							request.getRemoteAddr())
					.set(QPersistentLogin.persistentLogin.userAgent,
							getUserAgent(request))
					.where(QPersistentLogin.persistentLogin.series.eq(series)).execute();

			Tuple result = this.jpaQueryFactory
					.select(QPersistentLogin.persistentLogin.token, QUser.user.loginName)
					.from(QPersistentLogin.persistentLogin)
					.innerJoin(QPersistentLogin.persistentLogin.user, QUser.user)
					.where(QPersistentLogin.persistentLogin.series.eq(series))
					.fetchFirst();

			String loginName = result.get(QUser.user.loginName);
			String token = result.get(QPersistentLogin.persistentLogin.token);

			Application.logger.debug(
					"Refreshing persistent login token for user '{}', series '{}'",
					loginName, series);

			addCookie(series, token, request, response);

			return getUserDetailsService().loadUserByUsername(loginName);
		});

	}

	/**
	 * Creates a new persistent login token with a new series number, stores the data in
	 * the persistent token repository and adds the corresponding cookie to the response.
	 *
	 */
	@Override
	protected void onLoginSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication successfulAuthentication) {

		String loginName = successfulAuthentication.getName();

		Application.logger.debug("Creating new persistent login for user {}", loginName);

		User u = this.transactionTemplate.execute(ts -> {
			User user = this.jpaQueryFactory.selectFrom(QUser.user).where(
					QUser.user.loginName.eq(loginName).and(QUser.user.deleted.isFalse()))
					.fetchFirst();

			if (user != null) {
				PersistentLogin newPersistentLogin = new PersistentLogin();
				newPersistentLogin.setSeries(generateSeriesData());
				newPersistentLogin.setUser(user);
				newPersistentLogin.setToken(generateTokenData());
				newPersistentLogin.setLastUsed(ZonedDateTime.now(ZoneOffset.UTC));
				newPersistentLogin.setIpAddress(request.getRemoteAddr());
				newPersistentLogin.setUserAgent(getUserAgent(request));
				this.jpaQueryFactory.getEntityManager().persist(newPersistentLogin);

				addCookie(newPersistentLogin.getSeries(), newPersistentLogin.getToken(),
						request, response);
			}
			return user;
		});

		if (u == null) {
			throw new UsernameNotFoundException(
					"User " + loginName + " was not found in the database");
		}

	}

	private static String getUserAgent(HttpServletRequest request) {
		String userAgent = request.getHeader(HttpHeaders.USER_AGENT);
		if (StringUtils.hasText(userAgent)) {
			return userAgent.substring(0, Math.min(userAgent.length(), 255));
		}
		return null;
	}

	/**
	 * When logout occurs, only invalidate the current token, and not all user sessions.
	 * <p/>
	 * The standard Spring Security implementations are too basic: they invalidate all
	 * tokens for the current user, so when he logs out from one browser, all his other
	 * sessions are destroyed.
	 */
	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) {

		String rememberMeCookie = extractRememberMeCookie(request);
		if (rememberMeCookie != null && rememberMeCookie.length() != 0) {
			try {
				String[] cookieTokens = decodeCookie(rememberMeCookie);
				removePersistentLogin(getPersistentToken(cookieTokens));
			}
			catch (InvalidCookieException ice) {
				Application.logger
						.info("Invalid cookie, no persistent token could be deleted");
			}
			catch (RememberMeAuthenticationException rmae) {
				Application.logger
						.debug("No persistent token found, so no token could be deleted");
			}
		}

		super.logout(request, response, authentication);
	}

	private void removePersistentLogin(String series) {
		this.transactionTemplate.execute(ts -> {
			this.jpaQueryFactory.delete(QPersistentLogin.persistentLogin)
					.where(QPersistentLogin.persistentLogin.series.eq(series)).execute();
			return null;
		});
	}

	/**
	 * Validate the token and return it.
	 */
	private String getPersistentToken(String[] cookieTokens) {

		if (cookieTokens.length != 2) {
			throw new InvalidCookieException("Cookie token did not contain " + 2
					+ " tokens, but contained '" + Arrays.toString(cookieTokens) + "'");
		}

		final String presentedSeries = cookieTokens[0];
		final String presentedToken = cookieTokens[1];

		Tuple persistentLogin = this.transactionTemplate.execute(ts -> {
			return this.jpaQueryFactory
					.select(QPersistentLogin.persistentLogin.series,
							QPersistentLogin.persistentLogin.token,
							QPersistentLogin.persistentLogin.lastUsed)
					.from(QPersistentLogin.persistentLogin)
					.where(QPersistentLogin.persistentLogin.series.eq(presentedSeries))
					.fetchFirst();
		});

		if (persistentLogin == null) {
			// No series match, so we can't authenticate using this cookie
			throw new RememberMeAuthenticationException(
					"No persistent token found for series id: " + presentedSeries);
		}

		String token = persistentLogin.get(QPersistentLogin.persistentLogin.token);
		String series = persistentLogin.get(QPersistentLogin.persistentLogin.series);

		// We have a match for this user/series combination
		if (!presentedToken.equals(token)) {
			// Presented token doesn't match stored token. Delete persistentLogin
			removePersistentLogin(series);

			throw new CookieTheftException(this.messages.getMessage(
					"PersistentTokenBasedRememberMeServices.cookieStolen",
					"Invalid remember-me token (Series/token) mismatch. Implies previous cookie theft attack."));
		}
		ZonedDateTime lastUsed = persistentLogin
				.get(QPersistentLogin.persistentLogin.lastUsed);
		if (lastUsed != null && lastUsed.plusSeconds(this.tokenValidInSeconds)
				.isBefore(ZonedDateTime.now(ZoneOffset.UTC))) {
			removePersistentLogin(series);
			throw new RememberMeAuthenticationException("Remember-me login has expired");
		}

		return series;
	}

	private String generateSeriesData() {
		byte[] newSeries = new byte[DEFAULT_SERIES_LENGTH];
		this.random.nextBytes(newSeries);
		return Base64.getEncoder().encodeToString(newSeries);
	}

	private String generateTokenData() {
		byte[] newToken = new byte[DEFAULT_TOKEN_LENGTH];
		this.random.nextBytes(newToken);
		return Base64.getEncoder().encodeToString(newToken);
	}

	private void addCookie(String series, String token, HttpServletRequest request,
			HttpServletResponse response) {
		setCookie(new String[] { series, token }, this.tokenValidInSeconds, request,
				response);
	}

}

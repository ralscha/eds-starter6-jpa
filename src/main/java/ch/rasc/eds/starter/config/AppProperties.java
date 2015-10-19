package ch.rasc.eds.starter.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "app")
@Component
public class AppProperties {
	private String url;

	private String defaultEmailSender;

	private String remembermeCookieKey;

	private int remembermeCookieValidInDays;

	/**
	 * Number of failed login attempts until account will be locked.<br>
	 * Setting this property to null disables automatic locking.
	 * <p>
	 * Default: null (disabled)
	 */
	private Integer loginLockAttempts;

	/**
	 * How long the account will be locked after failed logins in minutes.<br>
	 * When this property is null and {@link #loginLockAttempts} is set, the application
	 * will lock the account forever.<br>
	 * Has no effect when {@link #loginLockAttempts} is null.
	 * <p>
	 * Default: null (forever)
	 */
	private Integer loginLockMinutes;

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getDefaultEmailSender() {
		return this.defaultEmailSender;
	}

	public void setDefaultEmailSender(String defaultEmailSender) {
		this.defaultEmailSender = defaultEmailSender;
	}

	public String getRemembermeCookieKey() {
		return this.remembermeCookieKey;
	}

	public void setRemembermeCookieKey(String remembermeCookieKey) {
		this.remembermeCookieKey = remembermeCookieKey;
	}

	public int getRemembermeCookieValidInDays() {
		return this.remembermeCookieValidInDays;
	}

	public void setRemembermeCookieValidInDays(int remembermeCookieValidInDays) {
		this.remembermeCookieValidInDays = remembermeCookieValidInDays;
	}

	public Integer getLoginLockAttempts() {
		return this.loginLockAttempts;
	}

	public void setLoginLockAttempts(Integer loginLockAttempts) {
		this.loginLockAttempts = loginLockAttempts;
	}

	public Integer getLoginLockMinutes() {
		return this.loginLockMinutes;
	}

	public void setLoginLockMinutes(Integer loginLockMinutes) {
		this.loginLockMinutes = loginLockMinutes;
	}

}

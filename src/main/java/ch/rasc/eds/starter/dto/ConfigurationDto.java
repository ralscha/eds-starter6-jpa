package ch.rasc.eds.starter.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(Include.NON_NULL)
public class ConfigurationDto {

	private String logLevel;

	private Integer loginLockMinutes;

	private Integer loginLockAttempts;

	public String getLogLevel() {
		return this.logLevel;
	}

	public void setLogLevel(String logLevel) {
		this.logLevel = logLevel;
	}

	public Integer getLoginLockMinutes() {
		return this.loginLockMinutes;
	}

	public void setLoginLockMinutes(Integer loginLockMinutes) {
		this.loginLockMinutes = loginLockMinutes;
	}

	public Integer getLoginLockAttempts() {
		return this.loginLockAttempts;
	}

	public void setLoginLockAttempts(Integer loginLockAttempts) {
		this.loginLockAttempts = loginLockAttempts;
	}

}

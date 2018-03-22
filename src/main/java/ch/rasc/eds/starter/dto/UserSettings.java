package ch.rasc.eds.starter.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ch.rasc.eds.starter.entity.User;
import ch.rasc.extclassgenerator.Model;

@Model(value = "Starter.model.UserSettings",
		readMethod = "userConfigService.readSettings",
		updateMethod = "userConfigService.updateSettings", rootProperty = "records")
@JsonInclude(Include.NON_NULL)
public class UserSettings {
	@NotBlank(message = "{fieldrequired}")
	private String loginName;

	@NotBlank(message = "{fieldrequired}")
	private String firstName;

	@NotBlank(message = "{fieldrequired}")
	private String lastName;

	@NotBlank(message = "{fieldrequired}")
	private String locale;

	@Email(message = "{invalidemail}")
	@NotBlank(message = "{fieldrequired}")
	private String email;

	private String currentPassword;
	private String newPassword;
	private String newPasswordRetype;
	private boolean twoFactorAuth;

	public UserSettings() {
		// default constructor
	}

	public UserSettings(User user) {
		this.loginName = user.getLoginName();
		this.firstName = user.getFirstName();
		this.lastName = user.getLastName();
		this.locale = user.getLocale();
		this.email = user.getEmail();
		this.twoFactorAuth = user.isTwoFactorAuth();
	}

	public String getLoginName() {
		return this.loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return this.lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getLocale() {
		return this.locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCurrentPassword() {
		return this.currentPassword;
	}

	public void setCurrentPassword(String currentPassword) {
		this.currentPassword = currentPassword;
	}

	public String getNewPassword() {
		return this.newPassword;
	}

	public void setNewPassword(String newPassword) {
		this.newPassword = newPassword;
	}

	public String getNewPasswordRetype() {
		return this.newPasswordRetype;
	}

	public void setNewPasswordRetype(String newPasswordRetype) {
		this.newPasswordRetype = newPasswordRetype;
	}

	public boolean isTwoFactorAuth() {
		return this.twoFactorAuth;
	}

}

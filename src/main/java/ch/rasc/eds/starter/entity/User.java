package ch.rasc.eds.starter.entity;

import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.Size;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ch.rasc.extclassgenerator.Model;
import ch.rasc.extclassgenerator.ModelField;
import ch.rasc.extclassgenerator.ModelType;

@Entity
@Table(name = "AppUser")
@Model(value = "Starter.model.User", readMethod = "userService.read",
		createMethod = "userService.update", updateMethod = "userService.update",
		destroyMethod = "userService.destroy", paging = true, identifier = "negative")
@JsonInclude(Include.NON_NULL)
@ModelField(value = "twoFactorAuth", persist = false, type = ModelType.BOOLEAN)
public class User extends AbstractPersistable {

	@NotBlank(message = "{fieldrequired}")
	@Size(max = 255)
	@Column(unique = true)
	private String loginName;

	@NotBlank(message = "{fieldrequired}")
	@Size(max = 255)
	private String lastName;

	@NotBlank(message = "{fieldrequired}")
	@Size(max = 255)
	private String firstName;

	@Email(message = "{invalidemail}")
	@Size(max = 255)
	@NotBlank(message = "{fieldrequired}")
	@Column(unique = true)
	private String email;

	private String authorities;

	@Size(max = 255)
	@JsonIgnore
	private String passwordHash;

	@NotBlank(message = "{fieldrequired}")
	@Size(max = 8)
	private String locale;

	private boolean enabled;

	@JsonIgnore
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user")
	private Set<PersistentLogin> persistentLogins = new HashSet<>();

	@ModelField(persist = false)
	private Integer failedLogins;

	@ModelField(dateFormat = "time", persist = false)
	private ZonedDateTime lockedOutUntil;

	@ModelField(dateFormat = "time", persist = false)
	private ZonedDateTime lastAccess;

	@Size(max = 36)
	@JsonIgnore
	private String passwordResetToken;

	@JsonIgnore
	private ZonedDateTime passwordResetTokenValidUntil;

	@JsonIgnore
	@Column(name = "is_deleted")
	private boolean deleted;

	@JsonIgnore
	@Size(max = 16)
	private String secret;

	public String getLoginName() {
		return this.loginName;
	}

	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	public String getLastName() {
		return this.lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return this.firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAuthorities() {
		return this.authorities;
	}

	public void setAuthorities(String authorities) {
		this.authorities = authorities;
	}

	public String getPasswordHash() {
		return this.passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	public boolean isEnabled() {
		return this.enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public String getLocale() {
		return this.locale;
	}

	public void setLocale(String locale) {
		this.locale = locale;
	}

	public Integer getFailedLogins() {
		return this.failedLogins;
	}

	public void setFailedLogins(Integer failedLogins) {
		this.failedLogins = failedLogins;
	}

	public ZonedDateTime getLockedOutUntil() {
		return this.lockedOutUntil;
	}

	public void setLockedOutUntil(ZonedDateTime lockedOutUntil) {
		this.lockedOutUntil = lockedOutUntil;
	}

	public ZonedDateTime getLastAccess() {
		return this.lastAccess;
	}

	public void setLastAccess(ZonedDateTime lastAccess) {
		this.lastAccess = lastAccess;
	}

	public String getPasswordResetToken() {
		return this.passwordResetToken;
	}

	public void setPasswordResetToken(String passwordResetToken) {
		this.passwordResetToken = passwordResetToken;
	}

	public ZonedDateTime getPasswordResetTokenValidUntil() {
		return this.passwordResetTokenValidUntil;
	}

	public void setPasswordResetTokenValidUntil(
			ZonedDateTime passwordResetTokenValidUntil) {
		this.passwordResetTokenValidUntil = passwordResetTokenValidUntil;
	}

	public boolean isDeleted() {
		return this.deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public Set<PersistentLogin> getPersistentLogins() {
		return this.persistentLogins;
	}

	public void setPersistentLogins(Set<PersistentLogin> persistentLogins) {
		this.persistentLogins = persistentLogins;
	}

	public String getSecret() {
		return this.secret;
	}

	public void setSecret(String secret) {
		this.secret = secret;
	}

	public boolean isTwoFactorAuth() {
		return StringUtils.hasText(this.getSecret());
	}

}

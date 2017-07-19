package ch.rasc.eds.starter.config.security;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.Locale;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;

import ch.rasc.eds.starter.entity.User;
import ch.rasc.eds.starter.util.JPAQueryFactory;

public class JpaUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;

	private Collection<GrantedAuthority> authorities;

	private final String userAuthorities;

	private final String password;

	private final String loginName;

	private final boolean enabled;

	private final Long userDbId;

	private final boolean locked;

	private final Locale locale;

	public JpaUserDetails(User user) {
		this.userDbId = user.getId();

		this.password = user.getPasswordHash();
		this.loginName = user.getLoginName();
		this.enabled = user.isEnabled();

		if (StringUtils.hasText(user.getLocale())) {
			this.locale = new Locale(user.getLocale());
		}
		else {
			this.locale = Locale.ENGLISH;
		}

		this.locked = user.getLockedOutUntil() != null
				&& user.getLockedOutUntil().isAfter(ZonedDateTime.now(ZoneOffset.UTC));

		this.userAuthorities = user.getAuthorities();

		if (StringUtils.hasText(user.getSecret())) {
			this.authorities = Collections.unmodifiableCollection(
					AuthorityUtils.createAuthorityList("PRE_AUTH"));
		}
		else {
			this.authorities = Collections.unmodifiableCollection(AuthorityUtils
					.commaSeparatedStringToAuthorityList(user.getAuthorities()));
		}
	}

	public boolean isPreAuth() {
		return hasAuthority("PRE_AUTH");
	}

	public void grantAuthorities() {
		this.authorities = Collections.unmodifiableCollection(
				AuthorityUtils.commaSeparatedStringToAuthorityList(this.userAuthorities));
	}

	@Override
	public Collection<GrantedAuthority> getAuthorities() {
		return this.authorities;
	}

	@Override
	public String getPassword() {
		return this.password;
	}

	@Override
	public String getUsername() {
		return this.loginName;
	}

	public User getUser(JPAQueryFactory jpaQueryFactory) {
		User user = jpaQueryFactory.getEntityManager().find(User.class, getUserDbId());

		if (user != null && !user.isDeleted()) {
			return user;
		}

		return null;
	}

	public Long getUserDbId() {
		return this.userDbId;
	}

	public Locale getLocale() {
		return this.locale;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return !this.locked;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return this.enabled;
	}

	public boolean hasAuthority(String authority) {
		return getAuthorities().stream()
				.anyMatch(a -> authority.equals(a.getAuthority()));
	}

}

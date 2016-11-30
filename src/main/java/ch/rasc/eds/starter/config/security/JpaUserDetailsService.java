package ch.rasc.eds.starter.config.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ch.rasc.eds.starter.entity.QUser;
import ch.rasc.eds.starter.entity.User;
import ch.rasc.eds.starter.util.JPAQueryFactory;

@Component
public class JpaUserDetailsService implements UserDetailsService {

	private final JPAQueryFactory jpaQueryFactory;

	public JpaUserDetailsService(JPAQueryFactory jpaQueryFactory) {
		this.jpaQueryFactory = jpaQueryFactory;
	}

	@Override
	@Transactional(readOnly = true)
	public UserDetails loadUserByUsername(String loginName)
			throws UsernameNotFoundException {
		User user = this.jpaQueryFactory.selectFrom(QUser.user).where(
				QUser.user.loginName.eq(loginName).and(QUser.user.deleted.isFalse()))
				.fetchFirst();

		if (user != null) {
			return new JpaUserDetails(user);
		}

		throw new UsernameNotFoundException(loginName);
	}

}

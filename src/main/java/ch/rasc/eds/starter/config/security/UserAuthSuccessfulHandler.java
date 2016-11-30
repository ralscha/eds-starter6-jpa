package ch.rasc.eds.starter.config.security;

import org.springframework.context.ApplicationListener;
import org.springframework.security.authentication.event.InteractiveAuthenticationSuccessEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ch.rasc.eds.starter.entity.QUser;
import ch.rasc.eds.starter.util.JPAQueryFactory;

@Component
public class UserAuthSuccessfulHandler
		implements ApplicationListener<InteractiveAuthenticationSuccessEvent> {

	private final JPAQueryFactory jpaQueryFactory;

	public UserAuthSuccessfulHandler(JPAQueryFactory jpaQueryFactory) {
		this.jpaQueryFactory = jpaQueryFactory;
	}

	@Override
	@Transactional
	public void onApplicationEvent(InteractiveAuthenticationSuccessEvent event) {
		Object principal = event.getAuthentication().getPrincipal();
		if (principal instanceof JpaUserDetails) {
			Long userId = ((JpaUserDetails) principal).getUserDbId();

			this.jpaQueryFactory.update(QUser.user).setNull(QUser.user.lockedOutUntil)
					.setNull(QUser.user.failedLogins).where(QUser.user.id.eq(userId))
					.execute();
		}
	}
}
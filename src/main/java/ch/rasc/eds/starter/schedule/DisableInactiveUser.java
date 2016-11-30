package ch.rasc.eds.starter.schedule;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ch.rasc.eds.starter.entity.QUser;
import ch.rasc.eds.starter.util.JPAQueryFactory;

@Component
public class DisableInactiveUser {

	private final JPAQueryFactory jpaQueryFactory;

	public DisableInactiveUser(JPAQueryFactory jpaQueryFactory) {
		this.jpaQueryFactory = jpaQueryFactory;
	}

	@Transactional
	@Scheduled(cron = "0 0 5 * * *")
	public void doCleanup() {
		// Inactivate users that have a lastAccess timestamp that is older than one year
		ZonedDateTime oneYearAgo = ZonedDateTime.now(ZoneOffset.UTC).minusYears(1);
		this.jpaQueryFactory.update(QUser.user).set(QUser.user.enabled, false)
				.where(QUser.user.lastAccess.loe(oneYearAgo)).execute();
	}

}

package ch.rasc.eds.starter.config;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import com.querydsl.core.types.dsl.Expressions;

import ch.rasc.eds.starter.entity.Authority;
import ch.rasc.eds.starter.entity.QUser;
import ch.rasc.eds.starter.entity.User;
import ch.rasc.eds.starter.util.JPAQueryFactory;

@Component
class Startup {

	private final JPAQueryFactory jpaQueryFactory;

	private final PasswordEncoder passwordEncoder;

	public Startup(JPAQueryFactory jpaQueryFactory, PasswordEncoder passwordEncoder,
			TransactionTemplate transactionTemplate) {
		this.jpaQueryFactory = jpaQueryFactory;
		this.passwordEncoder = passwordEncoder;

		transactionTemplate.execute(ts -> {
			init();
			return null;
		});
	}

	private void init() {

		if (this.jpaQueryFactory.select(Expressions.ONE).from(QUser.user)
				.fetchFirst() == null) {
			// admin user
			User adminUser = new User();
			adminUser.setLoginName("admin");
			adminUser.setEmail("admin@starter.com");
			adminUser.setFirstName("admin");
			adminUser.setLastName("admin");
			adminUser.setLocale("en");
			adminUser.setPasswordHash(this.passwordEncoder.encode("admin"));
			adminUser.setEnabled(true);
			adminUser.setDeleted(false);
			adminUser.setAuthorities(Authority.ADMIN.name());
			this.jpaQueryFactory.getEntityManager().persist(adminUser);

			// normal user
			User normalUser = new User();
			normalUser.setLoginName("user");
			normalUser.setEmail("user@starter.com");
			normalUser.setFirstName("user");
			normalUser.setLastName("user");
			normalUser.setLocale("de");
			normalUser.setPasswordHash(this.passwordEncoder.encode("user"));
			normalUser.setEnabled(true);
			adminUser.setDeleted(false);
			normalUser.setAuthorities(Authority.USER.name());
			this.jpaQueryFactory.getEntityManager().persist(normalUser);
		}

	}

}

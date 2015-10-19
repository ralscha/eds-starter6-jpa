package ch.rasc.eds.starter.util;

import javax.persistence.EntityManager;

public class JPAQueryFactory extends com.querydsl.jpa.impl.JPAQueryFactory {

	private final EntityManager entityManager;

	public JPAQueryFactory(EntityManager entityManager) {
		super(entityManager);
		this.entityManager = entityManager;
	}

	public EntityManager getEntityManager() {
		return this.entityManager;
	}

}

package ch.rasc.eds.starter;

import java.lang.invoke.MethodHandles;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.mustache.MustacheAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import ch.ralscha.extdirectspring.ExtDirectSpring;
import ch.ralscha.extdirectspring.controller.ApiController;
import ch.rasc.eds.starter.entity.AbstractPersistable;

@Configuration
@ComponentScan(basePackageClasses = { ExtDirectSpring.class, Application.class },
		excludeFilters = { @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE,
				value = ApiController.class) })
@EnableAutoConfiguration(exclude = { MustacheAutoConfiguration.class,
		SpringDataWebAutoConfiguration.class })
@EnableAsync
@EnableScheduling
@EntityScan(basePackageClasses = AbstractPersistable.class)
public class Application {

	public static final Logger logger = LoggerFactory
			.getLogger(MethodHandles.lookup().lookupClass());

	public static void main(String[] args) {
		// -Dspring.profiles.active=development
		SpringApplication.run(Application.class, args);
	}

}

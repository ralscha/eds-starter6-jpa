package ch.rasc.eds.starter.config;

import java.util.Collections;
import java.util.Locale;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.servlet.LocaleResolver;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.samskivert.mustache.Mustache;

import ch.ralscha.extdirectspring.util.JsonHandler;

@Configuration
public class WebConfig {

	@Bean
	public ch.ralscha.extdirectspring.controller.Configuration configuration() {
		ch.ralscha.extdirectspring.controller.Configuration config = new ch.ralscha.extdirectspring.controller.Configuration();
		config.setExceptionToMessage(
				Collections.singletonMap(AccessDeniedException.class, "accessdenied"));
		return config;
	}

	@Bean
	public JsonHandler jsonHandler(ObjectMapper objectMapper) {
		JsonHandler jh = new JsonHandler();
		jh.setMapper(objectMapper);
		return jh;
	}

	@Bean
	public LocaleResolver localeResolver() {
		AppLocaleResolver resolver = new AppLocaleResolver();
		resolver.setDefaultLocale(Locale.ENGLISH);
		return resolver;
	}

	@Bean
	public Mustache.Compiler mustacheCompiler() {
		return Mustache.compiler();
	}
}

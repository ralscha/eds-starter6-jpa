package ch.rasc.eds.starter.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;

import ch.rasc.eds.starter.config.AppProperties;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
class SecurityConfig {

	private final RememberMeServices rememberMeServices;

	private final AppProperties appProperties;

	private final AuthenticationSuccessHandler authenticationSuccessHandler;

	private final Environment environment;

	SecurityConfig(RememberMeServices rememberMeServices, AppProperties appProperties,
			AuthenticationSuccessHandler authenticationSuccessHandler,
			Environment environment) {
		this.rememberMeServices = rememberMeServices;
		this.appProperties = appProperties;
		this.authenticationSuccessHandler = authenticationSuccessHandler;
		this.environment = environment;
	}

	private DaoAuthenticationProvider authenticationProvider(
			UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(
				userDetailsService);
		provider.setPasswordEncoder(passwordEncoder);
		return provider;
	}

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http,
			UserDetailsService userDetailsService, PasswordEncoder passwordEncoder)
			throws Exception {
		// @formatter:off
		http
		  .authenticationProvider(authenticationProvider(userDetailsService,
		    passwordEncoder))
		  .authorizeHttpRequests(authorize -> authorize
		    .requestMatchers(publicResourceMatchers()).permitAll()
		    .requestMatchers("/index.html", "/csrf", "/", "/router").permitAll()
		    .requestMatchers("/actuator/info", "/actuator/health",
		      "/actuator/health/**").permitAll()
		    .anyRequest().authenticated())
		  .rememberMe(rememberMe -> rememberMe
		    .rememberMeServices(this.rememberMeServices)
		    .key(this.appProperties.getRemembermeCookieKey()))
		  .formLogin(formLogin -> formLogin
		    .successHandler(this.authenticationSuccessHandler)
		    .failureHandler(new JsonAuthFailureHandler())
		    .permitAll())
		  .logout(logout -> logout
		    .logoutSuccessHandler(new HttpStatusReturningLogoutSuccessHandler())
		    .deleteCookies("JSESSIONID")
		    .permitAll())
		  .exceptionHandling(exceptionHandling -> exceptionHandling
		    .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)));
		// @formatter:on
		return http.build();
	}

	private String[] publicResourceMatchers() {
		if (this.environment.acceptsProfiles(Profiles.of("development"))) {
			return new String[] { "/resources/**", "/build/**", "/ext/**", "/app/**",
					"/overrides/**", "/app.js", "/app.json", "/api.js",
					"/bootstrap.json", "/locale-de.js", "/i18n-de.js", "/i18n-en.js",
					"/robots.txt" };
		}
		return new String[] { "/resources/**", "/app.js", "/app.json",
				"/locale-de.js", "/i18n-de.js", "/i18n-en.js", "/robots.txt" };
	}

}

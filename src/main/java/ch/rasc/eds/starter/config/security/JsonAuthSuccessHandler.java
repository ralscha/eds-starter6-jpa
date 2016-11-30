package ch.rasc.eds.starter.config.security;

import java.io.IOException;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;

import ch.rasc.eds.starter.dto.UserDetailDto;
import ch.rasc.eds.starter.entity.User;
import ch.rasc.eds.starter.service.SecurityService;
import ch.rasc.eds.starter.util.JPAQueryFactory;
import ch.rasc.eds.starter.web.CsrfController;

@Component
public class JsonAuthSuccessHandler implements AuthenticationSuccessHandler {

	private final JPAQueryFactory jpaQueryFactory;

	private final ObjectMapper objectMapper;

	public JsonAuthSuccessHandler(JPAQueryFactory jpaQueryFactory,
			ObjectMapper objectMapper) {
		this.jpaQueryFactory = jpaQueryFactory;
		this.objectMapper = objectMapper;
	}

	@Override
	@Transactional
	public void onAuthenticationSuccess(HttpServletRequest request,
			HttpServletResponse response, Authentication authentication)
			throws IOException, ServletException {

		Map<String, Object> result = new HashMap<>();
		result.put("success", true);

		JpaUserDetails jpaUserDetails = (JpaUserDetails) authentication.getPrincipal();
		if (jpaUserDetails != null) {
			User user = jpaUserDetails.getUser(this.jpaQueryFactory);
			if (!jpaUserDetails.isPreAuth()) {
				user.setLastAccess(ZonedDateTime.now(ZoneOffset.UTC));
			}
			result.put(SecurityService.AUTH_USER, new UserDetailDto(jpaUserDetails, user,
					CsrfController.getCsrfToken(request)));
		}

		response.getWriter().print(this.objectMapper.writeValueAsString(result));
		response.getWriter().flush();
	}

}
package ch.rasc.eds.starter.config.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.WebUtils;

public class CsrfCookieFilter extends OncePerRequestFilter {

	private static final String X_CSRF_TOKEN = "X-CSRF-TOKEN";

	@Override
	protected void doFilterInternal(HttpServletRequest request,
			HttpServletResponse response, FilterChain filterChain)
					throws ServletException, IOException {
		addCsrfCookie(request, response);
		filterChain.doFilter(request, response);
	}

	public static void addCsrfCookie(HttpServletRequest request,
			HttpServletResponse response) {
		CsrfToken csrf = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
		if (csrf != null) {
			Cookie cookie = WebUtils.getCookie(request, X_CSRF_TOKEN);
			String token = csrf.getToken();
			if (cookie == null || token != null && !token.equals(cookie.getValue())) {
				cookie = new Cookie(X_CSRF_TOKEN, token);
				cookie.setMaxAge(-1);
				cookie.setHttpOnly(false);
				cookie.setPath("/");
				response.addCookie(cookie);
			}
		}
	}

}
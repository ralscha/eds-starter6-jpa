package ch.rasc.eds.starter.config.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

/**
 * Returns a 401 error code (Unauthorized) to the client.
 */
public class Http401UnauthorizedEntryPoint implements AuthenticationEntryPoint {

	/**
	 * Always returns a 401 error code to the client.
	 */
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException arg) throws IOException, ServletException {
		response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Access Denied");
	}
}

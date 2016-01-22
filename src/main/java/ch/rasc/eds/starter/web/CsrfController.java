package ch.rasc.eds.starter.web;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CsrfController {

	@RequestMapping("/csrf")
	public CsrfToken csrf(CsrfToken token) {
		return token;
	}

	public static String getCsrfToken(HttpServletRequest request) {
		CsrfToken token = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
		if (token != null) {
			return token.getToken();
		}
		return null;
	}
}
package ch.rasc.eds.starter.service;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import ch.rasc.eds.starter.config.security.RequireAdminAuthority;

@Controller
public class SystemService {

	private final MailService mailService;

	public SystemService(MailService mailService) {
		this.mailService = mailService;
	}

	@RequestMapping(path = "/sendtestemail", method = RequestMethod.GET)
	@RequireAdminAuthority
	@ResponseBody
	public void sendTestEmail(@RequestParam(value = "to") String to) {
		this.mailService.sendSimpleMessage(to, "TEST EMAIL", "THIS IS A TEST MESSAGE");
	}

}

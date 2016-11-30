package ch.rasc.eds.starter.service;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Base64;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.samskivert.mustache.Mustache;
import com.samskivert.mustache.Template;

import ch.rasc.eds.starter.Application;
import ch.rasc.eds.starter.config.AppProperties;
import ch.rasc.eds.starter.entity.User;

@Service
public class MailService {

	private final JavaMailSender mailSender;

	private final String defaultSender;

	private final MessageSource messageSource;

	private final String appUrl;

	private final String appName;

	private final Mustache.Compiler mustacheCompiler;

	public MailService(JavaMailSender mailSender, MessageSource messageSource,
			AppProperties appProperties, Mustache.Compiler mustacheCompiler,
			@Value("${info.app.name}") String appName) {
		this.mailSender = mailSender;
		this.defaultSender = appProperties.getDefaultEmailSender();
		this.messageSource = messageSource;
		this.appUrl = appProperties.getUrl();
		this.appName = appName;
		this.mustacheCompiler = mustacheCompiler;
	}

	@Async
	public void sendSimpleMessage(String to, String subject, String text) {
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setFrom(this.defaultSender);
		mailMessage.setTo(to);
		mailMessage.setText(text);
		mailMessage.setSubject(subject);
		this.mailSender.send(mailMessage);
	}

	@Async
	public void sendPasswortResetEmail(User receiver, String token) {
		String link = this.appUrl + "?token="
				+ Base64.getUrlEncoder().encodeToString(token.getBytes());

		try {
			Locale userLocale = new Locale(receiver.getLocale());
			sendHtmlMessage(this.defaultSender, receiver.getEmail(),
					this.appName + ": "
							+ this.messageSource.getMessage("user_pwreset_emailsubject",
									null, userLocale),
					getEmailText(userLocale, receiver.getLoginName(), link));
		}
		catch (MessagingException | IOException e) {
			Application.logger.error("sendPasswortResetEmail", e);
		}
	}

	private String getEmailText(Locale locale, String loginName, String link)
			throws IOException {
		String resource = "pwreset_email.mustache";
		if (locale != null && locale.getLanguage().toLowerCase().equals("de")) {
			resource = "pwreset_email_de.mustache";
		}
		ClassPathResource cp = new ClassPathResource(resource);
		try (InputStream is = cp.getInputStream()) {
			Template template = this.mustacheCompiler.compile(new InputStreamReader(is));

			Map<String, Object> data = new HashMap<>();
			data.put("loginName", loginName);
			data.put("link", link);

			return template.execute(data);
		}
	}

	@Async
	public void sendHtmlMessage(String from, String to, String subject, String text)
			throws MessagingException {
		MimeMessage message = this.mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message);
		helper.setFrom(this.defaultSender);
		helper.setTo(to);
		helper.setReplyTo(from);
		helper.setText(text, true);
		helper.setSubject(subject);

		this.mailSender.send(message);
	}

}

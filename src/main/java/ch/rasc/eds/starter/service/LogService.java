package ch.rasc.eds.starter.service;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.rasc.eds.starter.Application;

@Service
public class LogService {

	private final static String lineSeparator = System.getProperty("line.separator");

	@ExtDirectMethod
	@Async
	public void logClientCrash(@RequestHeader(value = HttpHeaders.USER_AGENT,
			required = false) String userAgent, Map<String, Object> crashData) {

		StringBuilder sb = new StringBuilder();
		sb.append("JavaScript Error");
		sb.append(lineSeparator);
		sb.append("User-Agent: " + userAgent);
		crashData.forEach((k, v) -> {
			sb.append(lineSeparator);
			sb.append(k);
			sb.append(": ");
			sb.append(v);
		});

		Application.logger.error(sb.toString());
	}

}

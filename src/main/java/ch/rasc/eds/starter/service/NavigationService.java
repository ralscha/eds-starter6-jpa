package ch.rasc.eds.starter.service;

import static ch.ralscha.extdirectspring.annotation.ExtDirectMethodType.TREE_LOAD;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.context.MessageSource;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import ch.ralscha.extdirectspring.annotation.ExtDirectMethod;
import ch.rasc.eds.starter.config.security.JpaUserDetails;
import ch.rasc.eds.starter.dto.NavigationNode;
import ch.rasc.eds.starter.entity.Authority;

@Service
public class NavigationService {

	private final MessageSource messageSource;

	private final List<NavigationNode> rootNodes = new ArrayList<>();

	public NavigationService(MessageSource messageSource) {
		this.messageSource = messageSource;

		this.rootNodes.add(new NavigationNode("user_users", "user.Container", true, null,
				"x-fa fa-users", "users", Authority.ADMIN));

		this.rootNodes.add(new NavigationNode("Blank", "main.BlankPage", true, null,
				"x-fa fa-clock-o", "blank", Authority.USER));
	}

	@ExtDirectMethod(TREE_LOAD)
	public List<NavigationNode> getNavigation(Locale locale,
			@AuthenticationPrincipal JpaUserDetails jpaUserDetails) {

		if (jpaUserDetails != null && !jpaUserDetails.isPreAuth()) {
			return this.rootNodes.stream()
					.map(n -> NavigationNode.copyOf(n, jpaUserDetails.getAuthorities(),
							locale, this.messageSource))
					.filter(Objects::nonNull).collect(Collectors.toList());
		}

		return Collections.emptyList();
	}

}

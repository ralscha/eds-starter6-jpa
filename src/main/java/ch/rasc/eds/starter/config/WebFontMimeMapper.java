package ch.rasc.eds.starter.config;

import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.MimeMappings;
import org.springframework.context.annotation.Configuration;

@Configuration
public class WebFontMimeMapper implements EmbeddedServletContainerCustomizer {

	@Override
	public void customize(ConfigurableEmbeddedServletContainer container) {
		MimeMappings mappings = new MimeMappings(MimeMappings.DEFAULT);
		mappings.add("eot", "application/vnd.ms-fontobject");
		mappings.add("woff", "application/font-woff");
		mappings.add("woff2", "application/font-woff2");
		mappings.add("ttf", "application/font-sfnt");
		mappings.add("otf", "application/font-sfnt");
		container.setMimeMappings(mappings);
	}
}

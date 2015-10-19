package ch.rasc.eds.starter.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@ConfigurationProperties(prefix = "spring.async")
@Component
public class AsyncProperties {

	private Integer corePoolSize;

	private Integer maxPoolSize;

	private Integer queueCapacity;

	private Integer keepAliveSeconds;

	private Boolean allowCoreThreadTimeOut;

	private Boolean waitForTasksToCompleteOnShutdown;

	private Integer awaitTerminationSeconds;

	private String threadNamePrefix;

	public Integer getCorePoolSize() {
		return this.corePoolSize;
	}

	public void setCorePoolSize(Integer corePoolSize) {
		this.corePoolSize = corePoolSize;
	}

	public Integer getMaxPoolSize() {
		return this.maxPoolSize;
	}

	public void setMaxPoolSize(Integer maxPoolSize) {
		this.maxPoolSize = maxPoolSize;
	}

	public Integer getQueueCapacity() {
		return this.queueCapacity;
	}

	public void setQueueCapacity(Integer queueCapacity) {
		this.queueCapacity = queueCapacity;
	}

	public Integer getKeepAliveSeconds() {
		return this.keepAliveSeconds;
	}

	public void setKeepAliveSeconds(Integer keepAliveSeconds) {
		this.keepAliveSeconds = keepAliveSeconds;
	}

	public Boolean getAllowCoreThreadTimeOut() {
		return this.allowCoreThreadTimeOut;
	}

	public void setAllowCoreThreadTimeOut(Boolean allowCoreThreadTimeOut) {
		this.allowCoreThreadTimeOut = allowCoreThreadTimeOut;
	}

	public Boolean getWaitForTasksToCompleteOnShutdown() {
		return this.waitForTasksToCompleteOnShutdown;
	}

	public void setWaitForTasksToCompleteOnShutdown(
			Boolean waitForTasksToCompleteOnShutdown) {
		this.waitForTasksToCompleteOnShutdown = waitForTasksToCompleteOnShutdown;
	}

	public Integer getAwaitTerminationSeconds() {
		return this.awaitTerminationSeconds;
	}

	public void setAwaitTerminationSeconds(Integer awaitTerminationSeconds) {
		this.awaitTerminationSeconds = awaitTerminationSeconds;
	}

	public String getThreadNamePrefix() {
		return this.threadNamePrefix;
	}

	public void setThreadNamePrefix(String threadNamePrefix) {
		this.threadNamePrefix = threadNamePrefix;
	}

}

package ch.rasc.eds.starter.util;

public class ValidationMessages {
	private String field;

	private String[] messages;

	public String getField() {
		return this.field;
	}

	public void setField(String field) {
		this.field = field;
	}

	public String[] getMessages() {
		return this.messages;
	}

	public void setMessages(String[] messages) {
		this.messages = messages;
	}

	public void setMessage(String message) {
		this.messages = new String[] { message };
	}
}

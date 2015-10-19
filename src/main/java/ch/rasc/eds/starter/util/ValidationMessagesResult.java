package ch.rasc.eds.starter.util;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ch.ralscha.extdirectspring.bean.ExtDirectStoreResult;

@JsonInclude(Include.NON_NULL)
public class ValidationMessagesResult<T> extends ExtDirectStoreResult<T> {
	private List<ValidationMessages> validations;

	public ValidationMessagesResult(T record) {
		super(record);
	}

	public ValidationMessagesResult(T record, List<ValidationMessages> validations) {
		super(record);
		setValidations(validations);
	}

	public List<ValidationMessages> getValidations() {
		return this.validations;
	}

	public void setValidations(List<ValidationMessages> validations) {
		this.validations = validations;
		if (this.validations != null && !this.validations.isEmpty()) {
			setSuccess(Boolean.FALSE);
		}
	}

}

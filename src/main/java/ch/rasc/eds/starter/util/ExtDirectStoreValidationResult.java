package ch.rasc.eds.starter.util;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

import ch.ralscha.extdirectspring.bean.ExtDirectStoreResult;

@JsonInclude(Include.NON_NULL)
public class ExtDirectStoreValidationResult<T> extends ExtDirectStoreResult<T> {
	private List<ValidationError> validations;

	public ExtDirectStoreValidationResult(T record) {
		super(record);
	}

	public List<ValidationError> getValidations() {
		return this.validations;
	}

	public void setValidations(List<ValidationError> validations) {
		this.validations = validations;
		if (this.validations != null && !this.validations.isEmpty()) {
			setSuccess(Boolean.FALSE);
		}
	}

}

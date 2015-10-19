package ch.rasc.eds.starter.entity;

import java.sql.Timestamp;
import java.time.LocalDate;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class LocalDateConverter implements AttributeConverter<LocalDate, Timestamp> {

	@Override
	public Timestamp convertToDatabaseColumn(LocalDate value) {
		if (value != null) {
			return Timestamp.valueOf(value.atStartOfDay());
		}
		return null;
	}

	@Override
	public LocalDate convertToEntityAttribute(Timestamp value) {
		if (value != null) {
			return value.toLocalDateTime().toLocalDate();
		}
		return null;
	}
}
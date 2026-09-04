package ch.rasc.eds.starter.entity;

import java.sql.Timestamp;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ZonedDateTimeConverter
		implements AttributeConverter<ZonedDateTime, Timestamp> {

	@Override
	public Timestamp convertToDatabaseColumn(ZonedDateTime value) {
		if (value != null) {
			return Timestamp
					.valueOf(value.withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime());
		}
		return null;
	}

	@Override
	public ZonedDateTime convertToEntityAttribute(Timestamp value) {
		if (value != null) {
			return ZonedDateTime.of(value.toLocalDateTime(), ZoneOffset.UTC);
		}
		return null;
	}

}

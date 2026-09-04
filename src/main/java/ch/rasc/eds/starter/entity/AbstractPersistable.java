package ch.rasc.eds.starter.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

import ch.rasc.extclassgenerator.ModelField;

@MappedSuperclass
public abstract class AbstractPersistable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@ModelField(useNull = true, convert = "null")
	private Long id;

	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public String toString() {
		return String.format("Entity of type %s with id: %s", this.getClass().getName(),
				getId());
	}

	@Override
	@SuppressWarnings("EqualsGetClass")
	public boolean equals(Object obj) {

		if (null == obj) {
			return false;
		}

		if (this == obj) {
			return true;
		}

		if (!getClass().equals(obj.getClass())) {
			return false;
		}

		AbstractPersistable that = (AbstractPersistable) obj;

		return null == this.getId() ? false : this.getId().equals(that.getId());
	}

	@Override
	public int hashCode() {
		int hashCode = 17;
		hashCode += null == getId() ? 0 : getId().hashCode() * 31;
		return hashCode;
	}
}

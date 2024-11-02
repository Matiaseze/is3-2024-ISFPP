from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class TipoDoc(enum.Enum):
    DNI = "DNI"
    CUIL = "CUIL"
    CUIT = "CUIT"

class Cliente(Base):
    __tablename__ = "clientes"

    dni = Column(Integer, primary_key=True, index=True)
    tipoDoc = Column(Enum(TipoDoc), nullable=False)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    domicilio = Column(String, nullable=False)
    idLocalidad = Column(Integer, ForeignKey("localidades.codPostal"))  # Agrega la clave foránea a Localidad
    baja = Column(Boolean, default=False)

    # Define la relación con Localidad
    localidad = relationship("Localidad", back_populates="clientes")

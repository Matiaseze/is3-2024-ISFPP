from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Localidad(Base):
    __tablename__ = "localidades"

    codPostal = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    baja = Column(Boolean, default=False)

    # Relación inversa con Cliente
    clientes = relationship("Cliente", back_populates="localidad")
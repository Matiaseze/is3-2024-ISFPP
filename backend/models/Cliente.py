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
    idCliente = Column(Integer, primary_key=True, index=True)
    dni = Column(Integer, nullable=False)
    tipoDoc = Column(Enum(TipoDoc), nullable=False)
    nombre = Column(String, nullable=False)
    apellido = Column(String, nullable=False)
    domicilio = Column(String, nullable=False)
    idLocalidad = Column(Integer, ForeignKey("localidades.idLocalidad"))  # Agrega la clave foránea a Localidad
    baja = Column(Boolean, default=False)

    # Define la relación con Localidad
    localidad = relationship("Localidad", back_populates="clientes")
    pagos = relationship("Pago", back_populates="cliente")
    # Relacion con pedido
    pedidos = relationship("Pedido", back_populates="cliente")

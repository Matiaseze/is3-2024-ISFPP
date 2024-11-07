from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Producto(Base):
    __tablename__ = "productos"

    idProducto = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    precio = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
    categoria = Column(String, nullable=False)
    baja = Column(Boolean, default=False)

    idMarca = Column(Integer, ForeignKey("marcas.idMarca"), nullable=False)
    marca = relationship("Marca", back_populates="productos")

    detalles_pedido = relationship("DetallePedido", back_populates="producto")
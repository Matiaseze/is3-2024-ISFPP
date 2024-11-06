from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base


class Marca(Base):
    __tablename__ = "marcas"

    idMarca = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    baja = Column(Boolean, default=False)
    
    productos = relationship("Producto", back_populates="marca")
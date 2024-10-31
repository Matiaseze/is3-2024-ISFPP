from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


class Marca(Base):
    __tablename__ = "Marca"

    idMarca = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    descripcion = Column(String, nullable=False)
    baja = Column(Boolean, default=False)
    
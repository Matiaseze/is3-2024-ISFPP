from sqlalchemy import Column, Integer, String, Boolean
from database import Base

class Categoria(Base):
    __tablename__ = "categorias"

    idCategoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False, unique=True)
    descripcion = Column(String, nullable=False)
    baja = Column(Boolean, default=False)
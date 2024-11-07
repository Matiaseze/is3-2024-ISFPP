from pydantic import BaseModel
from typing import Optional

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    idMarca: int
    precio: float
    stock: int
    categoria: str # Añadir la categoria mas tarde
    

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(ProductoBase):
    baja: bool

class ProductoResponse(ProductoBase):
    idProducto: int
    baja: bool

    class Config:
        orm_mode = True
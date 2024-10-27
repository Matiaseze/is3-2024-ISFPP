from pydantic import BaseModel
from typing import Optional

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    marca: str
    precio: float
    stock: int
    categoria: str
    

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(ProductoBase):
    baja: bool

class ProductoResponse(ProductoBase):
    idProducto: int
    baja: bool

    class Config:
        orm_mode = True
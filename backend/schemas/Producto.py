from pydantic import BaseModel
from typing import Optional
from schemas.Marca import MarcaResponse
from schemas.Categoria import CategoriaResponse

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int
    marca: MarcaResponse  # Cambiado para incluir el objeto completo MarcaResponse
    categoria: CategoriaResponse  # Cambiado para incluir el objeto completo CategoriaResponse

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    marca: MarcaResponse | None = None
    precio: float | None = None
    stock: int | None = None
    categoria: CategoriaResponse | None = None
    baja: bool | None = None

    class Config:
        orm_mode = True

class ProductoResponse(ProductoBase):
    idProducto: int
    baja: bool

    class Config:
        orm_mode = True
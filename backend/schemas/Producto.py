from pydantic import BaseModel
from typing import Optional
from schemas.Marca import MarcaResponse
from schemas.Categoria import CategoriaResponse

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    idMarca: int
    precio: float
    stock: int
    categoria: int

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    idMarca: int | None = None
    precio: float | None = None
    stock: int | None = None
    categoria: int | None = None
    baja: bool | None = None

    class Config:
        orm_mode = True

class ProductoResponse(ProductoBase):
    idProducto: int
    baja: bool
    marca: MarcaResponse  # Cambiado para incluir el objeto completo MarcaResponse
    categoria: CategoriaResponse  # Cambiado para incluir el objeto completo CategoriaResponse

    class Config:
        orm_mode = True
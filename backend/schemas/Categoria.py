from pydantic import BaseModel
from typing import Optional


class CategoriaBase(BaseModel):
    nombre: str
    descripcion: str

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    baja: bool | None = None

    class Config:
        orm_mode = True 

class CategoriaResponse(CategoriaBase):
    idCategoria: int
    baja: bool

    class Config:
        orm_mode = True

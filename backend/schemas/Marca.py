from pydantic import BaseModel
from typing import Optional, List


class MarcaBase(BaseModel):
    nombre: str
    descripcion: str

class MarcaCreate(MarcaBase):
    pass

class MarcaUpdate(BaseModel):
    nombre: str | None = None
    descripcion: str | None = None
    baja: bool | None = None

    class Config:
        orm_mode = True 

class MarcaResponse(MarcaBase):
    idMarca: int
    baja: bool

    class Config:
        orm_mode = True

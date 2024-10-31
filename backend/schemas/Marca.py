from pydantic import BaseModel
from typing import Optional


class MarcaBase(BaseModel):
    nombre: str
    descripcion: str

class MarcaCreate(MarcaBase):
    pass

class MarcaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    baja: Optional[bool] = None

    class Config:
        orm_mode = True 

class MarcaResponse(MarcaBase):
    idMarca: int
    baja: bool

    class Config:
        orm_mode = True

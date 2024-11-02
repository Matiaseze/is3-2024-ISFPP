from pydantic import BaseModel
from typing import Optional

class LocalidadBase(BaseModel):
    nombre: str

class LocalidadCreate(LocalidadBase):
    pass

class LocalidadUpdate(LocalidadBase):
    baja: bool

class LocalidadResponse(LocalidadBase):
    codPostal: int
    baja: bool

    class Config:
        orm_mode = True
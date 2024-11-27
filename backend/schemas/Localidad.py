from pydantic import BaseModel
from typing import Optional

class LocalidadBase(BaseModel):
    nombre: str
    codPostal: int

class LocalidadCreate(LocalidadBase):
    pass

class LocalidadUpdate(LocalidadBase):
    baja: bool

class LocalidadResponse(LocalidadBase):
    idLocalidad: int
    baja: bool
    
    class Config:
        orm_mode = True
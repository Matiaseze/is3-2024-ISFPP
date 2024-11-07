from pydantic import BaseModel
from typing import Optional

class LocalidadBase(BaseModel):
    nombre: str
    codPostal: int

class LocalidadCreate(LocalidadBase):
    pass

class LocalidadUpdate(LocalidadBase):
    pass

class LocalidadResponse(LocalidadBase):
    idLocalidad: int

    class Config:
        orm_mode = True
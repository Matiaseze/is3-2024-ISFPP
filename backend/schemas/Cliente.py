from pydantic import BaseModel
from typing import Optional
from schemas.Localidad import LocalidadResponse
from models.Cliente import TipoDoc  # Importa el enumerado TipoDoc

class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    domicilio: str
    tipoDoc: TipoDoc
    localidad: LocalidadResponse

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(ClienteBase):
    baja: bool

class ClienteResponse(ClienteBase):
    dni: int
    baja: bool

    class Config:
        orm_mode = True
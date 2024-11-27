from pydantic import BaseModel
from typing import Optional, List
from schemas.Localidad import LocalidadResponse
from models.Cliente import TipoDoc  # Importa el enumerado TipoDoc

class ClienteBase(BaseModel):
    nombre: str
    apellido: str
    documento: int
    tipoDoc: TipoDoc
    domicilio: str
    localidad: LocalidadResponse

class ClienteCreate(ClienteBase):
    pass

class ClienteUpdate(ClienteBase):
    baja: bool

class ClienteResponse(ClienteBase):
    idCliente: int
    baja: bool

    class Config:
        orm_mode = True
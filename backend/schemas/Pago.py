from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.Pago import TipoMedioPago


class PagoBase(BaseModel):
    monto_abonado: float
    medio_de_pago: TipoMedioPago
    fecha: datetime


class PagoCreate(PagoBase):
    idCliente: int
    idPedido: int


class PagoResponse(PagoBase):
    idPago: int
    idCliente: int
    idPedido: int

    class Config:
        orm_mode = True
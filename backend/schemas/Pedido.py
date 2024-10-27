from pydantic import BaseModel
from typing import List, Optional

class PedidoBase(BaseModel):
    nombreCliente: str
    montoTotal: float
    cancelado: bool

class DetallePedidoBase(BaseModel):
    precioUnitario: float
    cantidad: int
    subTotal: float

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoBase]

class PedidoResponse(PedidoBase):
    idPedido: int
    fechaPedido: str
    detalles: List[DetallePedidoBase] = []

    class Config:
        orm_mode = True
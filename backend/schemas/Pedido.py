from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.Producto import ProductoBase

class PedidoBase(BaseModel):
    nombreCliente: str
    montoTotal: float
    cancelado: bool

class DetallePedidoBase(BaseModel):
    producto: ProductoBase
    precioUnitario: float
    cantidad: int
    subTotal: float

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoBase]

class PedidoResponse(PedidoBase):
    idPedido: int
    fechaPedido: datetime
    detalles: List[DetallePedidoBase] = []

    class Config:
        orm_mode = True
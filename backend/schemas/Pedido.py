from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.Producto import ProductoResponse

class PedidoBase(BaseModel):
    nombreCliente: str
    montoTotal: float
    cancelado: bool

class DetallePedidoBase(BaseModel):
    producto: ProductoResponse
    precioUnitario: float
    cantidad: int
    subTotal: float

class DetallePedidoCreate(DetallePedidoBase):
    pass

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoCreate]

class PedidoResponse(PedidoBase): 
    fechaPedido: datetime
    detalles: List[DetallePedidoBase] = []

    class Config:
        orm_mode = True
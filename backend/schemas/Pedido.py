from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.Producto import ProductoResponse
from models.Pedido import EstadoPedido
class PedidoBase(BaseModel):
    montoTotal: float
    estado: EstadoPedido

class DetallePedidoBase(BaseModel):
    idProducto: int
    precioUnitario: float
    cantidad: int
    subTotal: float

class DetallePedidoCreate(DetallePedidoBase):
    pass

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoCreate]
    idCliente: int

class PedidoResponse(PedidoBase):
    idPedido: int 
    fechaPedido: datetime
    idCliente: int
    detalles: List[DetallePedidoBase] = []

    class Config:
        orm_mode = True

class DetallePedidoResponse(DetallePedidoBase):
    id: int

    class Config:
        orm_mode = True
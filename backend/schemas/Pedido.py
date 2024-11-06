from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from schemas.Producto import ProductoResponse
from schemas.Cliente import ClienteResponse
from models.Pedido import EstadoPedido
class PedidoBase(BaseModel):
    montoTotal: float
    estado: EstadoPedido

class DetallePedidoBase(BaseModel):
    producto: ProductoResponse
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
    cliente: ClienteResponse
    detalles: List[DetallePedidoBase] = []

    class Config:
        orm_mode = True

class DetallePedidoResponse(DetallePedidoBase):
    id: int

    class Config:
        orm_mode = True
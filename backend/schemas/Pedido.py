from pydantic import BaseModel
from typing import List
from datetime import datetime
from schemas.Producto import ProductoResponse
from models.Pedido import EstadoPedido
from schemas.Cliente import ClienteResponse


class PedidoBase(BaseModel):
    montoTotal: float
    estado: EstadoPedido

class DetallePedidoBase(BaseModel):
    precioUnitario: float
    cantidad: int
    subTotal: float

class DetallePedidoCreate(DetallePedidoBase):
    pass

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoCreate]
    idCliente: int

class DetallePedidoResponse(DetallePedidoBase):
    id: int
    producto: ProductoResponse
    class Config:
        orm_mode = True
class PedidoResponse(PedidoBase):
    idPedido: int
    fechaPedido: datetime
    cliente: ClienteResponse  
    detalles: List[DetallePedidoResponse] 

    class Config:
        orm_mode = True
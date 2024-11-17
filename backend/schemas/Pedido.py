from pydantic import BaseModel
from typing import List
from datetime import datetime
from schemas.Producto import ProductoResponse
from models.Pedido import EstadoPedido
from schemas.Cliente import ClienteResponse

class PedidoBase(BaseModel):
    montoTotal: float
    estado: EstadoPedido
    cliente: ClienteResponse

class DetallePedidoBase(BaseModel):
    producto: ProductoResponse
    precioUnitario: float
    cantidad: int
    subTotal: float

class DetallePedidoCreate(DetallePedidoBase):
    pass

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoCreate]
    

class DetallePedidoResponse(DetallePedidoBase):
    id: int

    class Config:
        orm_mode = True

class PedidoResponse(PedidoBase):
    idPedido: int
    fechaPedido: datetime
    detalles: List[DetallePedidoResponse] 

    class Config:
        orm_mode = True
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.Pago import TipoMedioPago
from schemas.Pedido import PedidoResponse
from schemas.Cliente import ClienteResponse

class PagoBase(BaseModel):
    monto_abonado: float
    medio_de_pago: TipoMedioPago
    fecha: datetime

class PagoCreate(PagoBase):
    idCliente: int
    idPedido: int

class PagoResponse(PagoBase):
    idPago: int
    cliente: ClienteResponse  # Incluye el objeto completo ClienteResponse en lugar de idCliente
    pedido: PedidoResponse | None = None  # Incluye el objeto completo PedidoResponse en lugar de idPedido; puede ser None si el pedido no está pagado

    class Config:
        orm_mode = True
from pydantic import BaseModel
from datetime import datetime
from models.Pago import TipoMedioPago
from datetime import datetime

class PagoBase(BaseModel):
    monto_abonado: float
    medio_de_pago: TipoMedioPago
    fecha: datetime
    idPedido: int
    idCliente: int
    
class PagoCreate(PagoBase):
    pass

class PagoResponse(PagoBase):
    idPago: int

    class Config:
        orm_mode = True
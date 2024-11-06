from sqlalchemy import Column, Integer, Float, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from enum import Enum
from datetime import datetime

class TipoMedioPago(Enum):
    EFECTIVO = "EFECTIVO"
    DEBITO = "DEBITO"
    CREDITO = "CREDITO"
    TRANSFERENCIA = "TRANSFERENCIA"
    CHEQUE = "CHEQUE"

class Cliente(Base):
    __tablename__ = "pagos"
    idPago = Column(Integer, primary_key=True, index=True)
    monto_abonado = Column(Float, nulleable=False)
    medio_de_pago = Column(Enum(TipoMedioPago), nullable=False)
    fecha = Column(DateTime, default=datetime.now())

    # Relación con Cliente
    idCliente = Column(Integer, ForeignKey("clientes.idCliente"))
    cliente = relationship("Cliente", back_populates="pagos")

    # Relación con Pedido
    idPedido = Column(Integer, ForeignKey("pedidos.idPedido"))
    pedido = relationship("Pedido", back_populates="pagos")
from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Pedido(Base):
    __tablename__= "pedidos"

    idPedido = Column(Integer, primary_key=True, index=True)
    fechaPedido = Column(DateTime, default=datetime.now())
    nombreCliente = Column(String, index=True) # cambiar por idCliente
    montoTotal = Column(Float, nullable=False)
    cancelado = Column(Boolean, default=False)

    detalles = relationship("DetallePedido", back_populates="pedido")
    

class DetallePedido(Base):
    __tablename__ = 'detalle_pedido'

    id = Column(Integer, primary_key=True, index=True)
    idPedido = Column(Integer, ForeignKey('pedidos.idPedido'))
    precioUnitario = Column(Float)
    cantidad = Column(Integer)
    subTotal = Column(Float)

    pedido = relationship("Pedido", back_populates="detalles")
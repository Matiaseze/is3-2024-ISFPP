from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum

class EstadoPedido(enum.Enum):
    INICIADO = "INICIADO"
    PAGADO = "PAGADO"
    CANCELADO = "CANCELADO"

class Pedido(Base):
    __tablename__= "pedidos"

    idPedido = Column(Integer, primary_key=True, index=True)
    fechaPedido = Column(DateTime, default=datetime.now())
    montoTotal = Column(Float, nullable=False)
    estado = Column(Enum(EstadoPedido), default=EstadoPedido.INICIADO)

    idCliente = Column(Integer, ForeignKey("clientes.idCliente"))
    cliente = relationship("Cliente", back_populates="pedidos")

    pagos = relationship("Pago", back_populates="pedido")
    
    detalles = relationship("DetallePedido", back_populates="pedido")
    


class DetallePedido(Base):
    __tablename__ = 'detalle_pedido'

    id = Column(Integer, primary_key=True, index=True)
    idPedido = Column(Integer, ForeignKey('pedidos.idPedido'))
    idProducto = Column(Integer, ForeignKey('productos.idProducto'))
    precioUnitario = Column(Float)
    cantidad = Column(Integer)
    subTotal = Column(Float)
    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles_pedido")

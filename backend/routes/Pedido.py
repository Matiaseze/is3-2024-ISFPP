from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Pedido import Pedido, DetallePedido
from models.Pedido import Producto
from schemas.Pedido import PedidoCreate, PedidoResponse
from database import get_db
from typing import List

router = APIRouter()

@router.post("/pedidos", response_model=PedidoResponse)
def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    
    for detalle in pedido.detalles:
        producto = db.query(Producto)(detalle.producto_id)  # Implementa esta función según tu lógica
        if not producto:
            raise HTTPException(status_code=400, detail="Uno o más productos no existen.")
        if detalle.cantidad > producto.stock:
            raise HTTPException(status_code=400, detail="Stock insuficiente para uno o más productos.")

    # Crear el pedido
    nuevo_pedido = Pedido(nombreCliente=pedido.nombreCliente)
    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)

    # Crear los detalles del pedido
    for detalle in pedido.detalles:
        nuevo_detalle = DetallePedido(
            idPedido=nuevo_pedido.idPedido,
            precioUnitario=detalle.precioUnitario,
            cantidad=detalle.cantidad,
            subTotal=detalle.precioUnitario * detalle.cantidad
        )
        db.add(nuevo_detalle)

    db.commit()
    db.refresh(nuevo_pedido)

    return nuevo_pedido
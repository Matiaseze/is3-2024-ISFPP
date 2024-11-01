from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Pedido import Pedido, DetallePedido
from models.Producto import Producto
from schemas.Pedido import PedidoCreate,PedidoResponse, PedidoBase
from database import get_db


router = APIRouter()

@router.post("/crear_pedido", response_model=PedidoResponse, status_code=201)
def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    print(pedido)
    
    for detalle in pedido.detalles:
        producto = db.query(Producto).filter(Producto.idProducto == detalle.producto.idProducto).first()
        if not producto:
            raise HTTPException(status_code=400, detail="Uno o más productos no existen.")
        if detalle.cantidad > producto.stock:
            raise HTTPException(status_code=400, detail="Stock insuficiente para uno o más productos.")

    # Creando el pedido
    nuevo_pedido = Pedido(
        nombreCliente=pedido.nombreCliente,
        montoTotal=pedido.montoTotal,
        cancelado=pedido.cancelado
    )

    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)

    # Creando el detalle de pedido
    for detalle in pedido.detalles:
        nuevo_detalle = DetallePedido(
            idPedido=nuevo_pedido.idPedido,
            idProducto=detalle.producto.idProducto,
            precioUnitario=detalle.precioUnitario,
            cantidad=detalle.cantidad,
            subTotal=detalle.subTotal
        )
        db.add(nuevo_detalle)

    db.commit()
    return nuevo_pedido
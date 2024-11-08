from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Pedido import Pedido, DetallePedido
from models.Producto import Producto
from schemas.Pedido import PedidoCreate, PedidoResponse, DetallePedidoResponse
from database import get_db
from typing import List

router = APIRouter()
   


@router.post("/crear_pedido", response_model=PedidoResponse, status_code=201)
def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    print(pedido)
    
    for detalle in pedido.detalles:
        producto = db.query(Producto).filter(Producto.idProducto == detalle.idProducto).first()
        if not producto:
            raise HTTPException(status_code=400, detail="Uno o más productos no existen.")
        if detalle.cantidad > producto.stock:
            raise HTTPException(status_code=400, detail="Stock insuficiente para uno o más productos.")
        producto = db.query(Producto).filter(Producto.idProducto == detalle.idProducto).first()
        producto.stock -= detalle.cantidad
        db.add(producto)

    # Creando el pedido
    nuevo_pedido = Pedido(
        idCliente=pedido.idCliente,
        montoTotal=pedido.montoTotal,
        estado=pedido.estado
    )

    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)

    # Creando el detalle de pedido
    for detalle in pedido.detalles:
        nuevo_detalle = DetallePedido(
            idPedido=nuevo_pedido.idPedido,
            producto=producto,
            precioUnitario=detalle.precioUnitario,
            cantidad=detalle.cantidad,
            subTotal=detalle.subTotal
        )
        db.add(nuevo_detalle)

    db.commit()
    return nuevo_pedido

@router.get("/", response_model=List[PedidoResponse])
def listar_pedidos(db: Session = Depends(get_db)):
    pedidos = db.query(Pedido).all() 
    return pedidos

# Le falta un control mas para cuando el pedido esta asociado a uno o mas pagos
@router.delete("/{idPedido}/cancelar", response_model=PedidoResponse, status_code=200)
def cancelar_pedido(idPedido: int, db: Session = Depends(get_db)):
    db_pedido = db.query(Pedido).filter(Pedido.idPedido == idPedido).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="El pedido no existe.")
    db_pedido.cancelado = True
    db.commit()
    return db_pedido

@router.get("/{idPedido}/detalles", response_model=List[DetallePedidoResponse])
def listar_detalles_de_pedido(idPedido: int, db: Session = Depends(get_db)):
    detalles_pedido = db.query(DetallePedido).filter(DetallePedido.idPedido == idPedido).all() 
    return detalles_pedido
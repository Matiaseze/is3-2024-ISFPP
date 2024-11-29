from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Pedido import Pedido, DetallePedido, EstadoPedido
from models.Producto import Producto
from models.Pago import Pago
from schemas.Pedido import PedidoCreate, PedidoResponse, DetallePedidoResponse
from schemas.Pago import PagoResponse
from database import get_db
from typing import List

router = APIRouter()

@router.get("/estados_pedido", status_code=200)
def get_estados_pedido():
    return [estado.value for estado in EstadoPedido]


@router.get("/{idPedido}", response_model=PedidoResponse)
def get_pedido(idPedido: int, db: Session = Depends(get_db)):
    pedido_db = db.query(Pedido).filter(Pedido.idPedido == idPedido).first() 
    return pedido_db

@router.post("/crear_pedido", response_model=PedidoResponse, status_code=201)
def crear_pedido(pedido: PedidoCreate, db: Session = Depends(get_db)):
    
    for detalle in pedido.detalles:
        producto_en_detalle = db.query(Producto).filter(Producto.idProducto == detalle.producto.idProducto).first()
        if not producto_en_detalle:
            raise HTTPException(status_code=400, detail="Uno o más productos no existen.")
        if detalle.cantidad > producto_en_detalle.stock:
            raise HTTPException(status_code=400, detail="Stock insuficiente para uno o más productos.")
        
        
        producto_en_detalle.stock -= detalle.cantidad
        db.add(producto_en_detalle)

    # Creando el pedido
    nuevo_pedido = Pedido(
        idCliente=pedido.cliente.idCliente,
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
            producto=producto_en_detalle,
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

@router.delete("/{idPedido}/cancelar", response_model=PedidoResponse, status_code=200)
def cancelar_pedido(idPedido: int, db: Session = Depends(get_db)):
    db_pedido = db.query(Pedido).filter(Pedido.idPedido == idPedido).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="El pedido no existe.")
    
    # Se Verifica si el pedido tiene pagos asociados, con que exista uno ya no se le permite cancelar
    pagos_asociados = db.query(Pago).filter(Pago.idPedido == idPedido).first()
    if pagos_asociados:
        raise HTTPException(status_code=400, detail="No se puede cancelar el pedido porque tiene pagos asociados.")
    
    # Si no tiene pagos, entonces se cambia el estado del pedido a 'CANCELADO'
    db_pedido.estado = 'CANCELADO'
    db.commit()
    
    return db_pedido

@router.put("/{idPedido}/iniciar", response_model=PedidoResponse, status_code=200)
def iniciar_pedido(idPedido: int, db: Session = Depends(get_db)):
    db_pedido = db.query(Pedido).filter(Pedido.idPedido == idPedido).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="El pedido no existe.")
    db_pedido.estado = 'INICIADO'
    db.commit()
    return db_pedido

@router.get("/{idPedido}/detalles", response_model=List[DetallePedidoResponse])
def listar_detalles_de_pedido(idPedido: int, db: Session = Depends(get_db)):
    detalles_pedido = db.query(DetallePedido).filter(DetallePedido.idPedido == idPedido).all() 
    return detalles_pedido

@router.get("/{idPedido}/pagos", response_model=List[PagoResponse])
def listar_pagos_de_pedido(idPedido: int, db: Session = Depends(get_db)):
    detalles_pedido = db.query(Pago).filter(Pago.idPedido == idPedido).all() 
    return detalles_pedido
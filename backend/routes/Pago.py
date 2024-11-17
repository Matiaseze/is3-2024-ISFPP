from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Pago import Pago
from models.Cliente import Cliente
from models.Pedido import Pedido
from schemas.Pago import PagoCreate, PagoResponse
from database import get_db
from typing import List

router = APIRouter()

def calcular_saldo_pendiente(pedido_id, db):
    pagos = []
    pagos = db.query(Pago).filter(Pago.idPago == pedido_id).all()

    for pago in pagos:
        monto_restante = pedido.montoTotal - pago.monto_abonado 

    return monto_restante


@router.get("/{idPago}", response_model=PagoResponse, status_code=200)
def get_pago(idPago: PedidoResponse, db: Session = Depends(get_db)):
    pago_db = db.query(Pago).filter(Pago.idPago == idPago).first()

    saldo_pendiente = calcular_saldo_pendiente(pago_db.idPedido, db)
    return pago_db, saldo_pendiente

@router.post("/crear_pago", response_model=PedidoResponse, status_code=201)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    
    pedido_a_pagar = db.query(Pedido).filter(Pedido.idPedido == pago.idPedido).first()
    if not pedido_a_pagar:
        raise HTTPException(status_code=404, detail="No se entro el pedido.")
    
    cliente_en_pago = db.query(Cliente).filter(Cliente.idCliente == pago.idCliente).first()
    if not cliente_en_pago:
        raise HTTPException(status_code=404, detail="No se encontro el cliente.")
    
    saldo_pendiente = calcular_saldo_pendiente(pedido_a_pagar.idPedido, db)

    if pedido.monto_abonado > monto_restante:
        raise HTTPException(status_code=400, detail="El monto es mayor al saldo pendiente")

    # Creando el pago
    nuevo_pago = Pago(
        monto_abonado = pago.monto_abonado,
        medio_de_pago = pago.medio_de_pago,
        fecha = pago.fecha,
        idCliente = pago.idCliente,
        idPedido = pago.idCliente
    )

    db.add(nuevo_pago)
    db.commit()
    db.refresh(nuevo_pago)

    return nuevo_pago

@router.get("/", response_model=List[PagoResponse])
def listar_pagos(db: Session = Depends(get_db)):
    pagos = db.query(Pago).all() 
    cliente = db.query(Cliente).filter(Cliente.idCliente == pagos.idCliente).first()
    return pagos

@router.delete("/{idPago}/eliminar", response_model=PagoResponse, status_code=200)
def cancelar_pago(idPago: int, db: Session = Depends(get_db)):

    db_pago = db.query(Pago).filter(Pago.idPago == idPago).first()
    if not db_pago:
        raise HTTPException(status_code=404, detail="El pago no existe.")
    
    # Se verifica que el estado del pedido asociado
    db_pedido = db.query(Pedido).filter(Pedido.idPedido == db_pago.idPedido).first()
    if not db_pedido:
        raise HTTPException(status_code=404, detail="El pedido asociado no existe.")
    
    if db_pedido.estado == "PAGADO":
        raise HTTPException(status_code=400, detail="No se puede eliminar el pago porque el pedido está en estado 'PAGADO'.")

    # Se elimina el pago mientras el estado del pedido NO sea PAGADO
    db.delete(db_pago)
    db.commit()
    return db_pago

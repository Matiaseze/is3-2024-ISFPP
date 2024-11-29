from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Pago import Pago, TipoMedioPago
from models.Cliente import Cliente
from models.Pedido import Pedido
from schemas.Pago import PagoCreate, PagoResponse
from database import get_db
from typing import List

router = APIRouter()

def calcular_saldo_pendiente(pedido_id, db):

    pedido = db.query(Pedido).filter(Pedido.idPedido == pedido_id).first()
    if not pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado.")

    # Sumar los montos abonados de todos los pagos relacionados con el pedido
    pagos = db.query(Pago).filter(Pago.idPedido == pedido_id).all()
    total_abonado = sum(pago.monto_abonado for pago in pagos)

    # Calcular el saldo pendiente
    monto_restante = pedido.montoTotal - total_abonado
    return monto_restante


@router.get("/medios_pago", status_code=200)
def get_medios_pago():
    return [medio.value for medio in TipoMedioPago]
    

@router.get("/{idPago}", response_model=PagoResponse, status_code=200)
def get_pago(idPago: int, db: Session = Depends(get_db)):
    pago_db = db.query(Pago).filter(Pago.idPago == idPago).first()

    saldo_pendiente = calcular_saldo_pendiente(pago_db.idPedido, db)
    return {"pago": pago_db, "saldo_pendiente": saldo_pendiente}

@router.post("/crear_pago", response_model=PagoCreate, status_code=201)
def crear_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    print("ESTOY CREANDO UN PAGOOOOOOO")
    pedido_a_pagar = db.query(Pedido).filter(Pedido.idPedido == pago.idPedido).first()
    if not pedido_a_pagar:
        raise HTTPException(status_code=404, detail="No se encontró el pedido.")

    cliente_en_pago = db.query(Cliente).filter(Cliente.idCliente == pago.idCliente).first()
    if not cliente_en_pago:
        raise HTTPException(status_code=404, detail="No se encontró el cliente.")

    saldo_pendiente = calcular_saldo_pendiente(pedido_a_pagar.idPedido, db)
    print(saldo_pendiente)
    # Validar que el monto abonado no exceda el saldo pendiente
    print(pago.monto_abonado)
    if pago.monto_abonado > saldo_pendiente:
        raise HTTPException(status_code=400, detail="El monto abonado excede el saldo pendiente.")

    # Crear el nuevo pago
    nuevo_pago = Pago(
        monto_abonado=pago.monto_abonado,
        medio_de_pago=pago.medio_de_pago,
        fecha=pago.fecha,
        idCliente=pago.idCliente,
        idPedido=pago.idPedido,
    )

    db.add(nuevo_pago)

    # Actualizar estado del pedido si el saldo se liquida
    nuevo_saldo_pendiente = saldo_pendiente - pago.monto_abonado
    if nuevo_saldo_pendiente == 0:
        pedido_a_pagar.estado = "PAGADO"
    
    db.commit()
    db.refresh(nuevo_pago)

    return nuevo_pago

@router.get("/", response_model=List[dict])
def listar_pagos(db: Session = Depends(get_db)):
    query = (
        db.query(
            Pago.idPago,
            Pago.monto_abonado,
            Pago.medio_de_pago,
            Pago.fecha,
            Pago.idPedido,
            Pago.idCliente,
            Cliente.nombre.label("nombre_cliente"),
            Cliente.apellido.label("apellido_cliente"),
            Pedido.montoTotal.label("monto_total_pedido"),
        )
        .join(Cliente, Cliente.idCliente == Pago.idCliente)
        .join(Pedido, Pedido.idPedido == Pago.idPedido)
    )
    pagos = query.all()
    # Mapeo de pagos a los datos requeridos
    pagos_con_detalles = [
        {
            "idPago": pago.idPago,
            "monto_abonado": pago.monto_abonado,
            "medio_de_pago": pago.medio_de_pago,
            "fecha": pago.fecha,
            "idPedido": pago.idPedido,
            "idCliente": pago.idCliente,
            "cliente": {
                "nombre": pago.nombre_cliente,
                "apellido": pago.apellido_cliente,
            },
            "monto_total": pago.monto_total_pedido,
        }
        for pago in pagos
    ]
    return pagos_con_detalles

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

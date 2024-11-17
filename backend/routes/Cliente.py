from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Cliente import Cliente
from models.Localidad import Localidad
from schemas.Cliente import ClienteCreate, ClienteUpdate, ClienteResponse
from database import get_db
from typing import List

router = APIRouter()

@router.get("/{idCliente}", response_model=ClienteResponse)
def get_cliente(idCliente: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.idCliente == idCliente).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="EL cliente no existe.")
    return cliente

@router.get("/", response_model=List[ClienteResponse])
def listar_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clientes = db.query(Cliente).all() 
    return clientes

@router.post("/registrar", response_model=ClienteResponse, status_code=201)
def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.dni == cliente.dni).first()
    if db_cliente:
        raise HTTPException(status_code=400, detail="El cliente ya existe.")
    
    localidad_objeto = db.query(Localidad).filter(Localidad.idLocalidad == cliente.localidad.idLocalidad).first()
    if not localidad_objeto:
        raise HTTPException(status_code=400, detail="Localidad no encontrada.")
        # Crear localidad si no existe
        # localidad_objeto = Localidad(
        #     nombre=cliente.localidad.nombre,
        #     codPostal=cliente.localidad.codPostal
        # )
        # db.add(localidad_objeto)
        # db.commit()
        # db.refresh(localidad_objeto)

    nuevo_cliente = Cliente(
        nombre=cliente.nombre,
        apellido=cliente.apellido,
        dni=cliente.dni,
        tipoDoc=cliente.tipoDoc,
        domicilio=cliente.domicilio,
        localidad=localidad_objeto
    )
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

@router.put("/{idCliente}", response_model=ClienteResponse)
def modificar_cliente(idCliente: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.idCliente == idCliente).first()
    if not db_cliente:
        raise HTTPException(status_code=404, detail="El cliente no existe.")
    
    localidad = db.query(Localidad).filter(Localidad.idLocalidad == cliente.localidad.idLocalidad).first()
    if not localidad:
        raise HTTPException(status_code=400, detail="Localidad no encontrada.")
    
    db_cliente.dni=cliente.dni
    db_cliente.tipoDoc=cliente.tipoDoc
    db_cliente.nombre=cliente.nombre
    db_cliente.apellido=cliente.apellido  
    db_cliente.domicilio=cliente.domicilio
    db_cliente.localidad=localidad       

    db.commit()
    db.refresh(db_cliente)
    return db_cliente

@router.delete("/{idCliente}")
def baja_cliente(idCliente: int, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.idCliente == idCliente).first()
    if not db_cliente:
        raise HTTPException(status_code=404, detail="El cliente no existe.")
    db_cliente.baja = True
    db.commit()
    return {"detail": "Cliente dado de baja exitosamente"}
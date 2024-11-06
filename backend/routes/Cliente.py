from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Cliente import Cliente
from schemas.Cliente import ClienteCreate, ClienteUpdate, ClienteResponse
from database import get_db
from typing import List

router = APIRouter()

@router.get("/{dni}", response_model=ClienteResponse)
def get_cliente(codPostal: int, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.dni == dni).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="EL cliente no existe.")
    return cliente

@router.get("/", response_model=List[ClienteResponse])
def listar_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clientes = db.query(Cliente).all() 
    return clientes

@router.post("/registrar", response_model=ClienteResponse)
def crear_cliente(localidad: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.nombre == cliente.nombre).first()
    if db_cliente:
        raise HTTPException(status_code=400, detail="El cliente ya existe.")
    nuevo_cliente = Cliente(**cliente.dict())
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

@router.put("/{dni}", response_model=ClienteResponse)
def modificar_cliente(dni: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    db_cliente = db.query(Localidad).filter(Localidad.codPostal == codPostal).first()
    if not db_cliente:
        raise HTTPException(status_code=404, detail="El cliente no existe.")
    for key, value in cliente.dict().items():
        setattr(db_cliente, key, value)
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

@router.delete("/{dni}")
def baja_cliente(dni: int, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.dni == dni).first()
    if not db_cliente:
        raise HTTPException(status_code=404, detail="El cliente no existe.")
    db_cliente.baja = True
    db.commit()
    return {"detail": "Cliente dado de baja exitosamente"}

@router.get("/", response_model=List[ClienteResponse])
def listar_clientes(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    clientes = db.query(Cliente).offset(skip).limit(limit).all()
    return clientes
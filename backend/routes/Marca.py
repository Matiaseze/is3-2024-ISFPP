from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Marca import Marca
from schemas.Marca import MarcaCreate, MarcaUpdate, MarcaResponse
from database import get_db
from typing import List

router = APIRouter()


def obtener_marca(idMarca: int, db: Session):
    marca = db.query(Marca).filter(Marca.idMarca == idMarca, Marca.baja == False).first()
    if not marca:
        raise HTTPException(status_code=404, detail="La marca no existe o ha sido dada de baja.")
    return marca

def marca_existente(nombre: str, db: Session):
    return db.query(Marca).filter(Marca.nombre == nombre, Marca.baja == False).first()



@router.get("/{idMarca}", response_model=MarcaResponse)
def get_marca(idMarca: int, db: Session = Depends(get_db)):
    return obtener_marca(idMarca, db)

@router.get("/", response_model=List[MarcaResponse])
def listar_marcas(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    marcas = db.query(Marca).filter(Marca.baja == False).offset(skip).limit(limit).all()
    return marcas

@router.post("/registrar", response_model=MarcaResponse)
def crear_marca(marca: MarcaCreate, db: Session = Depends(get_db)):
    if marca_existente(marca.nombre, db):
        raise HTTPException(status_code=400, detail="La marca ya existe.")
    
    nueva_marca = Marca(**marca.dict())
    db.add(nueva_marca)
    db.commit()
    db.refresh(nueva_marca)
    return nueva_marca

@router.patch("/{idMarca}", response_model=MarcaResponse)
def modificar_marca(idMarca: int, marca: MarcaUpdate, db: Session = Depends(get_db)):
    db_marca = obtener_marca(idMarca, db)
    
    for key, value in marca.dict(exclude_unset=True).items():
        setattr(db_marca, key, value)

    db.commit()
    db.refresh(db_marca)
    return db_marca

@router.delete("/{idMarca}")
def baja_marca(idMarca: int, db: Session = Depends(get_db)):
    db_marca = obtener_marca(idMarca, db)
    db_marca.baja = True
    db.commit()
    return {"detail": "Marca dada de baja exitosamente"}

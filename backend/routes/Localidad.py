from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Localidad import Localidad
from schemas.Localidad import LocalidadCreate, LocalidadUpdate, LocalidadResponse
from database import get_db
from typing import List

router = APIRouter()

@router.get("/{idLocalidad}", response_model=LocalidadResponse)
def get_localidad(idLocalidad: int, db: Session = Depends(get_db)):
    localidad = db.query(Localidad).filter(Localidad.idLocalidad == idLocalidad).first()
    if not localidad:
        raise HTTPException(status_code=404, detail="La localidad no existe.")
    return localidad

@router.get("/", response_model=List[LocalidadResponse])
def listar_localidades(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    localidades = db.query(Localidad).all() 
    return localidades

@router.post("/registrar", response_model=LocalidadResponse)
def crear_localidad(localidad: LocalidadCreate, db: Session = Depends(get_db)):
    db_localidad = db.query(Localidad).filter(Localidad.nombre == localidad.nombre).first()
    if db_localidad:
        raise HTTPException(status_code=400, detail="La localidad ya existe.")
    nueva_localidad = Localidad(**localidad.dict())
    db.add(nueva_localidad)
    db.commit()
    db.refresh(nueva_localidad)
    return nueva_localidad

@router.patch("/{idLocalidad}", response_model=LocalidadResponse)
def modificar_localidad(idLocalidad: int, localidad: LocalidadUpdate, db: Session = Depends(get_db)):
    db_localidad = db.query(Localidad).filter(Localidad.idLocalidad == idLocalidad).first()
    if not db_localidad:
        raise HTTPException(status_code=404, detail="La localidad no existe.")
    for key, value in localidad.dict().items():
        setattr(db_localidad, key, value)
    db.commit()
    db.refresh(db_localidad)
    return db_localidad

@router.delete("/{idLocalidad}")
def baja_localidad(idLocalidad: int, db: Session = Depends(get_db)):
    db_localidad = db.query(Localidad).filter(Localidad.idLocalidad == idLocalidad).first()
    if not db_localidad:
        raise HTTPException(status_code=404, detail="La localidad no existe.")
    db_localidad.baja = True
    db.commit()
    return {"detail": "Localidad dada de baja exitosamente"}
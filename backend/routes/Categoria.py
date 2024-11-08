from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Categoria import Categoria
from schemas.Categoria import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from database import get_db
from typing import List

router = APIRouter()

# Modificamos esta función para devolver la instancia de la categoría
def obtener_categoria(idCategoria: int, db: Session):
    categoria = db.query(Categoria).filter(Categoria.idCategoria == idCategoria, Categoria.baja == False).first()
    if not categoria:
        raise HTTPException(status_code=404, detail="La Categoria no existe o ha sido dada de baja.")
    return categoria  # Devuelve la instancia de categoría

def categoria_existente(nombre: str, db: Session):
    return db.query(Categoria).filter(Categoria.nombre == nombre, Categoria.baja == False).first()

@router.get("/{idCategoria}", response_model=CategoriaResponse)
def get_categoria(idCategoria: int, db: Session = Depends(get_db)):
    return obtener_categoria(idCategoria, db)

@router.get("/", response_model=List[CategoriaResponse])
def listar_categorias(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    categorias = db.query(Categoria).filter(Categoria.baja == False).offset(skip).limit(limit).all()
    return categorias

@router.post("/registrar", response_model=CategoriaResponse)
def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    if categoria_existente(categoria.nombre, db):
        raise HTTPException(status_code=400, detail="La categoria ya existe.")
    
    nueva_categoria = Categoria(**categoria.dict())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

@router.patch("/{idCategoria}", response_model=CategoriaResponse)
def modificar_categoria(idCategoria: int, categoria: CategoriaUpdate, db: Session = Depends(get_db)):
    db_categoria = obtener_categoria(idCategoria, db)
    
    # Aplica actualizaciones solo a los campos presentes en la solicitud
    for key, value in categoria.dict(exclude_unset=True).items():
        setattr(db_categoria, key, value)

    db.commit()
    db.refresh(db_categoria)
    return db_categoria

@router.delete("/{idCategoria}")
def baja_categoria(idCategoria: int, db: Session = Depends(get_db)):
    db_categoria = obtener_categoria(idCategoria, db)
    db_categoria.baja = True
    db.commit()
    return {"detail": "Categoria dada de baja exitosamente"}

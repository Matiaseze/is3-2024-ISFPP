from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Producto import Producto
from schemas.Producto import ProductoCreate, ProductoUpdate, ProductoResponse
from database import get_db
from typing import List

router = APIRouter()

@router.get("/{idProducto}", response_model=ProductoResponse)
def get_producto(idProducto: int, db: Session = Depends(get_db)):
    producto = db.query(Producto).filter(Producto.idProducto == idProducto).first()
    if not producto:
        raise HTTPException(status_code=404, detail="El producto no existe.")
    return producto

@router.get("/", response_model=List[ProductoResponse])
def listar_productos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    # productos = db.query(Producto).offset(skip).limit(limit).all() # Esto solo devuelve 10 elementos, tambien puede servir por si hay que implementar varias paginas
    productos = db.query(Producto).all() 
    return productos

@router.post("/registrar", response_model=ProductoResponse)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.descripcion == producto.descripcion).first()
    if db_producto:
        raise HTTPException(status_code=400, detail="El producto ya existe.")
    if not producto.marca:
        raise HTTPException(status_code=400, detail="La marca no fue seleccionada.")
    if not producto.categoria:
        raise HTTPException(status_code=400, detail="La categoria no fue seleccionada.")
    print("Producto recibido:", producto)
    nuevo_producto = Producto(**producto.dict())
    db.add(nuevo_producto)
    db.commit()
    db.refresh(nuevo_producto)
    return nuevo_producto

@router.put("/{idProducto}", response_model=ProductoResponse)
def modificar_producto(idProducto: int, producto: ProductoUpdate, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.idProducto == idProducto).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="El producto no existe.")
    if not producto.marca:
        raise HTTPException(status_code=400, detail="La marca no fue seleccionada.")
    if not producto.categoria:
        raise HTTPException(status_code=400, detail="La categoria no fue seleccionada.")
    for key, value in producto.dict().items():
        setattr(db_producto, key, value)
    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.delete("/{idProducto}")
def baja_producto(idProducto: int, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.idProducto == idProducto).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="El producto no existe.")
    db_producto.baja = True
    db.commit()
    return {"detail": "Producto dado de baja exitosamente"}

@router.get("/", response_model=List[ProductoResponse])
def listar_productos(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    productos = db.query(Producto).offset(skip).limit(limit).all()
    return productos
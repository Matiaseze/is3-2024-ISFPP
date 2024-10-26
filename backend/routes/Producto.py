from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Producto import Producto
from schemas.Producto import ProductoCreate, ProductoUpdate, ProductoResponse
from database import get_db

router = APIRouter()

@router.post("/", response_model=ProductoResponse)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.descripcion == producto.descripcion).first()
    if db_producto:
        raise HTTPException(status_code=400, detail="El producto ya existe.")
    if not producto.marca:
        raise HTTPException(status_code=400, detail="La marca no fue seleccionada.")
    if not producto.categoria:
        raise HTTPException(status_code=400, detail="La categoria no fue seleccionada.")
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
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Producto import Producto
from models.Marca import Marca
from models.Categoria import Categoria
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
    productos = db.query(Producto).all() 
    return productos

@router.post("/registrar", response_model=ProductoResponse, status_code=201)
def crear_producto(producto: ProductoCreate, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.nombre == producto.nombre).first()
    if db_producto:
        raise HTTPException(status_code=400, detail="El producto ya existe.")
    
    if not producto.marca:
        raise HTTPException(status_code=400, detail="La marca no fue seleccionada.")
    if not producto.categoria:
        raise HTTPException(status_code=400, detail="La categoria no fue seleccionada.")
    
    marca = db.query(Marca).filter(Marca.idMarca == producto.marca.idMarca).first()
    if not marca:
        raise HTTPException(status_code=400, detail="Marca no encontrada.")
    
    categoria = db.query(Categoria).filter(Categoria.idCategoria == producto.categoria.idCategoria).first()
    if not categoria:
        raise HTTPException(status_code=400, detail="Marca no encontrada.")
        
    print(producto)
    
    nuevo_producto = Producto(
        nombre=producto.nombre,
        descripcion=producto.descripcion,
        precio=producto.precio,
        stock=producto.stock,
        categoria=categoria,  
        marca=marca           
    )

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

    marca = db.query(Marca).filter(Marca.idMarca == producto.marca.idMarca).first()
    if not marca:
        raise HTTPException(status_code=400, detail="Marca no encontrada.")
    
    categoria = db.query(Categoria).filter(Categoria.idCategoria == producto.categoria.idCategoria).first()
    if not categoria:
        raise HTTPException(status_code=400, detail="Marca no encontrada.")

    
    db_producto.nombre=producto.nombre
    db_producto.descripcion=producto.descripcion
    db_producto.precio=producto.precio
    db_producto.stock=producto.stock
    db_producto.categoria=categoria
    db_producto.marca=marca

    db.commit()
    db.refresh(db_producto)
    return db_producto

@router.delete("/{idProducto}/baja")
def baja_producto(idProducto: int, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.idProducto == idProducto).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="El producto no existe.")
    db_producto.baja = True
    db.commit()
    return {"detail": "Producto dado de baja exitosamente"}

@router.put("/{idProducto}/restablecer")
def restablecer_producto(idProducto: int, db: Session = Depends(get_db)):
    db_producto = db.query(Producto).filter(Producto.idProducto == idProducto).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="El producto no existe.")
    db_producto.baja = False
    db.commit()
    return {"detail": "Producto ha sido reestablecido exitosamente"}


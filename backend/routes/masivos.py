from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.Marca import Marca
from models.Cliente import Cliente, TipoDoc
from models.Categoria import Categoria
from models.Localidad import Localidad
from models.Producto import Producto

from routes.Cliente import Cliente
from routes.Categoria import Categoria
from routes.Localidad import Localidad
from routes.Marca import Marca
from routes.Producto import Producto

from schemas.Cliente import ClienteCreate
from schemas.Categoria import CategoriaCreate
from schemas.Localidad import LocalidadCreate
from schemas.Marca import MarcaCreate
from schemas.Producto import ProductoCreate

from database import get_db
from typing import List


router = APIRouter()


def crear_marca(marca: MarcaCreate, db: Session = Depends(get_db)):
    marca_db = db.query(Marca).filter(Marca.nombre == marca.nombre, Marca.baja == False).first()
    if marca_db:
        raise HTTPException(status_code=400, detail="La marca ya existe.")
    
    nueva_marca = Marca(**marca.dict())
    db.add(nueva_marca)
    db.commit()
    db.refresh(nueva_marca)
    return nueva_marca



def crear_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = db.query(Cliente).filter(Cliente.documento == cliente.documento).first()
    if db_cliente:
        raise HTTPException(status_code=400, detail="El cliente ya existe.")
    
    if cliente.tipoDoc not in TipoDoc:
        raise HTTPException(status_code=400, detail="Tipo de documento no válido.")
    
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
        documento=cliente.documento,
        tipoDoc=cliente.tipoDoc,
        domicilio=cliente.domicilio,
        localidad=localidad_objeto
    )
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

def crear_localidad(localidad: LocalidadCreate, db: Session = Depends(get_db)):
    db_localidad = db.query(Localidad).filter(Localidad.nombre == localidad.nombre).first()
    if db_localidad:
        raise HTTPException(status_code=400, detail="La localidad ya existe.")
    nueva_localidad = Localidad(**localidad.dict())
    db.add(nueva_localidad)
    db.commit()
    db.refresh(nueva_localidad)
    return nueva_localidad

def crear_categoria(categoria: CategoriaCreate, db: Session = Depends(get_db)):
    categoria_db= db.query(Categoria).filter(Categoria.nombre == categoria.nombre, Categoria.baja == False).first()
    if categoria_db:
        raise HTTPException(status_code=400, detail="La categoria ya existe.")
    
    nueva_categoria = Categoria(**categoria.dict())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

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


@router.post("/marcasMasivas/")
async def cargar_marcas_masivas(marcas: List[MarcaCreate], db: Session = Depends(get_db)):
    resultados = {"exitosos": [], "errores": []}
    for marca in marcas:
        try:
            nueva_marca = crear_marca(marca, db)
            resultados["exitosos"].append(nueva_marca)
        except HTTPException as e:
            resultados["errores"].append({"marca": marca.nombre, "error": e.detail})
    return resultados


@router.post("/categoriasMasivas/")
async def cargar_categorias_masivas(categorias: List[CategoriaCreate], db: Session = Depends(get_db)):
    resultados = {"exitosos": [], "errores": []}
    for categoria in categorias:
        try:
            nueva_categoria = crear_categoria(categoria, db)
            resultados["exitosos"].append(nueva_categoria)
        except HTTPException as e:
            resultados["errores"].append({"categoria": categoria.nombre, "error": e.detail})
    return resultados


@router.post("/productosMasivos/")
async def cargar_productos_masivos(productos: List[ProductoCreate], db: Session = Depends(get_db)):
    resultados = {"exitosos": [], "errores": []}
    for producto in productos:
        try:
            nuevo_producto = crear_producto(producto, db)
            resultados["exitosos"].append(nuevo_producto)
        except HTTPException as e:
            resultados["errores"].append({"producto": producto.nombre, "error": e.detail})
    return resultados


@router.post("/localidadesMasivas/")
async def cargar_localidades_masivas(localidades: List[LocalidadCreate], db: Session = Depends(get_db)):
    resultados = {"exitosos": [], "errores": []}
    for localidad in localidades:
        try:
            nueva_localidad = crear_localidad(localidad, db)
            resultados["exitosos"].append(nueva_localidad)
        except HTTPException as e:
            resultados["errores"].append({"localidad": localidad.nombre, "error": e.detail})
    return resultados


@router.post("/clientesMasivos/")
async def cargar_clientes_masivos(clientes: List[ClienteCreate], db: Session = Depends(get_db)):
    resultados = {"exitosos": [], "errores": []}
    for cliente in clientes:
        try:
            nuevo_cliente = crear_cliente(cliente, db)
            resultados["exitosos"].append(nuevo_cliente)
        except HTTPException as e:
            resultados["errores"].append({"cliente": cliente.documento, "error": e.detail})
    return resultados






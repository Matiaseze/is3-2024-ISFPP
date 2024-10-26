from fastapi import FastAPI
from database import engine, Base
from models import Producto
from routes import Producto

app = FastAPI()

# Crear tablas
Base.metadata.create_all(bind=engine)

# Registrar las rutas de producto
app.include_router(Producto.router, prefix="/productos", tags=["productos"])

from fastapi import FastAPI
from database import engine, Base
from models import Producto, Pedido, Marca, Cliente, Localidad, Pago, Categoria
from routes import Producto, Pedido, Marca, Cliente, Localidad, Pago, Categoria

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#Middleware para la conexion con REACT
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Permitir todos los orígenes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear tablas
Base.metadata.create_all(bind=engine)

# Registrar las rutas de producto
app.include_router(Producto.router, prefix="/productos", tags=["productos"])
app.include_router(Pedido.router, prefix="/pedidos", tags=["pedidos"])
app.include_router(Marca.router, prefix="/marcas", tags=["marcas"])
app.include_router(Cliente.router, prefix="/clientes", tags=["clientes"])
app.include_router(Localidad.router, prefix="/localidades", tags=["localidades"])
app.include_router(Categoria.router, prefix="/categorias", tags=["categorias"])
app.include_router(Pago.router, prefix="/pagos", tags=["pagos"])

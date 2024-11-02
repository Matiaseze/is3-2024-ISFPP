from fastapi import FastAPI
from database import engine, Base
from models import Producto, Marca, Cliente, Localidad
from routes import Producto, Marca, Cliente, Localidad
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

# Categorias de ejemplo para probar el formulario de alta producto BORRAR DESPUES
categorias = [
    "Electrónica",
    "Ropa",
    "Alimentos",
    "Juguetes"
]
# Categorias de ejemplo para probar el formulario de alta producto BORRAR DESPUES
marcas = [
    "Motorola",
    "Asus",
    "LG",
    "MSI"
]

@app.get("/categorias")
async def get_categorias():
    return categorias

@app.get("/marcas")
async def get_marcas():
    return marcas

# Crear tablas
Base.metadata.create_all(bind=engine)

# Registrar las rutas de producto
app.include_router(Producto.router, prefix="/productos", tags=["productos"])
app.include_router(Marca.router, prefix="/marcas", tags=["marcas"])
app.include_router(Cliente.router, prefix="/clientes", tags=["clientes"])
app.include_router(Localidad.router, prefix="/localidades", tags=["localidades"])

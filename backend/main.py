from fastapi import FastAPI
from database import engine, Base
<<<<<<< HEAD
from models import Producto, Pedido, Marca, Cliente, Localidad, Pago, Categoria
from routes import Producto, Pedido, Marca, Cliente, Localidad, Categoria
=======
from models import Producto, Marca, Pedido
from routes import Producto, Marca, Pedido
>>>>>>> c73451f04716309c5f18727a835f4c892c45d2f5
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
# # Marcas de ejemplo para probar el formulario de alta producto BORRAR DESPUES
# marcas = [
#     "Motorola",
#     "Asus",
#     "LG",
#     "MSI"
# ]

@app.get("/categorias")
async def get_categorias():
    return categorias 

# @app.get("/marcas")
# async def get_marcas():
#     return marcas

# Crear tablas
Base.metadata.create_all(bind=engine)

# Registrar las rutas de producto
app.include_router(Producto.router, prefix="/productos", tags=["productos"])
app.include_router(Pedido.router, prefix="/pedidos", tags=["pedidos"])
app.include_router(Marca.router, prefix="/marcas", tags=["marcas"])
app.include_router(Cliente.router, prefix="/clientes", tags=["clientes"])
app.include_router(Localidad.router, prefix="/localidades", tags=["localidades"])
app.include_router(Categoria.router, prefix="/categorias", tags=["categorias"])

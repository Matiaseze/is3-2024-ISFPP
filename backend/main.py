from fastapi import FastAPI
from database import engine, Base

app = FastAPI()

# Crear tablas
@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Backend!"}

# ISFPP

  

# CARRITO DE COMPRAS “ELECTRÓNICA DEL VALLE”

  

## Universidad Nacional de la Patagonia San Juan Bosco

## Facultad de Ingeniería - Sede Trelew

## Licenciatura en Sistemas

## Ingeniería de Software III – T

  

## 2024

  

### Alumnos:

* Barea Matias

* Blum Ariel

* Gonzalez Alejo

* Perez Luciana

* Toro Santiago

  

### Profesores:

* Lic. Schanz, Sebastian

* Lic. Urrutia, Guillermo


## Relevamiento Informal

Desarrollar un sistema que permita gestionar los productos, pedidos de compra y  pagos de la empresa "Electrónica del Valle" dedicada a la venta de productos electrónicos (como pueden ser smartphones, tablets, notebooks, etc) en el valle de Chubut.

El sistema deberá poder realizar las tareas de alta, baja y modificación de los productos. De cada producto se registrará nombre, descripción, marca, precio y cantidad en stock. Los productos se deberán encontrar categorizados por lo que se debe permitir la creación de las diferentes categorías para facilitar la búsqueda y organización de los mismos.

Deberá poder registrar un pedido de compra de un cliente con los productos pedidos y sus cantidades y el cliente que realiza el pedido.

De los clientes se registrará el nombre y apellido, CUIT/CUIL/DNI.

También se deberán poder registrar los pagos asociados a cada pedido. Los pagos pueden abonarse por cualquier medio de pago. No hará falta que el sistema realice la facturación, ya que la misma se seguirá realizando en forma manual desde la plataforma que brinda AFIP.

El trabajo consiste en realizar las siguientes, especificaciones, modelos y diagramas:

1.  Análisis de riesgos.
    
2.  Plan de desarrollo con actividades, hitos y personas a cargo.
    
3.  Identificar requerimientos funcionales. Confeccionar las historias de usuario e indicar los criterios de aceptación.
    
4.  Diagrama de clases de software.
    
5.  Indicar requerimientos no funcionales (tecnologías a utilizar).
    
6.  Estimar el tiempo y esfuerzo necesario para llevar a cabo el proyecto. (PF).
    

	1.  En base a los requerimientos funcionales planteados, realice el cálculo de Puntos de Función Ajustados, justifique cada valor de los factores de ajuste y estime una cantidad de LDC y el esfuerzo requerido (en personas/mes) para completar el trabajo.
    
	2.  Al finalizar, haga un cálculo de la cantidad de líneas de código que involucró el software ya terminado. Realice una conclusión con respecto a los valores obtenidos.
    

7.  Elaborar casos de prueba.
    
8.  Diagrama de datos (Entidad-Relación).
    
9.  Codificación y producción de contenido. Se deberá indicar los estándares de programación para cada lenguaje utilizado durante la producción de contenido.


### Tecnologias


- **PostgreSQL 14**: Base de datos.
- **pgAdmin**: Herramienta para la administración de la base de datos vía web.
- **FastAPI**: Backend para servir una API.
- **React**: Frontend de la aplicación web.

### Requisitos previos

- [Docker](https://www.docker.com/get-started)

### Estructura del proyecto

```plaintext
.
├── backend
│   ├── Dockerfile
│   ├── main.py
│   ├── requirements.txt
├── frontend
│   ├── Dockerfile
│   ├── package.json
├── docker-compose.yml
└── README.md
```
#### Modo de uso 


1. Clonar el repositorio

Clona este repositorio en tu máquina local:

bash

git clone https://github.com/tuusuario/tu-repositorio.git
cd tu-repositorio

2. Crear la aplicación React

En la carpeta frontend/, inicializa el proyecto React (si no lo has hecho ya):

cd frontend
npx create-react-app .

3. Configurar e iniciar el proyecto con Docker

Desde el directorio raíz del proyecto (donde está el archivo docker-compose.yml), ejecutar:

docker-compose up -d --build

Esto levantará los siguientes servicios:

    PostgreSQL en localhost:5432
    pgAdmin en localhost:5050
    FastAPI en localhost:8000
    React en localhost:3000

4. Acceder a los servicios

    pgAdmin: Accede a http://localhost:5050 con las siguientes credenciales:
        Email: admin@admin.com
        Contraseña: admin

    Una vez dentro de pgAdmin, agrega un servidor con los siguientes datos para conectarte a PostgreSQL:
        Hostname: postgres
        Username: postgres
        Contraseña: is32024
        Database: electronica-db

    FastAPI: La API estará disponible en http://localhost:8000.
	y para acceder a la documentación automática en http://localhost:8000/docs.

    React: La aplicación React estará disponible en http://localhost:3000.
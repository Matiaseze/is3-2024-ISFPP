import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import axios from 'axios';

const NavbarApp = ({ carrito, setCarrito }) => {

    // Función para enviar el carrito al backend para crear el pedido
    const manejarCompra = async () => {
        const productosConDetalles = await Promise.all(carrito.map(async producto => {
            console.log(carrito)
            // Aquí puedes hacer una llamada a tu backend para obtener los detalles del producto
            const response = await axios.get(`http://localhost:8000/productos/${producto.idProducto}`); // Asegúrate de tener este endpoint
            const productoDetalles = response.data; // Suponiendo que el backend devuelve los detalles del producto
    
            return {
                producto: {
                    idProducto: productoDetalles.idProducto,
                    nombre: productoDetalles.nombre,
                    descripcion: productoDetalles.descripcion,
                    marca: productoDetalles.marca,
                    precio: productoDetalles.precio,
                    stock: productoDetalles.stock,
                    categoria: productoDetalles.categoria,
                    baja: productoDetalles.baja
                },
                cantidad: 1, // O la cantidad que desees
                precioUnitario: producto.precio,
                subTotal: producto.precio, // O la lógica que desees aplicar
            };
        }));
        const pedido = {
            nombreCliente: "Juan", // O la lógica que uses para obtener el nombre
            montoTotal: carrito.reduce((acc, p) => acc + p.precio, 0),
            cancelado: false, // O el estado que desees
            detalles: productosConDetalles, // Asegúrate de que este tenga la estructura correcta
        };
    
        console.log(pedido); // Para verificar que el pedido tiene la estructura correcta
    
        try {
            const response = await axios.post('http://localhost:8000/pedidos/crear_pedido', pedido);
            if (response.status === 200) {
                alert("Pedido creado con éxito.");
                setCarrito([]); // Limpia el carrito después de la compra
            }
        } catch (error) {
            alert("Error al realizar la compra");
            console.error(error.response.data); // Muestra más detalles del error
        }
    };

    return (
        <Navbar bg="light" className="mb-3">
            <Container>
                <Navbar.Brand href="/">Home</Navbar.Brand>
                <Nav className="mx-auto">
                    <NavDropdown title="Productos" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/productos/registrar">Registrar nuevo Producto</NavDropdown.Item>
                        <NavDropdown.Item href="/productos">Catálogo</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    <NavDropdown title={`Carrito (${carrito.length})`} id="navbarScrollingCart">
                        {carrito.length === 0 ? (
                            <NavDropdown.Item>No hay productos en el carrito</NavDropdown.Item>
                        ) : (
                            <>
                                {carrito.map((producto, index) => (
                                    <NavDropdown.Item key={index}>
                                        {producto.nombre} - ${producto.precio}
                                    </NavDropdown.Item>
                                ))}
                                <NavDropdown.Divider />
                                <NavDropdown.Item>
                                    <strong>Total:</strong> ${carrito.reduce((acc, p) => acc + p.precio, 0)}
                                </NavDropdown.Item>
                                <NavDropdown.Item className="text-center">
                                    <Button variant="success" onClick={manejarCompra}>
                                        Comprar
                                    </Button>
                                </NavDropdown.Item>
                            </>
                        )}
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarApp;

import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import axios from 'axios';

const NavbarApp = ({ carrito, setCarrito, vistaActual }) => {

    const manejarCompra = async () => {
        const productosConDetalles = await Promise.all(carrito.map(async producto => {
            const response = await axios.get(`http://localhost:8000/productos/${producto.idProducto}`);
            const productoDetalles = response.data;

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
                cantidad: 1,
                precioUnitario: producto.precio,
                subTotal: producto.precio,
            };
        }));

        const pedido = {
            nombreCliente: "Juan",
            montoTotal: carrito.reduce((acc, p) => acc + p.precio, 0),
            cancelado: false,
            detalles: productosConDetalles,
        };

        try {
            const response = await axios.post('http://localhost:8000/pedidos/crear_pedido', pedido);
            if (response.status === 201) {
                alert("Pedido creado con éxito.");
                setCarrito([]);
            }
        } catch (error) {
            alert("Error al realizar la compra");
            console.error(error.response.data);
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
                <Nav className="mx-auto">
                    <NavDropdown title="Marcas" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/marcas/registrar">Registrar nueva Marca</NavDropdown.Item>
                        <NavDropdown.Item href="/marcas">Catálogo</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="mx-auto">
                    <NavDropdown title="Pedidos" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/pedidos">Listado de pedidos</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    {vistaActual === 'catalogo' && ( // Solo mostrar el carrito si estamos en la vista de catálogo
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
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarApp;
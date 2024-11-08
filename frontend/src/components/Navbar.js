import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const NavbarApp = ({ carrito, setCarrito, vistaActual }) => {
    
    const manejarCompra = async () => {

        const productosConDetalles = await Promise.all(carrito.map(async producto => {
            const response = await axios.get(`http://localhost:8000/productos/${producto.idProducto}`);
            const productoDetalles = response.data;

            return {
                idProducto: productoDetalles.idProducto,
                cantidad: producto.cantidad,
                precioUnitario: producto.precio,
                subTotal: producto.precio * producto.cantidad,
            };
        }));

        const pedido = {
            idCliente: clienteSeleccionado.idCliente,  // Incluir el idCliente
            montoTotal: carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
            estado: "INICIADO",
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

    const vaciarCarrito = () => {
        setCarrito([]);
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
                    <NavDropdown title="Pedidos" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/pedidos">Listado de pedidos</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav>
                    {vistaActual === 'catalogo' && ( // Solo mostrar el carrito si estamos en la vista de catálogo
                    <NavDropdown title={`Carrito (${carrito.reduce((acc, p) => acc + p.cantidad, 0)} productos)`} id="navbarScrollingCart">
                    {carrito.length === 0 ? (
                        <NavDropdown.Item>No hay productos en el carrito</NavDropdown.Item>
                    ) : (
                        <>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {carrito.map((producto, index) => (
                            <NavDropdown.Item key={index}>
                                <div className="d-flex justify-content-between">
                                <span>{producto.nombre}</span>
                                <span>${producto.precio} x {producto.cantidad} = ${producto.precio * producto.cantidad}</span>
                                </div>
                            </NavDropdown.Item>
                            ))}
                            <NavDropdown.Divider />
                            <NavDropdown.Item>
                            <strong>Total:</strong> ${carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0)}
                            </NavDropdown.Item>
                        </div>
                        
                        <NavDropdown.Divider />

                        <NavDropdown.Item className="text-center">
                            <Button variant="success" onClick={manejarCompra}>
                            Comprar
                            </Button>
                        </NavDropdown.Item>
                    
                        {/* Botón para vaciar el carrito */}
                        <NavDropdown.Item className="text-center" onClick={vaciarCarrito}>
                            <Button variant="danger" size="sm">
                            Vaciar carrito
                            </Button>
                        </NavDropdown.Item>
                        </>
                    )}
                    </NavDropdown>
                    )}
                </Nav>
                <Nav className="mx-auto">  {/* Centra el menú en la barra */}
                    <NavDropdown title="Categorias" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/categorias/registrar">Registrar nueva categoría</NavDropdown.Item>
                        <NavDropdown.Item href="/categorias">Listado de categorías</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarApp;
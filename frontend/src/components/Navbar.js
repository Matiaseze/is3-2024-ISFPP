import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const NavbarApp = ({ carrito, setCarrito, vistaActual, clienteSeleccionado }) => {

    const manejarCompra = async () => {

        const productosConDetalles = await Promise.all(carrito.map(async producto => {
            const response = await axios.get(`http://localhost:8000/productos/${producto.idProducto}`);
            const productoDetalles = response.data;
            return {
                precioUnitario: producto.precio,
                cantidad: producto.cantidad,
                subTotal: producto.precio * producto.cantidad,
                id: 0,  // Aquí puedes asignar un ID si es necesario o dejarlo en 0 como en el formato
                producto: {
                    idProducto: productoDetalles.idProducto,
                    nombre: productoDetalles.nombre,
                    descripcion: productoDetalles.descripcion,
                    precio: productoDetalles.precio,
                    stock: productoDetalles.stock,
                    marca: {
                        idMarca: productoDetalles.marca.idMarca,
                        nombre: productoDetalles.marca.nombre,
                        descripcion: productoDetalles.marca.descripcion,
                        baja: productoDetalles.marca.baja,
                    },
                    categoria: {
                        idCategoria: productoDetalles.categoria.idCategoria,
                        nombre: productoDetalles.categoria.nombre,
                        descripcion: productoDetalles.categoria.descripcion,
                        baja: productoDetalles.categoria.baja,
                    },
                    baja: productoDetalles.baja,  // Si corresponde, dependiendo del producto
                }
            };
        }));

        // Formatear el pedido
        const pedido = {
            montoTotal: carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0),
            estado: "INICIADO",
            // fechaPedido: new Date().toISOString(),  // Fecha actual en formato ISO
            cliente: {
                nombre: clienteSeleccionado.nombre,
                apellido: clienteSeleccionado.apellido,
                dni: clienteSeleccionado.dni,
                tipoDoc: clienteSeleccionado.tipoDoc,
                domicilio: clienteSeleccionado.domicilio,
                localidad: {
                    nombre: clienteSeleccionado.localidad.nombre,
                    codPostal: clienteSeleccionado.localidad.codPostal,
                },
                idCliente: clienteSeleccionado.idCliente,
                baja: clienteSeleccionado.baja,
            },
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
                    <NavDropdown title="Clientes" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/clientes/registrar">Registrar nuevo Cliente</NavDropdown.Item>
                        <NavDropdown.Item href="/clientes">Listado de clientes</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
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
                <Nav className="mx-auto">  
                    <NavDropdown title="Pagos" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/pagos">Listar pagos</NavDropdown.Item>
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
                                            Registrar Pedido
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
                <Nav className="mx-auto"> 
                    <NavDropdown title="Categorias" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/categorias/registrar">Registrar nueva categoría</NavDropdown.Item>
                        <NavDropdown.Item href="/categorias">Listado de categorías</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
                <Nav className="mx-auto"> 
                    <NavDropdown title="Localidades" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/localidades/registrar">Registrar nueva localidad</NavDropdown.Item>
                        <NavDropdown.Item href="/localidades">Listado de localidades</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default NavbarApp;
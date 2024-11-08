import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, NavDropdown, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const NavbarApp = ({ carrito, setCarrito, vistaActual }) => {
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    // Obtener los clientes al cargar el componente
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/clientes/');  // Asumiendo que la URL de clientes es esta
                setClientes(response.data);
            } catch (error) {
                console.error("Error al obtener los clientes", error);
            }
        };

        fetchClientes();
    }, []);

    const manejarCompra = async () => {
        if (!clienteSeleccionado) {
            alert("Por favor, selecciona un cliente.");
            return;
        }

        const productosConDetalles = await Promise.all(carrito.map(async producto => {
            const response = await axios.get(`http://localhost:8000/productos/${producto.idProducto}`);
            const productoDetalles = response.data;

            return {
                producto: {
                    idProducto: productoDetalles.idProducto,
                    nombre: productoDetalles.nombre,
                    descripcion: productoDetalles.descripcion,
                    marca: productoDetalles.idMarca,
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
            nombreCliente: clienteSeleccionado.nombre,  // Usar el nombre del cliente seleccionado
            idCliente: clienteSeleccionado.idCliente,  // Incluir el idCliente
            montoTotal: carrito.reduce((acc, p) => acc + p.precio, 0),
            cancelado: false,
            detalles: productosConDetalles,
        };

        try {
            const response = await axios.post('http://localhost:8000/pedidos/crear_pedido', pedido);
            console.log(pedido)
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
<<<<<<< HEAD
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
                                    <NavDropdown.Item>
                                        {/* Dropdown para seleccionar el cliente */}
                                        <Form.Group controlId="clienteSeleccionado">
                                            <Form.Label>Selecciona un cliente</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={clienteSeleccionado ? clienteSeleccionado.idCliente : ''}
                                                onChange={(e) => {
                                                    const clienteId = e.target.value;
                                                    const cliente = clientes.find(c => c.idCliente.toString() === clienteId);
                                                    setClienteSeleccionado(cliente);
                                                }}
                                            >
                                                <option value="">Elige un cliente</option>
                                                {clientes.map(cliente => (
                                                    <option key={cliente.idCliente} value={cliente.idCliente}>
                                                        {cliente.nombre} {cliente.apellido}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
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
=======
                <Nav className="mx-auto">  {/* Centra el menú en la barra */}
                    <NavDropdown title="Categorias" id="navbarScrollingDropdown">
                        <NavDropdown.Item href="/categorias/registrar">Registrar nueva categoría</NavDropdown.Item>
                        <NavDropdown.Item href="/categorias">Listado de categorías</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
>>>>>>> 55ed739b90da3e43050c1ea62f117fcbe9648e69
            </Container>
        </Navbar>
    );
};

export default NavbarApp;
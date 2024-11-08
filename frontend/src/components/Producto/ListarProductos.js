import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, InputGroup, FormControl, Form } from 'react-bootstrap';

import ProductoModal from './ProductoModal';
import FiltroProductos from './FiltroProductos'; // Importar el componente de filtro

const ListarProductos = ({ agregarAlCarrito, setVistaActual }) => {
    const [loading, setLoading] = useState(true);   // Indicador de carga
    const [error, setError] = useState(null);       // Manejo de errores
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);

    // Filtros
    const [nombreFilter, setNombreFilter] = useState('');
    const [marcaFilter, setMarcaFilter] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');

    // Listas de marcas y categorías (puedes obtenerlas de tu API)
    const [marcasDisponibles, setMarcasDisponibles] = useState([]);
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

    // Estado para manejar la cantidad seleccionada de cada producto
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState({});
    // Para menjar los clientes
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

    useEffect(() => {
        setVistaActual('catalogo'); // Actualiza la vista actual a "catalogo"
    }, [setVistaActual]);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/productos');
                setProductos(response.data); // Actualizar la lista de productos
                setFilteredProductos(response.data); // Inicialmente muestra todos los productos
                // Marcas y categorias disponibles
                const marcas = [...new Set(response.data.map(p => p.idMarca))];
                const categorias = [...new Set(response.data.map(p => p.categoria))];
                setMarcasDisponibles(marcas);
                setCategoriasDisponibles(categorias);
            } catch (err) {
                setError("Error al cargar productos"); // Mensaje en caso de error
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/clientes/');  // Asumiendo que la URL de clientes es esta
                setClientes(response.data);
            } catch (error) {
                console.error("Error al obtener los clientes", error);
            }
        };
        fetchClientes();
        fetchProductos();
    }, []);

    useEffect(() => {
        const filterProductos = () => {
            let tempProductos = [...productos];
    
            // Filtrar por nombre
            if (nombreFilter) {
                tempProductos = tempProductos.filter(producto => 
                    producto.nombre.toLowerCase().includes(nombreFilter.toLowerCase())
                );
            }
    
            // Filtrar por marca usando `idMarca` en lugar de `marca.nombre`
            if (marcaFilter) {
                tempProductos = tempProductos.filter(producto => 
                    producto.idMarca === marcaFilter // Ajusta según el schema que recibas
                );
            }
    
            // Filtrar por categoría
            if (categoriaFilter) {
                tempProductos = tempProductos.filter(producto => 
                    producto.categoria.toLowerCase() === categoriaFilter.toLowerCase()
                );
            }
    
            // Filtrar por rango de precio
            if (precioMin) {
                tempProductos = tempProductos.filter(producto => 
                    producto.precio >= precioMin
                );
            }
    
            if (precioMax) {
                tempProductos = tempProductos.filter(producto => 
                    producto.precio <= precioMax
                );
            }
    
            setFilteredProductos(tempProductos);
        };
    
        // Solo aplicar el filtro si los filtros han cambiado
        if (nombreFilter || marcaFilter || categoriaFilter || precioMin || precioMax) {
            filterProductos();
        }
    
    }, [nombreFilter, marcaFilter, categoriaFilter, precioMin, precioMax, productos]);

    const handleShowModal = (producto) => {
        setSelectedProducto(producto);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProducto(null);
    };

    // Actualiza la lista de productos cuando se guarda una edición
    const handleProductoUpdated = (updatedProducto) => {
        setProductos((prevProductos) =>
            prevProductos.map((prod) =>
                prod.idProducto === updatedProducto.idProducto ? updatedProducto : prod
            )
        );
        setShowModal(false); // Cierra el modal
    };

    const handleAgregarAlCarrito = (producto) => {
        // Verifica si un cliente está seleccionado antes de agregar al carrito
        if (!clienteSeleccionado) {
            alert('Debes seleccionar un cliente antes de agregar productos al carrito.');
            return;
        }
    
        // Agregar producto al carrito con el cliente
        const productoConCliente = {
            ...producto,  // Propiedades del producto
            idCliente: clienteSeleccionado.idCliente,  // Añadir el id del cliente seleccionado
            cantidad: cantidadSeleccionada[producto.idProducto] || 1  // Cantidad seleccionada, por defecto 1
        };
    
        // Llamar a la función que agrega al carrito, pasando el producto con cliente
        agregarAlCarrito(productoConCliente);
    };
     // Maneja el cambio en la cantidad seleccionada para un producto específico
     const handleCantidadChange = (productoId, nuevaCantidad) => {
        setCantidadSeleccionada((prevCantidades) => {
            console.log("Actualizando cantidad para producto:", productoId, "a", nuevaCantidad);
            return {
                ...prevCantidades,
                [productoId]: nuevaCantidad
            };
        });
    };

    const handleClienteChange = (e) => {
        const clienteId = e.target.value;
        const cliente = clientes.find(c => c.idCliente.toString() === clienteId);
        setClienteSeleccionado(cliente);
    }; 
    if (loading) return <p>Cargando productos...</p>; // Muestra mientras carga
    if (error) return <p>{error}</p>; // Muestra el error

    return (
        <Container>
            <h1>Listar Productos</h1>

            {/* Selector de Cliente */}
            <Form.Group controlId="clienteSeleccionado">
                <Form.Label>Selecciona un Cliente</Form.Label>
                <Form.Control
                    as="select"
                    value={clienteSeleccionado ? clienteSeleccionado.idCliente : ''}
                    onChange={handleClienteChange}
                >
                    <option value="">Elige un cliente</option>
                    {clientes.map(cliente => (
                        <option key={cliente.idCliente} value={cliente.idCliente}>
                            {cliente.nombre} {cliente.apellido}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            {/* Usar el componente de filtro */}
            <FiltroProductos 
                nombreFilter={nombreFilter} 
                setNombreFilter={setNombreFilter}
                marcaFilter={marcaFilter} 
                setMarcaFilter={setMarcaFilter}
                categoriaFilter={categoriaFilter} 
                setCategoriaFilter={setCategoriaFilter}
                precioMin={precioMin} 
                setPrecioMin={setPrecioMin}
                precioMax={precioMax} 
                setPrecioMax={setPrecioMax}
                marcasDisponibles={marcasDisponibles}
                categoriasDisponibles={categoriasDisponibles}
            />
            <Row>
                {filteredProductos.map((producto) => (
                    <Col key={producto.idProducto} sm={12} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{producto.nombre}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{producto.marca}</Card.Subtitle>
                                <Card.Text>
                                    <strong>Categoría:</strong> {producto.categoria} <br />
                                    <strong>Precio:</strong> ${producto.precio} <br />
                                    <strong>Stock:</strong> {producto.stock}
                                </Card.Text>
                                <InputGroup className="mb-3">
                                    <FormControl
                                        type="number"
                                        min="1"
                                        max={producto.stock}
                                        value={cantidadSeleccionada[producto.idProducto] || 1}
                                        onChange={(e) => handleCantidadChange(producto.idProducto, parseInt(e.target.value) || 1)}
                                    />
                                </InputGroup>
                                <Button variant="primary" onClick={() => handleAgregarAlCarrito(producto)}>
                                    Agregar al Carrito
                                </Button>
                                <Button variant="info" onClick={() => handleShowModal(producto)}>
                                    Ver Detalles
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <ProductoModal 
                show={showModal} 
                onHide={handleCloseModal} 
                producto={selectedProducto} 
                onProductoUpdated={handleProductoUpdated} 
            />
        </Container>
    );
};

export default ListarProductos;
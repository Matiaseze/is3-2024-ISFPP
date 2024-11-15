import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import ClienteModal from './ClienteModal';
//import FiltroProductos from './FiltroProductos'; // Importar el componente de filtro

const ListarClientes = () => {
    const [loading, setLoading] = useState(true);   // Indicador de carga
    const [error, setError] = useState(null);       // Manejo de errores
    // const [filteredClientes, setFilteredClientes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);  // Nuevo estado para el mensaje de eliminación

    // Filtros
    /* const [nombreFilter, setNombreFilter] = useState('');
    const [marcaFilter, setMarcaFilter] = useState('');
    const [categoriaFilter, setCategoriaFilter] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState(''); */

    // Listas de marcas y categorías (puedes obtenerlas de tu API)
    // const [marcasDisponibles, setMarcasDisponibles] = useState([]);

    // Para menjar los clientes
    const [clientes, setClientes] = useState([]);

    /* useEffect(() => {
        setVistaActual('catalogo'); // Actualiza la vista actual a "catalogo"
    }, [setVistaActual]); */

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/clientes/');  // Asumiendo que la URL de clientes es esta
                setClientes(response.data);
                // setFilteredClientes(response.data); // Inicialmente muestra todos los clientes
                // Localidades disponibles
                // const localidades = [...new Set(response.data.map(p => p.localidad))];
                // setLocalidadesDisponibles(localidades);
            } catch (err) {
                setError("Error al cargar los clientes"); // Mensaje en caso de error
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };
        fetchClientes();
    }, []);

    /* useEffect(() => {
        const filterClientes = () => {
            let tempClientes = [...clientes];

            if (nombreFilter) {
                tempClientes = tempClientes.filter(cliente =>
                    cliente.nombre.toLowerCase().includes(nombreFilter.toLowerCase())
                );
            }
        };
        filterClientes();
    }, [nombreFilter, clientes]); */

    const handleShowModal = (cliente) => {
        setSelectedCliente(cliente);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCliente(null);
    };

    // Actualiza la lista de clientes cuando se guarda una edición
    const handleClienteUpdated = (updatedCliente) => {
        setClientes((prevClientes) =>
            prevClientes.map((cli) =>
                cli.idCliente === updatedCliente.idCliente ? updatedCliente : cli
            )
        );
        setShowModal(false); // Cierra el modal
    };

    const handleDeleteClick = async (idCliente) => {
        try {
            await axios.delete(`http://localhost:8000/clientes/${idCliente}`);
            setClientes((prevClientes) =>
                prevClientes.filter((cli) => cli.idCliente !== idCliente)
            );
            setDeleteMessage("El cliente ha sido eliminado exitosamente.");  // Mensaje de confirmación
            setTimeout(() => setDeleteMessage(null), 3000);  // Oculta el mensaje después de 3 segundos
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
        }
    };

    /* const handleAgregarAlCarrito = (producto) => {
        // Verifica si un cliente está seleccionado antes de agregar al carrito
        if (!clienteSeleccionado) {
            alert('Debes seleccionar un cliente antes de agregar productos al carrito.');
            return;
        }

        // Agregar producto al carrito con el cliente
        const productoConCliente = {
            ...producto,  // Propiedades del producto
            cliente: clienteSeleccionado,  // Añadir el id del cliente seleccionado
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
    }; */

    /* const handleClienteChange = (e) => {
        const clienteId = e.target.value;
        const cliente = clientes.find(c => c.idCliente.toString() === clienteId);
        setClienteSeleccionado(cliente);
    }; */
    if (loading) return <p>Cargando clientes...</p>; // Muestra mientras carga
    if (error) return <p>{error}</p>; // Muestra el error

    return (
        <Container>
            <h1>Listar Clientes</h1>

            {/* Muestra el mensaje de eliminación si existe */}
            {deleteMessage && <Alert variant="success">{deleteMessage}</Alert>}

            {/* Selector de Cliente */}
            {/* <Form.Group controlId="clienteSeleccionado">
                <Form.Label>Selecciona un Cliente</Form.Label>
                <Form.Control
                    as="select"
                    value={clienteSeleccionado ? clienteSeleccionado.idCliente : ''}
                    onChange={handleClienteChange}
                >
                    <option value="">Elige un cliente</option>
                    {clientes.map((cliente, index) => (
                        <option key={`${cliente.idCliente}-${index}`} value={cliente.idCliente}>
                            {cliente.nombre} {cliente.apellido}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group> */}
            {/* Usar el componente de filtro */}
            {/* <FiltroClientes
                nombreFilter={nombreFilter}
                setNombreFilter={setNombreFilter}
            /> */}
            {/* <Row> */}
            {clientes.map((cliente) => (
                // <Col key={cliente.idCliente} sm={12} md={6} lg={4} className="mb-4">
                    <Card
                        style={{
                            opacity: cliente.baja ? 0.5 : 1,  // Aplica transparencia si baja es true
                            pointerEvents: cliente.baja ? 'none' : 'auto'  // Deshabilita interacciones si baja es true
                        }}
                    >
                        <Card.Body>
                            <Card.Title>{cliente.nombre}{cliente.apellido}</Card.Title>
                            {/* <Card.Subtitle className="mb-2 text-muted">{cliente.localidad.nombre}</Card.Subtitle> */}
                            <Card.Text>
                                <strong>dni:</strong> {cliente.dni} <br />
                                <strong>tipoDoc:</strong> {cliente.tipoDoc} <br />
                                <strong>domicilio:</strong> {cliente.domicilio} <br />
                                <strong>localidad:</strong> {cliente.localidad.nombre} <br />
                            </Card.Text>
                            {/* <InputGroup className="mb-3">
                                <FormControl
                                    type="number"
                                    min="1"
                                    max={producto.stock}
                                    value={cantidadSeleccionada[producto.idProducto] || 1}
                                    onChange={(e) => {
                                        let newValue = parseInt(e.target.value) || 1;
                                        if (newValue > producto.stock) {
                                            newValue = producto.stock;
                                        }
                                        handleCantidadChange(producto.idProducto, newValue);
                                    }}
                                    disabled={producto.baja}  // Deshabilita el input si baja es true
                                />
                            </InputGroup> */}
                            {/* <Button
                                variant="info"
                                onClick={() => handleShowModal(cliente)}
                                disabled={cliente.baja}  // Deshabilita el botón si baja es true
                            >
                                Ver Detalles
                            </Button> */}
                            <div>
                                <Button variant="info" onClick={() => handleShowModal(cliente)} className="me-2">
                                    Editar
                                </Button>
                                <Button variant="danger" onClick={() => handleDeleteClick(cliente.idCategoria)}>
                                    Eliminar
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                // </Col>
            ))}
            {/* </Row> */}
            <ClienteModal
                show={showModal}
                onHide={handleCloseModal}
                cliente={selectedCliente}
                onClienteUpdated={handleClienteUpdated}
            />
        </Container>
    );
};

export default ListarClientes;
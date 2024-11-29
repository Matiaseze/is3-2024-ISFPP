import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Alert, Form} from 'react-bootstrap';
import ClienteModal from './ClienteModal';
import FiltroClientes from './FiltroClientes'; // Importar el componente de filtro

const ListarClientes = () => {
    const [loading, setLoading] = useState(true);   // Indicador de carga
    const [error, setError] = useState(null);       // Manejo de errores
    const [filteredClientes, setFilteredClientes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);  // Nuevo estado para el mensaje de eliminación

    // Filtros
    const [nombreFilter, setNombreFilter] = useState('');
    const [apellidoFilter, setApellidoFilter] = useState('');
    const [documentoFilter, setDocumentoFilter] = useState('');
    const [localidadFilter, setLocalidadFilter] = useState('');
    
    // Lista de localidades (puedes obtenerlas de tu API)
    const [localidadesDisponibles, setLocalidadesDisponibles] = useState([]);

    // Para menjar los clientes
    const [clientes, setClientes] = useState([]);

    // Nuevo estado para el checkbox "Mostrar solo clientes activos"
    const [mostrarActivos, setMostrarActivos] = useState(false);

    /* useEffect(() => {
        setVistaActual('listado de clientes'); // Actualiza la vista actual a "listado de clientes"
    }, [setVistaActual]); */

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const response = await axios.get('http://localhost:8000/clientes/');  // Asumiendo que la URL de clientes es esta
                setClientes(response.data);
                setFilteredClientes(response.data); // Inicialmente muestra todos los clientes
                // Extraer localidades únicas
                const localidades = [...new Set(response.data.map(cliente => cliente.localidad.nombre))];
                setLocalidadesDisponibles(localidades);
            } catch (err) {
                setError("Error al cargar los clientes"); // Mensaje en caso de error
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };
        fetchClientes();
    }, []);

    useEffect(() => {
        const filterClientes = () => {
            let tempClientes = [...clientes];

            // Filtrar por clientes activos si el checkbox está marcado
            if (mostrarActivos) {
                tempClientes = tempClientes.filter(cliente => cliente.baja === false);
            }

            // Filtrar por documento solo si documentoFilter no esta vacio
            if (documentoFilter) {
                tempClientes = tempClientes.filter(cliente =>
                    cliente.documento === parseInt(documentoFilter)
                );
            }

            // Filtrar por nombre solo si nombreFilter no está vacío
            if (nombreFilter) {
                tempClientes = tempClientes.filter(cliente =>
                    cliente.nombre.toLowerCase().includes(nombreFilter.toLowerCase())
                );
            }

            // Filtrar por nombre solo si nombreFilter no está vacío
            if (apellidoFilter) {
                tempClientes = tempClientes.filter(cliente =>
                    cliente.apellido.toLowerCase().includes(apellidoFilter.toLowerCase())
                );
            }

            // Filtrar por localidad solo si localidadFilter no está vacío
            if (localidadFilter) {
                tempClientes = tempClientes.filter(cliente =>
                    cliente.localidad.nombre.toLowerCase() === localidadFilter.toLowerCase()
                );
            }

            setFilteredClientes(tempClientes); // Actualiza la lista filtrada
        };

        filterClientes();
    }, [documentoFilter, nombreFilter, apellidoFilter, localidadFilter, clientes, mostrarActivos]);

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

    if (loading) return <p>Cargando clientes...</p>; // Muestra mientras carga
    if (error) return <p>{error}</p>; // Muestra el error

    return (
        <Container>
            <h1>Listar Clientes</h1>

            {/* Muestra el mensaje de eliminación si existe */}
            {deleteMessage && <Alert variant="success">{deleteMessage}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Checkbox para filtrar clientes activos */}
            <Form.Check
                type="checkbox"
                label="Mostrar solo clientes activos"
                checked={mostrarActivos}
                onChange={(e) => setMostrarActivos(e.target.checked)}
            />

            {/* Usar el componente de filtro */}
            <FiltroClientes
                documentoFilter={documentoFilter}
                setDocumentoFilter={setDocumentoFilter}
                nombreFilter={nombreFilter}
                setNombreFilter={setNombreFilter}
                apellidoFilter={apellidoFilter}
                setApellidoFilter={setApellidoFilter}
                localidadFilter={localidadFilter}
                setLocalidadFilter={setLocalidadFilter}
                localidadesDisponibles={localidadesDisponibles} // Pasar localidades al hijo
            />
            {filteredClientes.map((cliente) => (
                <Card
                    /* style={{
                        opacity: cliente.baja ? 0.5 : 1,  // Aplica transparencia si baja es true
                        pointerEvents: cliente.baja ? 'none' : 'auto'  // Deshabilita interacciones si baja es true
                    }} */
                >
                    <Card.Body>
                        <Card.Title>{cliente.nombre} {cliente.apellido}</Card.Title>
                        {/* <Card.Subtitle className="mb-2 text-muted">{cliente.localidad.nombre}</Card.Subtitle> */}
                        <Card.Text>
                            <strong>documento:</strong> {cliente.documento} <br />
                            <strong>tipoDoc:</strong> {cliente.tipoDoc} <br />
                            <strong>domicilio:</strong> {cliente.domicilio} <br />
                            <strong>localidad:</strong> {cliente.localidad.nombre} <br />
                        </Card.Text>
                        <div>
                            <Button variant="info" onClick={() => handleShowModal(cliente)} className="me-2">
                                Editar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteClick(cliente.idCliente)}>
                                Eliminar
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import LocalidadModal from './LocalidadModal';

const ListarLocalidades = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [localidades, setLocalidades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedLocalidad, setSelectedLocalidad] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);  // Nuevo estado para el mensaje de eliminación

    useEffect(() => {
        const fetchLocalidades = async () => {
            try {
                const response = await axios.get('http://localhost:8000/localidades/');
                setLocalidades(response.data);
            } catch (err) {
                setError("Error al cargar localidades");
            } finally {
                setLoading(false);
            }
        };
        fetchLocalidades();
    }, []);

    const handleShowModal = (localidad) => {
        setSelectedLocalidad(localidad);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLocalidad(null);
    };

    const handleLocalidadUpdated = (updatedLocalidad) => {
        setLocalidades((prevLocalidades) =>
            prevLocalidades.map((loc) =>
                loc.idLocalidad === updatedLocalidad.idLocalidad ? updatedLocalidad : loc
            )
        );
        setShowModal(false);
    };

    const handleDeleteClick = async (idLocalidad) => {
        try {
            await axios.delete(`http://localhost:8000/localidades/${idLocalidad}`);
            setLocalidades((prevLocalidades) =>
                prevLocalidades.filter((loc) => loc.idLocalidad !== idLocalidad)
            );
            setDeleteMessage("La localidad ha sido eliminada exitosamente.");  // Mensaje de confirmación
            setTimeout(() => setDeleteMessage(null), 3000);  // Oculta el mensaje después de 3 segundos
        } catch (error) {
            console.error("Error al eliminar la localidad:", error);
        }
    };

    if (loading) return <p>Cargando localidades...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1>Listado de Localidades</h1>

            {/* Muestra el mensaje de eliminación si existe */}
            {deleteMessage && <Alert variant="success">{deleteMessage}</Alert>}

            {localidades.map((localidad) => (
                <Card key={localidad.idLocalidad} className="mb-3"
                    style= {{
                        opacity: localidad.baja ? 0.5 : 1,
                    }}
                >
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title>{localidad.nombre}</Card.Title>
                        </div>
                        <div>
                            <Button variant="info" onClick={() => handleShowModal(localidad)} className="me-2">
                                Editar
                            </Button>
                            <Button variant="danger" 
                                    onClick={() => handleDeleteClick(localidad.idLocalidad)}
                                    disabled= {localidad.baja}
                                >
                                Eliminar
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
            {selectedLocalidad && (
                <LocalidadModal 
                    show={showModal} 
                    onHide={handleCloseModal} 
                    localidad={selectedLocalidad} 
                    onLocalidadUpdated={handleLocalidadUpdated} 
                />
            )}
        </Container>
    );
};

export default ListarLocalidades;
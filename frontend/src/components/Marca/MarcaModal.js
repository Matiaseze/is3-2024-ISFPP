import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import editIcon from '../../static/img/edit-button.png';
import saveIcon from '../../static/img/floppy-disk.png';

const MarcaModal = ({ show, onHide, marca, onMarcaUpdated }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [baja, setBaja] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedMarca, setEditedMarca] = useState({ ...marca });

    // Cargar datos de marca al abrir el modal
    useEffect(() => {
        if (marca) {
            setEditedMarca({ ...marca });
            setNombre(marca.nombre || '');
            setDescripcion(marca.descripcion || '');
            setBaja(marca.baja || false);
        }
    }, [marca, show]);

    // Cambiar a modo edición
    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedMarca({
            ...editedMarca,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSaveClick = async () => {
        try {
            await axios.patch(`http://localhost:8000/marcas/${marca.idMarca}`, editedMarca);
            onMarcaUpdated(editedMarca);
            setIsEditing(false);
            onHide();
        } catch (error) {
            console.error("Error al actualizar la marca:", error);
            setError("No se pudo actualizar la marca. Inténtalo de nuevo.");
        }
    };

    return (
        <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="marca-modal-title">
                    {isEditing ? "Editar Marca" : "Detalles de la Marca"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {error && <p className="text-danger">{error}</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '15px' }}>
                        <Button
                            variant="outline-primary"
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                zIndex: "1",
                                padding: "5px",
                            }}
                            onClick={isEditing ? handleSaveClick : handleEditClick}
                        >
                            <img
                                src={isEditing ? saveIcon : editIcon}
                                alt={isEditing ? "Guardar" : "Editar"}
                                style={{ width: "20px", height: "20px" }}
                            />
                        </Button>
                    </div>
                    <Row>
                        <Col xs={12}>
                            <Form>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={editedMarca.nombre || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="descripcion">
                                    <Form.Label>Descripción</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="descripcion"
                                        value={editedMarca.descripcion || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="baja">
                                    <Form.Check
                                        type="checkbox"
                                        label="Baja"
                                        name="baja"
                                        checked={editedMarca.baja || false}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                    />
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MarcaModal;

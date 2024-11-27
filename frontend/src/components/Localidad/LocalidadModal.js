import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import editIcon from '../../static/img/edit-button.png';
import saveIcon from '../../static/img/floppy-disk.png';

const LocalidadModal = ({ show, onHide, localidad, onLocalidadUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedLocalidad, setEditedLocalidad] = useState({ ...localidad });

    useEffect(() => {
        if (localidad) {
            setEditedLocalidad({ ...localidad });
        }
    }, [localidad]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedLocalidad({ ...editedLocalidad, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.patch(`http://localhost:8000/localidades/${localidad.idLocalidad}`, editedLocalidad);
            onLocalidadUpdated(response.data);
            setIsEditing(false);
            onHide();
        } catch (error) {
            console.error("Error al actualizar la localidad:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? "Editar Localidad" : "Detalles de la Localidad"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={12}>
                            <Form>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={editedLocalidad.nombre || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
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
                <Button variant="primary" onClick={isEditing ? handleSaveClick : handleEditClick}>
                    <img
                        src={isEditing ? saveIcon : editIcon}
                        alt={isEditing ? "Guardar" : "Editar"}
                        style={{ width: "20px", height: "20px" }}
                    />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LocalidadModal;

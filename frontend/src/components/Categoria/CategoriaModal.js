import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import editIcon from '../../static/img/edit-button.png';
import saveIcon from '../../static/img/floppy-disk.png';

const CategoriaModal = ({ show, onHide, categoria, onCategoriaUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCategoria, setEditedCategoria] = useState({ ...categoria });

    useEffect(() => {
        if (categoria) {
            setEditedCategoria({ ...categoria });
        }
    }, [categoria]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCategoria({ ...editedCategoria, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await axios.patch(`http://localhost:8000/categorias/${categoria.idCategoria}`, editedCategoria);
            onCategoriaUpdated(response.data);
            setIsEditing(false);
            onHide();
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title>
                    {isEditing ? "Editar Categoría" : "Detalles de la Categoría"}
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
                                        value={editedCategoria.nombre || ""}
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
                                        value={editedCategoria.descripcion || ""}
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

export default CategoriaModal;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import editIcon from '../../static/img/edit-button.png';
import saveIcon from '../../static/img/floppy-disk.png';

const ProductoModal = ({ show, onHide, producto, onProductoUpdated }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedProducto, setEditedProducto] = useState({ ...producto });

    useEffect(() => {
        if (producto) {
            setEditedProducto({ ...producto });
        }
    }, [producto]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProducto({ ...editedProducto, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(`http://localhost:8000/productos/${producto.idProducto}`, editedProducto);
            onProductoUpdated(editedProducto);
            setIsEditing(false);
            onHide();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="producto-modal-title">
                    {isEditing ? "Editar Producto" : "Detalles del Producto"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
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
                                style={{ width: "20px", height: "20px" }} // Ajusta el tamaño si es necesario
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
                                        value={editedProducto.nombre || ""}
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
                                        value={editedProducto.descripcion || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="marca">
                                    <Form.Label>Marca</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="marca"
                                        value={editedProducto.marca || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="precio">
                                    <Form.Label>Precio</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="precio"
                                        value={editedProducto.precio || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="stock">
                                    <Form.Label>Stock</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={editedProducto.stock || ""}
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
            </Modal.Footer>
        </Modal>
    );
};

export default ProductoModal;
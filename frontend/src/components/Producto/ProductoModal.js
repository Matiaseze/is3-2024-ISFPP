import React from 'react';
import { Modal, Button, Container, Row, Col } from 'react-bootstrap';

const ProductoModal = ({ show, onHide, producto }) => {
    if (!producto) return null;

    return (
        <Modal show={show} onHide={onHide} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Detalles del Producto
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row>
                        <Row>
                        <Col xs={12} md={8}><strong>Nombre:</strong> {producto.nombre}</Col>
                        </Row>
                        <Row>
                        <Col xs={6} md={4}><strong>Marca:</strong> {producto.marca}</Col>
                        </Row>
                        <Row> 
                        <Col xs={6} md={4}><strong>Precio:</strong> ${producto.precio}</Col>
                        </Row>
                        <Row>
                        <Col xs={6} md={4}><strong>Stock:</strong> {producto.stock}</Col>
                        </Row>
                        <Row> 
                        <Col xs={6} md={4}><strong>Categoría:</strong> {producto.categoria}</Col>
                        </Row>
                    </Row>
                    <Row>
                        <Col xs={12}><strong>Descripción:</strong> {producto.descripcion}</Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductoModal;
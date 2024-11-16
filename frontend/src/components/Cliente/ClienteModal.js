import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import editIcon from '../../static/img/edit-button.png';
import saveIcon from '../../static/img/floppy-disk.png';

const ClienteModal = ({ show, onHide, cliente, onClienteUpdated }) => {
    const [localidad, setLocalidad]  = useState('');
    const [localidades, setLocalidades]  = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCliente, setEditedCliente] = useState({ ...cliente });


    useEffect(() => {
        if (cliente) {
            setEditedCliente({ ...cliente });
            setLocalidad(cliente.localidad); // Asigna la localidad actual del producto
        }
        const fetchLocalidades = async () => {
            try {
                const response = await axios.get('http://localhost:8000/localidades'); // Cambia la URL si es necesario
                setLocalidades(response.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchLocalidades();
    }, [cliente]);

    useEffect(() => {
        if (!show) {
            setIsEditing(false); // Salir del modo edición al cerrar el modal
        }
    }, [show]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCliente({ ...editedCliente, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const clienteActualizado = {
                ...editedCliente,
                localidad: localidad.find((l) => l.idLocalidad === localidad.idLocalidad),
                // categoria: editedProducto.categoria
            };
            console.log(clienteActualizado)
            await axios.put(`http://localhost:8000/clientes/${cliente.idCliente}`, clienteActualizado);
            onClienteUpdated(clienteActualizado);
            setIsEditing(false);
            onHide();
        } catch (error) {
            console.error("Error al actualizar el cliente:", error);
        }
    };

    return (
        <Modal show={show} onHide={onHide} aria-labelledby="cliente-modal-title">
            <Modal.Header closeButton>
                <Modal.Title id="cliente-modal-title">
                    {isEditing ? "Editar Cliente" : "Detalles del Cliente"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {error && <p className="text-danger">{error}</p>}
                    <Row>
                        <Col xs={12}>
                            <Form>
                                <Form.Group controlId="dni">
                                    <Form.Label>DNI</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="dni"
                                        value={editedCliente.dni || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                {/* <Form.Group controlId="formTipoDoc">
                                    <Form.Label>Tipo de Documento</Form.Label>
                                    <Form.Select 
                                        value={tipoDoc} 
                                        onChange={(e) => setTipoDoc(e.target.value)} 
                                        required
                                    >
                                        <option value="">Selecciona el tipo de documento</option>
                                        <option value="DNI">DNI</option>
                                        <option value="CUIL">CUIL</option>
                                        <option value="CUIT">CUIT</option>
                                    </Form.Select>
                                </Form.Group> */}
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={editedCliente.nombre || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="apellido">
                                    <Form.Label>Apellido</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="apellido"
                                        value={editedCliente.apellido || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="domicilio">
                                    <Form.Label>Domicilio</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="domicilio"
                                        value={editedCliente.domicilio || ""}
                                        onChange={handleInputChange}
                                        readOnly={!isEditing}
                                    />
                                </Form.Group>
                                <Form.Group controlId="idLocalidad">
                                    <Form.Label>Localidad</Form.Label>
                                    <Form.Select
                                        value={editedCliente.idLocalidad || ""}
                                        onChange={(e) =>
                                            setEditedCliente({
                                                ...editedCliente,
                                                idLocalidad: parseInt(e.target.value),
                                            })
                                        }
                                        disabled={!isEditing}
                                    >
                                        <option value="">Selecciona una localidad</option>
                                        {localidades.map((localidad) => (
                                            <option key={localidad.idLocalidad} value={localidad.idLocalidad}>
                                                {localidad.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
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
                    {isEditing ? "Guardar" : "Editar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ClienteModal;
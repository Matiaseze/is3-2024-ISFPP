import React, { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import axios from 'axios';

import editIcon from '../../static/img/edit-button.png';
import saveIcon from '../../static/img/floppy-disk.png';

const ProductoModal = ({ show, onHide, producto, onProductoUpdated }) => {
    const [marca, setMarca] = useState('');
    const [marcas, setMarcas] = useState([]);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProducto, setEditedProducto] = useState({ ...producto });


    useEffect(() => {
        if (producto) {
            setEditedProducto({ ...producto });
            setMarca(producto.marca); // Asigna la marca actual del producto
        }
        const fetchMarcas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/marcas'); // Cambia la URL si es necesario
                setMarcas(response.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchMarcas();
    }, [producto]);

    useEffect(() => {
        if (!show) {
            setIsEditing(false); // Salir del modo edición al cerrar el modal
        }
    }, [show]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProducto({ ...editedProducto, [name]: value });
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const productoActualizado = {
                ...editedProducto,
                marca: marcas.find((m) => m.idMarca === marca.idMarca),
                categoria: editedProducto.categoria
            };
            console.log(productoActualizado)
            await axios.put(`http://localhost:8000/productos/${producto.idProducto}`, productoActualizado);
            onProductoUpdated(productoActualizado);
            setIsEditing(false);
            onHide();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    const handleToggleBaja = async (producto) => {
        try {
            const response = await fetch(
                `http://localhost:8000/productos/${producto.idProducto}/${producto.baja ? "restablecer" : "baja"}`,
                {
                    method: producto.baja ? "PUT" : "DELETE",
                }
            );
            if (!response.ok) {
                throw new Error("Error al cambiar el estado del producto.");
            }
    
            // Actualiza el estado del producto tras la respuesta del backend
            const updatedProducto = { ...producto, baja: !producto.baja };
            onProductoUpdated(updatedProducto); // Callback para actualizar el estado en la lista
        } catch (error) {
            console.error(error);
            alert("No se pudo cambiar el estado del producto.");
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
                                    <Form.Select
                                        value={marca?.idMarca || ""}  // Asegura que el valor sea el id de la marca actual o una cadena vacía
                                        onChange={(e) => {
                                            const selectedMarca = marcas.find(m => m.idMarca === parseInt(e.target.value));
                                            setMarca(selectedMarca);  // Actualiza el estado `marca`
                                            setEditedProducto({ ...editedProducto, marca: selectedMarca });  // Actualiza `editedProducto` con el objeto de la nueva marca
                                        }}
                                        disabled={!isEditing}
                                    >
                                        <option value="">Selecciona una marca</option>
                                        {marcas.map((marcaItem, index) => (
                                            <option key={`${marcaItem.idMarca}-${index}`} value={marcaItem.idMarca}>
                                                {marcaItem.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
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
                <Button
                    variant={editedProducto.baja ? "success" : "danger"}
                    onClick={() => handleToggleBaja(producto)}
                    >
                        {producto?.baja ? "Rehabilitar Producto" : "Dar de Baja"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProductoModal;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ListGroup, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductoModal from './ProductoModal';

const ListarProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/productos');
                setProductos(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    const handleShowModal = (producto) => {
        setProductoSeleccionado(producto);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setProductoSeleccionado(null);
    };

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Lista de Productos</h1>
            <Row>
                {productos.map((producto) => (
                    <Col key={producto.idProducto} sm={12} md={6} lg={4} className="mb-4">
                        <Card style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Link href="#" onClick={() => handleShowModal(producto)}>
                                    {producto.nombre}
                                </Card.Link>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item><strong>Precio:</strong> ${producto.precio}</ListGroup.Item>
                                <ListGroup.Item><strong>Stock:</strong> {producto.stock}</ListGroup.Item>
                            </ListGroup>
                            <Card.Body>
                                <Card.Link href="#">Añadir al carrito</Card.Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal para detalles del producto */}
            <ProductoModal 
                show={showModal} 
                onHide={handleCloseModal} 
                producto={productoSeleccionado} 
            />
        </Container>
    );
};

export default ListarProductos;



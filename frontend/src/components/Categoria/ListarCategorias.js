import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Alert } from 'react-bootstrap';
import CategoriaModal from './CategoriaModal';

const ListarCategorias = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState(null);  // Nuevo estado para el mensaje de eliminación

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8000/categorias/');
                setCategorias(response.data);
            } catch (err) {
                setError("Error al cargar categorías");
            } finally {
                setLoading(false);
            }
        };
        fetchCategorias();
    }, []);

    const handleShowModal = (categoria) => {
        setSelectedCategoria(categoria);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCategoria(null);
    };

    const handleCategoriaUpdated = (updatedCategoria) => {
        setCategorias((prevCategorias) =>
            prevCategorias.map((cat) =>
                cat.idCategoria === updatedCategoria.idCategoria ? updatedCategoria : cat
            )
        );
        setShowModal(false);
    };

    const handleDeleteClick = async (idCategoria) => {
        try {
            await axios.delete(`http://localhost:8000/categorias/${idCategoria}`);
            setCategorias((prevCategorias) =>
                prevCategorias.filter((cat) => cat.idCategoria !== idCategoria)
            );
            setDeleteMessage("La categoría ha sido eliminada exitosamente.");  // Mensaje de confirmación
            setTimeout(() => setDeleteMessage(null), 3000);  // Oculta el mensaje después de 3 segundos
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
        }
    };

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1>Listado de Categorías</h1>

            {/* Muestra el mensaje de eliminación si existe */}
            {deleteMessage && <Alert variant="success">{deleteMessage}</Alert>}

            {categorias.map((categoria) => (
                <Card key={categoria.idCategoria} className="mb-3">
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <Card.Title>{categoria.nombre}</Card.Title>
                            <Card.Text>
                                <strong>Descripción:</strong> {categoria.descripcion || "Sin descripción"}
                            </Card.Text>
                        </div>
                        <div>
                            <Button variant="info" onClick={() => handleShowModal(categoria)} className="me-2">
                                Editar
                            </Button>
                            <Button variant="danger" onClick={() => handleDeleteClick(categoria.idCategoria)}>
                                Eliminar
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}
            {selectedCategoria && (
                <CategoriaModal 
                    show={showModal} 
                    onHide={handleCloseModal} 
                    categoria={selectedCategoria} 
                    onCategoriaUpdated={handleCategoriaUpdated} 
                />
            )}
        </Container>
    );
};

export default ListarCategorias;

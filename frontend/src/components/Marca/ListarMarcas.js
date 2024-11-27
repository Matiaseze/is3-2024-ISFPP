import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

import MarcaModal from './MarcaModal'; // Renombrado de ProductoModal a MarcaModal
import FiltroMarcas from './FiltroMarcas'; // Importar el componente de filtro (FiltroProductos adaptado para marcas)

const ListarMarcas = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [marcas, setMarcas] = useState([]);
    const [filteredMarcas, setFilteredMarcas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedMarca, setSelectedMarca] = useState(null);

    // Filtros
    const [nombreFilter, setNombreFilter] = useState('');

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/marcas/');
                setMarcas(response.data);
                setFilteredMarcas(response.data);
            } catch (err) {
                setError("Error al cargar marcas");
            } finally {
                setLoading(false);
            }
        };

        fetchMarcas();
    }, []);

    useEffect(() => {
        const filterMarcas = () => {
            let tempMarcas = [...marcas];

            // Filtrar por nombre
            if (nombreFilter) {
                tempMarcas = tempMarcas.filter(marca => 
                    marca.nombre.toLowerCase().includes(nombreFilter.toLowerCase())
                );
            }

            setFilteredMarcas(tempMarcas);
        };

        filterMarcas();
    }, [nombreFilter, marcas]);

    const handleShowModal = (marca) => {
        setSelectedMarca(marca);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMarca(null);
    };

    // Actualiza la lista de marcas cuando se guarda una edición
    const handleMarcaUpdated = (updatedMarca) => {
        setMarcas((prevMarcas) =>
            prevMarcas.map((m) =>
                m.idMarca === updatedMarca.idMarca ? updatedMarca : m
            )
        );
        setShowModal(false);
    };

    if (loading) return <p>Cargando marcas...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1>Listar Marcas</h1>
            {/* Usar el componente de filtro */}
            <FiltroMarcas 
                nombreFilter={nombreFilter} 
                setNombreFilter={setNombreFilter}
            />
            <Row>
                {filteredMarcas.map(marca => (
                    <Col key={marca.idMarca} sm={12} md={6} lg={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{marca.nombre}</Card.Title>
                                <Card.Text>
                                    <strong>Descripción:</strong> {marca.descripcion || 'Sin descripción'}
                                </Card.Text>
                                <Button variant="info" onClick={() => handleShowModal(marca)}>
                                    Ver Detalles
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <MarcaModal 
                show={showModal} 
                onHide={handleCloseModal} 
                marca={selectedMarca} 
                onMarcaUpdated={handleMarcaUpdated} 
            />
        </Container>
    );
};

export default ListarMarcas;

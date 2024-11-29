import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const FiltroPedidos = ({ filtros, setFiltros }) => {
    const [estadosPedido, setEstadosPedido] = useState([]);

    // Obtener los estados del pedido desde el backend
    useEffect(() => {
        const fetchEstadosPedido = async () => {
            try {
                const response = await axios.get('http://localhost:8000/pedidos/estados_pedido');
                setEstadosPedido(response.data);
            } catch (error) {
                console.error('Error al obtener los estados del pedido:', error);
            }
        };

        fetchEstadosPedido();
    }, []);

    const manejarCambioFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value }); // Actualiza directamente los filtros
    };

    return (
        <Form className="mb-4">
            <Row>
                <Col md={3}>
                    <Form.Label>Fecha Inicio</Form.Label>
                    <Form.Control
                        type="date"
                        name="fechaInicio"
                        value={filtros.fechaInicio || ''}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Fecha Fin</Form.Label>
                    <Form.Control
                        type="date"
                        name="fechaFin"
                        value={filtros.fechaFin || ''}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control
                        type="text"
                        name="cliente"
                        placeholder="Nombre o Apellido"
                        value={filtros.cliente || ''}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                        name="estado"
                        value={filtros.estado || ''}
                        onChange={manejarCambioFiltro}
                    >
                        <option value="">Todos</option>
                        {estadosPedido.map((estado, index) => (
                            <option key={index} value={estado}>
                                {estado}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col md={3}>
                    <Form.Label>Monto Total Mínimo</Form.Label>
                    <Form.Control
                        type="number"
                        name="montoMin"
                        value={filtros.montoMin || ''}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col md={3}>
                    <Form.Label>Monto Total Máximo</Form.Label>
                    <Form.Control
                        type="number"
                        name="montoMax"
                        value={filtros.montoMax || ''}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default FiltroPedidos;

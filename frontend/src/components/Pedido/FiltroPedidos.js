import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const FiltroPedidos = ({ onFilter }) => {
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [cliente, setCliente] = useState('');
    const [estado, setEstado] = useState('');
    const [montoMin, setMontoMin] = useState('');
    const [montoMax, setMontoMax] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ fechaInicio, fechaFin, cliente, estado, montoMin, montoMax });
    };

    return (
        <Form onSubmit={handleSubmit} className="mb-3">
            <Form.Group controlId="fechaInicio">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control 
                    type="date" 
                    value={fechaInicio} 
                    onChange={(e) => setFechaInicio(e.target.value)} 
                />
            </Form.Group>

            <Form.Group controlId="fechaFin">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control 
                    type="date" 
                    value={fechaFin} 
                    onChange={(e) => setFechaFin(e.target.value)} 
                />
            </Form.Group>

            <Form.Group controlId="cliente">
                <Form.Label>Cliente</Form.Label>
                <Form.Control 
                    type="text" 
                    placeholder="Nombre del cliente" 
                    value={cliente} 
                    onChange={(e) => setCliente(e.target.value)} 
                />
            </Form.Group>

            <Form.Group controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Control 
                    as="select" 
                    value={estado} 
                    onChange={(e) => setEstado(e.target.value)} 
                >
                    <option value="">Seleccione</option>
                    <option value="true">Cancelado</option>
                    <option value="false">No Cancelado</option>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId="montoMin">
                <Form.Label>Monto Total Mínimo</Form.Label>
                <Form.Control 
                    type="number" 
                    value={montoMin} 
                    onChange={(e) => setMontoMin(e.target.value)} 
                />
            </Form.Group>

            <Form.Group controlId="montoMax">
                <Form.Label>Monto Total Máximo</Form.Label>
                <Form.Control 
                    type="number" 
                    value={montoMax} 
                    onChange={(e) => setMontoMax(e.target.value)} 
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Filtrar
            </Button>
        </Form>
    );
};

export default FiltroPedidos
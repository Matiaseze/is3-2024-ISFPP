import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const FiltroPagos = ({ filtros, setFiltros, mediosDePago }) => {
    const manejarCambioFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros({ ...filtros, [name]: value }); // Actualiza directamente los filtros
    };

    return (
        <Form className="mb-4">
            <Row>
                <Col>
                    <Form.Label>Fecha Inicio</Form.Label>
                    <Form.Control
                        type="date"
                        name="fechaInicio"
                        value={filtros.fechaInicio}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col>
                    <Form.Label>Fecha Fin</Form.Label>
                    <Form.Control
                        type="date"
                        name="fechaFin"
                        value={filtros.fechaFin}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col>
                    <Form.Label>Cliente</Form.Label>
                    <Form.Control
                        type="text"
                        name="cliente"
                        placeholder="Nombre o Apellido"
                        value={filtros.cliente}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label>Monto Abonado Mínimo</Form.Label>
                    <Form.Control
                        type="number"
                        name="montoAbonadoMin"
                        value={filtros.montoAbonadoMin}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col>
                    <Form.Label>Monto Abonado Máximo</Form.Label>
                    <Form.Control
                        type="number"
                        name="montoAbonadoMax"
                        value={filtros.montoAbonadoMax}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
                <Col>
                    <Form.Label>Medio de Pago</Form.Label>
                    <Form.Select
                        name="medioDePago"
                        value={filtros.medioDePago}
                        onChange={manejarCambioFiltro}
                    >
                        <option value="">Todos</option>
                        {mediosDePago.map((medio, index) => (
                            <option key={index} value={medio}>
                                {medio}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col>
                    <Form.Label>Nro. de Pedido</Form.Label>
                    <Form.Control
                        type="number"
                        name="idPedido"
                        placeholder="ID Pedido"
                        value={filtros.idPedido}
                        onChange={manejarCambioFiltro}
                    />
                </Col>
            </Row>
        </Form>
    );
};

export default FiltroPagos;

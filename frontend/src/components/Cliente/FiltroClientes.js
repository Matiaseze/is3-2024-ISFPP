import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const FiltroClientes = ({ 
    documentoFilter, setDocumentoFilter,
    nombreFilter, setNombreFilter,
    apellidoFilter, setApellidoFilter,
    localidadFilter, setLocalidadFilter,
    localidadesDisponibles // Recibir localidades como prop
}) => {
    return (
        <Form>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="documentoFilter">
                        <Form.Label>Documento</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Buscar por documento" 
                            value={documentoFilter} 
                            onChange={e => setDocumentoFilter(e.target.value)} 
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="nombreFilter">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Buscar por nombre" 
                            value={nombreFilter} 
                            onChange={e => setNombreFilter(e.target.value)} 
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="apellidoFilter">
                        <Form.Label>Apellido</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Buscar por apellido" 
                            value={apellidoFilter} 
                            onChange={e => setApellidoFilter(e.target.value)} 
                        />
                    </Form.Group>
                </Col>
                {/* <Col>
                    <Form.Group controlId="localidadFilter">
                        <Form.Label>Localidad</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={localidadFilter} 
                            onChange={e => setLocalidadFilter(e.target.value)} 
                        >
                            <option value="">Todas</option>
                            {[
                                ...new Set(localidadesDisponibles.map(localidad => localidad.nombre))
                            ].map((localidad, index) => (
                                <option key={`${localidad.idLocalidad}-${index}`} value={localidad}>
                                    {localidad}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col> */}
                <Col>
                    <Form.Group controlId="localidadFilter">
                        <Form.Label>Localidad</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={localidadFilter} 
                            onChange={e => setLocalidadFilter(e.target.value)} 
                        >
                            <option value="">Todas</option>
                            {localidadesDisponibles.map((localidad, index) => (
                                <option key={index} value={localidad}>
                                    {localidad}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default FiltroClientes;
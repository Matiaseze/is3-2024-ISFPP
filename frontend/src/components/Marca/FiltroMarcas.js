import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const FiltroMarcas = ({ 
    nombreFilter, setNombreFilter,
}) => {
    return (
        <Form>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="nombreFilter">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Buscar por nombre de marca" 
                            value={nombreFilter} 
                            onChange={e => setNombreFilter(e.target.value)} 
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default FiltroMarcas;

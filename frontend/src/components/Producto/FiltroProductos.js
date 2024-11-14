import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const FiltroProductos = ({ 
    nombreFilter, setNombreFilter,
    marcaFilter, setMarcaFilter,
    categoriaFilter, setCategoriaFilter,
    precioMin, setPrecioMin,
    precioMax, setPrecioMax,
    marcasDisponibles, categoriasDisponibles 
}) => {
    return (
        <Form>
            <Row className="mb-3">
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
                    <Form.Group controlId="marcaFilter">
                        <Form.Label>Marca</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={marcaFilter} 
                            onChange={e => setMarcaFilter(e.target.value)} 
                        >
                            <option value="">Todas</option>
                            {[
                                ...new Set(marcasDisponibles.map(marca => marca.nombre))
                            ].map((marca, index) => (
                                <option key={`${marca.idMarca}-${index}`} value={marca}>
                                    {marca}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="categoriaFilter">
                        <Form.Label>Categoría</Form.Label>
                        <Form.Control 
                            as="select" 
                            value={categoriaFilter} 
                            onChange={e => setCategoriaFilter(e.target.value)} 
                        >
                            <option value="">Todas</option>
                            {[
                                ...new Set(categoriasDisponibles.map(categoria => categoria.nombre))
                            ].map((categoria, index) => (
                                <option key={`${categoria}-${index}`} value={categoria}>
                                    {categoria}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="precioMin">
                        <Form.Label>Precio Mínimo</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Precio mínimo" 
                            value={precioMin} 
                            onChange={e => setPrecioMin(e.target.value)} 
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="precioMax">
                        <Form.Label>Precio Máximo</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="Precio máximo" 
                            value={precioMax} 
                            onChange={e => setPrecioMax(e.target.value)} 
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
};

export default FiltroProductos;
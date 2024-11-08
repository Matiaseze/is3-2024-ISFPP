import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AltaCategoria = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaCategoria = { nombre, descripcion };

        try {
            const response = await axios.post('http://localhost:8000/categorias/registrar', nuevaCategoria);
            if (response.status === 200) {
                setSuccess(true);
                setError(null);
                setNombre('');
                setDescripcion('');
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Error al registrar la categoría:", err.response);
            setError(err.response?.data?.detail || "Error desconocido");
            setSuccess(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Crear categoría</h1>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">¡Categoría agregada con éxito!</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el nombre de la categoría" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formDescripcion" className="mt-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Ingrese la descripción de la categoría" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Agregar Categoría
                </Button>
            </Form>
        </Container>
    );
};

export default AltaCategoria;

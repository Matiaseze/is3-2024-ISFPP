import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AltaMarca = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaMarca = { nombre, descripcion };

        try {
            const response = await axios.post('http://localhost:8000/marcas/registrar', nuevaMarca);
            if (response.status === 201) {
                setSuccess(true);
                setError(null);
                setNombre('');
                setDescripcion('');

                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                alert("¡La marca se añadió con éxito!");
            }
        } catch (err) {
            console.error("Error de solicitud:", err.response);
            setError(err.response?.data?.detail || "Error desconocido");
            setSuccess(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Alta de Marca</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el nombre de la marca" 
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
                        placeholder="Ingrese la descripción de la marca" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Agregar Marca
                </Button>

                {error && <p className="text-danger mt-3">{error}</p>}
                {success && <p className="text-success mt-3">¡Marca añadida con éxito!</p>}
            </Form>
        </Container>
    );
};

export default AltaMarca;

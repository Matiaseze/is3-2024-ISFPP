import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AltaLocalidad = () => {
    const [codPostal, setCodPostal] = useState('');
    const [nombre, setNombre] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nuevaLocalidad = { codPostal, nombre };

        try {
            const response = await axios.post('http://localhost:8000/localidades/registrar', nuevaLocalidad);
            if (response.status === 200) {
                setSuccess(true);
                setError(null);
                setCodPostal('');
                setNombre('');
                setTimeout(() => setSuccess(false), 3000);
            }
        } catch (err) {
            console.error("Error al registrar la localidad:", err.response);
            setError(err.response?.data?.detail || "Error desconocido");
            setSuccess(false);
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Crear localidad</h1>
            {error && <p className="text-danger">{error}</p>}
            {success && <p className="text-success">¡Localidad agregada con éxito!</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCodPostal" className="mt-3">
                    <Form.Label>CodPostal</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Ingrese el codigo postal de la localidad" 
                        value={codPostal} 
                        onChange={(e) => setCodPostal(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el nombre de la localidad" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Agregar Localidad
                </Button>
            </Form>
        </Container>
    );
};

export default AltaLocalidad;

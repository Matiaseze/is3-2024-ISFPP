import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const AltaCliente = () => {
    const [documento, setDocumento] = useState('');
    const [tipoDoc, setTipoDoc] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [domicilio, setDomicilio] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [localidades, setLocalidades] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crea el objeto completo para marca y categoría
        const localidadCompleta = {
            nombre: localidad.nombre, // Ajusta según el valor de marca
            codPostal: localidad.codPostal,
            idLocalidad: localidad.idLocalidad,
            baja: localidad.baja || false
        };

        // La base requiere SI O SI que le manden el tipo de dato correcto!
        const nuevoCliente = { 
            documento, 
            tipoDoc, 
            nombre, 
            apellido,
            domicilio, 
            localidad: localidadCompleta
            // idLocalidad: localidad.idLocalidad
        };
    
        try {
            const response = await axios.post('http://localhost:8000/clientes/registrar', nuevoCliente);
            if (response.status === 201) {
                setSuccess(true);
                setError(null);
                setDocumento('');
                setTipoDoc('');
                setNombre('');
                setApellido('');
                setDomicilio('');
                setLocalidad('');

                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                alert("¡El cliente se añadió con éxito!")
            }
        } catch (err) {
            //logs por si algo falla
            alert(error)
            console.error("Error de solicitud:", err.response);
            setError(err.response.data.detail || "Error desconocido");
            setSuccess(false);
        }
    };

    useEffect(() => {
        const fetchLocalidades = async () => {
            try {
                const response = await axios.get('http://localhost:8000/localidades'); // Cambia la URL si es necesario
                setLocalidades(response.data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchLocalidades();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Alta de Cliente</h1>

            {success && <Alert variant="success">¡Cliente registrado con éxito!</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formDocumento">
                    <Form.Label>Documento</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el documento del cliente" 
                        value={documento} 
                        onChange={(e) => setDocumento(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formTipoDoc" className="mt-3">
                    <Form.Label>TipoDoc</Form.Label>
                    <Form.Select 
                        value={tipoDoc} 
                        onChange={(e) => setTipoDoc(e.target.value)} 
                        required
                    >
                        <option value="">Selecciona el tipo de documento</option>
                        <option value="DNI">DNI</option>
                        <option value="CUIL">CUIL</option>
                        <option value="CUIT">CUIT</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formNombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el nombre del producto" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formApellido" className="mt-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el apellido del cliente" 
                        value={apellido} 
                        onChange={(e) => setApellido(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formDomicilio" className="mt-3">
                    <Form.Label>Domicilio</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Ingrese el domicilio del cliente" 
                        value={domicilio} 
                        onChange={(e) => setDomicilio(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formLocalidad">
                    <Form.Label>Localidad</Form.Label>
                    <Form.Select 
                        value={localidad?.idLocalidad || ""}
                        onChange={(e) => {
                            const selectedLocalidad = localidades.find(loc => loc.idLocalidad === parseInt(e.target.value));
                            setLocalidad(selectedLocalidad);
                        }}
                    >
                        <option value="">Selecciona una localidad</option>
                        {localidades.map((loc) => (
                            <option key={loc.idLocalidad} value={loc.idLocalidad}>{loc.nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Agregar Cliente
                </Button>
            </Form>
        </Container>
    );
};

export default AltaCliente;

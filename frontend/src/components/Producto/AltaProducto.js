import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AltaProducto = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [idMarca, setMarca] = useState('');
    const [marcas, setMarcas] = useState([]);
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // La base requiere SI O SI que le manden el tipo de dato correcto!
        const nuevoProducto = { 
            nombre, 
            descripcion, 
            idMarca, 
            precio: parseFloat(precio),
            stock: parseInt(stock), 
            categoria 
        };
    
        try {
            console.log(nuevoProducto)
            const response = await axios.post('http://localhost:8000/productos/registrar', nuevoProducto);
            if (response.status === 201) {
                setSuccess(true);
                setError(null);
                setNombre('');
                setDescripcion('');
                setMarca('');
                setPrecio('');
                setStock('');
                setCategoria('');

                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
                alert("¡El producto se añadió con éxito!")
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
        const fetchCategorias = async () => {
            try {
                const response = await axios.get('http://localhost:8000/categorias'); // Cambia la URL si es necesario
                setCategorias(response.data);
            } catch (err) {
                setError(err.message);
            }
        };
        const fetchMarcas = async () => {
            try {
                const response = await axios.get('http://localhost:8000/marcas'); // Cambia la URL si es necesario
                setMarcas(response.data);
            } catch (err) {
                setError(err.message);
            }
        }; 
        fetchMarcas();
        fetchCategorias();
    }, []);

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">Alta de Producto</h1>
            <Form onSubmit={handleSubmit}>
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

                <Form.Group controlId="formDescripcion" className="mt-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Ingrese la descripción del producto" 
                        value={descripcion} 
                        onChange={(e) => setDescripcion(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formMarca">
                    <Form.Label>Marca</Form.Label>
                    <Form.Select 
                        value={idMarca}
                        onChange={(e) => setMarca(e.target.value)}
                    >
                        <option value="">Selecciona una marca</option>
                        {marcas.map((cat, index) => (
                            <option key={index} value={cat.idMarca}>{cat.nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formPrecio" className="mt-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Ingrese el precio del producto" 
                        value={precio} 
                        onChange={(e) => setPrecio(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formStock" className="mt-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control 
                        type="number" 
                        placeholder="Ingrese la cantidad en stock" 
                        value={stock} 
                        onChange={(e) => setStock(e.target.value)} 
                        required 
                    />
                </Form.Group>

                <Form.Group controlId="formCategoria">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select 
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value)}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4">
                    Agregar Producto
                </Button>
            </Form>
        </Container>
    );
};

export default AltaProducto;

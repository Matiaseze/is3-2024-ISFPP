import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';

const AltaProducto = () => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [marca, setMarca] = useState('');
    const [marcas, setMarcas] = useState([]);
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [categoria, setCategoria] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Crea el objeto completo para marca y categoría
        const marcaCompleta = {
            nombre: marca.nombre, // Ajusta según el valor de marca
            descripcion: marca.descripcion,
            idMarca: marca.idMarca,
            baja: marca.baja || false
        };

        const categoriaCompleta = {
            nombre: categoria.nombre,
            descripcion: categoria.descripcion,
            idCategoria: categoria.idCategoria,
            baja: categoria.baja || false
        };

        // Crea nuevoProducto asegurando el formato correcto
        const nuevoProducto = {
            nombre,
            descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock),
            marca: marcaCompleta,
            categoria: categoriaCompleta
        };
        try {
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
            console.error("Error de solicitud:", err);
            if (err.response) {
                setError(err.response.data.detail || "Error desconocido en el servidor");
            } else {
                setError("No se pudo conectar al servidor.");
            }
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
                        value={marca?.idMarca || ""}
                        onChange={(e) => {
                            const selectedMarca = marcas.find(marcaItem => marcaItem.idMarca === parseInt(e.target.value));
                            setMarca(selectedMarca);
                        }}
                    >
                        <option value="">Selecciona una marca</option>
                        {marcas.map((marcaItem) => (
                            <option key={marcaItem.idMarca} value={marcaItem.idMarca}>{marcaItem.nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group controlId="formPrecio" className="mt-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Ingrese el precio del producto"
                        value={precio}
                        onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            setPrecio(value >= 0 ? value : 0);
                        }}
                        required
                        min="0"
                    />
                </Form.Group>

                <Form.Group controlId="formStock" className="mt-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Ingrese la cantidad en stock"
                        value={stock}
                        onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            setStock(value >= 0 ? value : 0);  // Permite solo valores mayores o iguales a 0
                        }}
                        required
                        min="0" // Esto previene valores negativos en navegadores que lo soportan
                    />
                </Form.Group>
                <Form.Group controlId="formCategoria">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                        value={categoria?.idCategoria || ""}
                        onChange={(e) => {
                            const selectedCategoria = categorias.find(categoriaItem => categoriaItem.idCategoria === parseInt(e.target.value));
                            setCategoria(selectedCategoria);
                        }}
                    >
                        <option value="">Selecciona una categoría</option>
                        {categorias.map((categoriaItem) => (
                            <option key={categoriaItem.idCategoria} value={categoriaItem.idCategoria}>{categoriaItem.nombre}</option>
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

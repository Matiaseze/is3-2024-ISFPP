import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { ListarProductos, AltaProducto } from './components/Producto';

const App = () => {
    // Estado para manejar el carrito
    const [carrito, setCarrito] = useState([]);

    // Función para agregar un producto al carrito
    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => [...prevCarrito, producto]);
    };

    return (
        <Router>
            <Navbar carrito={carrito} setCarrito={setCarrito} />
            <Routes>
                <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
                <Route path="/productos" element={<ListarProductos agregarAlCarrito={agregarAlCarrito} />} />
                <Route path="/productos/registrar" element={<AltaProducto />} />
            </Routes>
        </Router>
    );
};

export default App;
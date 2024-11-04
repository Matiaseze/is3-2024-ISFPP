import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { ListarProductos, AltaProducto } from './components/Producto';
import { ListarPedidos } from './components/Pedido';

const App = () => {

    const [carrito, setCarrito] = useState([]);
    const [vistaActual, setVistaActual] = useState('');
    
    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => [...prevCarrito, producto]);
    };

    return (
        <Router>
            <Navbar carrito={carrito} setCarrito={setCarrito} vistaActual={vistaActual} />
            <Routes>
                <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
                <Route path="/productos" element={<ListarProductos agregarAlCarrito={agregarAlCarrito} setVistaActual={setVistaActual} />} />
                <Route path="/productos/registrar" element={<AltaProducto setVistaActual={setVistaActual} />} />
                <Route path="/pedidos" element={<ListarPedidos setVistaActual={setVistaActual} />} />
            </Routes>
        </Router>
    );
};

export default App;
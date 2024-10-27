import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { ListarProductos, AltaProducto } from './components/Producto';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<ListarProductos />} />
                <Route path="/productos/registrar" element={<AltaProducto />} />
            </Routes>
        </Router>
    );
};

export default App;
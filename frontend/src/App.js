import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { ListarProductos, AltaProducto } from './components/Producto';
import { ListarCategorias, AltaCategoria } from './components/Categoria';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/productos" element={<ListarProductos />} />
                <Route path="/productos/registrar" element={<AltaProducto />} />
                <Route path="/categorias/" element={<ListarCategorias />} />
                <Route path="/categorias/registrar" element={<AltaCategoria />} />
            </Routes>
        </Router>
    );
};

export default App;
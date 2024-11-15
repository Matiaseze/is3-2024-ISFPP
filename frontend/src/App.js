import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import { AltaCliente } from './components/Cliente';
import { ListarProductos, AltaProducto } from './components/Producto';
import { ListarPedidos } from './components/Pedido';
import { ListarCategorias, AltaCategoria } from './components/Categoria';
import { AltaMarca, ListarMarcas } from './components/Marca'
import { ListarLocalidades, AltaLocalidad } from './components/Localidad';

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
                {/* <Route path="/clientes/" element={<ListarClientes />} /> */}
                <Route path="/clientes/registrar" element={<AltaCliente />} />
                <Route path="/productos" element={<ListarProductos agregarAlCarrito={agregarAlCarrito} setVistaActual={setVistaActual} />} />
                <Route path="/productos/registrar" element={<AltaProducto setVistaActual={setVistaActual} />} />
                <Route path="/pedidos" element={<ListarPedidos setVistaActual={setVistaActual} />} />
                {/* <Route path="/" element={<Home />} />
                <Route path="/productos" element={<ListarProductos />} />
                <Route path="/productos/registrar" element={<AltaProducto />} /> */}
                <Route path="/categorias/" element={<ListarCategorias />} />
                <Route path="/categorias/registrar" element={<AltaCategoria />} />
                <Route path="/marcas/registrar" element={<AltaMarca setVistaActual={setVistaActual} />} />
                <Route path="/marcas" element={<ListarMarcas agregarAlCarrito={agregarAlCarrito} setVistaActual={setVistaActual} />} />
                <Route path="/localidades/" element={<ListarLocalidades />} />
                <Route path="/localidades/registrar" element={<AltaLocalidad />} />
            </Routes>
        </Router>
    );
};

export default App;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import FiltroPedidos from './FiltroPedidos';

const ListarPedidos = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [detallesPedido, setDetallesPedido] = useState(null);
    const [selectedPedidoId, setSelectedPedidoId] = useState(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/pedidos'); // Ajusta la URL según sea necesario
                console.log(response.data)
                setPedidos(response.data);
                setPedidosFiltrados(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los pedidos:", error);
                setError("Error al obtener los pedidos");
                setLoading(false);
            }
        };

        fetchPedidos();
    }, []);

    const cancelarPedido = async (idPedido) => {
        try {
            await axios.delete(`http://localhost:8000/pedidos/${idPedido}/cancelar`);
            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.idPedido === idPedido ? { ...pedido, cancelado: true } : pedido
                )
            );
        } catch (err) {
            setError("Error al cancelar el pedido");
        }
    };

    const handleFilter = (filters) => {
        let filtered = pedidos;

        if (filters.fechaInicio) {
            filtered = filtered.filter(pedido => new Date(pedido.fechaPedido) >= new Date(filters.fechaInicio));
        }
        if (filters.fechaFin) {
            filtered = filtered.filter(pedido => new Date(pedido.fechaPedido) <= new Date(filters.fechaFin));
        }
        if (filters.cliente) {
            filtered = filtered.filter(pedido => pedido.nombreCliente.toLowerCase().includes(filters.cliente.toLowerCase()));
        }
        if (filters.estado !== '') {
            filtered = filtered.filter(pedido => pedido.estado.toString() === filters.estado);
        }
        if (filters.montoMin) {
            filtered = filtered.filter(pedido => pedido.montoTotal >= parseFloat(filters.montoMin));
        }
        if (filters.montoMax) {
            filtered = filtered.filter(pedido => pedido.montoTotal <= parseFloat(filters.montoMax));
        }

        setPedidosFiltrados(filtered);
    };

    const handleShowModal = async (idPedido) => {
        setSelectedPedidoId(idPedido);
        try {
            const response = await axios.get(`http://localhost:8000/pedidos/${idPedido}/detalles`); // Ajusta la URL según sea necesario
            setDetallesPedido(response.data);
            setModalShow(true);
        } catch (error) {
            console.error("Error al obtener los detalles del pedido:", error);
            setError("Error al obtener los detalles del pedido");
        }
    };

    const handleCloseModal = () => {
        setModalShow(false);
        setDetallesPedido(null);
        setSelectedPedidoId(null);
    };

    if (loading) return <p>Cargando pedidos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1>Listado de Pedidos</h1>
            <FiltroPedidos onFilter={handleFilter} />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Activo</th>
                        <th>Monto Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosFiltrados.map((pedido) => (
                        <tr key={pedido.idPedido}>
                            <td>{pedido.idPedido}</td>
                            <td>{pedido.cliente.nombre} {pedido.cliente.apellido}</td>
                            <td>{new Date(pedido.fechaPedido).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</td>
                            <td>{pedido.estado}</td>
                            <td>{pedido.montoTotal}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowModal(pedido.idPedido)}>Detalles</Button>
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        if (window.confirm("¿DESEA CANCELAR ESTE PEDIDO?")) {
                                            cancelarPedido(pedido.idPedido);
                                        }
                                    }}
                                    disabled={pedido.estado === 'CANCELADO'}
                                >
                                    Cancelar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal para ver detalles del pedido */}
            <Modal show={modalShow} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Pedido {selectedPedidoId}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detallesPedido ? (
                        <div>
                            <h5>Detalles:</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detallesPedido.map(detalle => (
                                        <tr key={detalle.idDetalle}>
                                            <td>{detalle.producto.nombre}</td>
                                            <td>{detalle.cantidad}</td>
                                            <td>{detalle.precioUnitario}</td>
                                            <td>{(detalle.cantidad * detalle.precioUnitario).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : (
                        <p>Cargando detalles...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default ListarPedidos;
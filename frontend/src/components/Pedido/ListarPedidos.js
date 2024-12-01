import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal } from 'react-bootstrap';
import FiltroPedidos from './FiltroPedidos';
import { RegistrarPagoModal } from '../Pago/';

const ListarPedidos = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pedidos, setPedidos] = useState([]);
    const [pedidosFiltrados, setPedidosFiltrados] = useState([]);
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        cliente: '',
        estado: '',
        montoMin: '',
        montoMax: '',
    });

    const [modalShow, setModalShow] = useState(false);
    const [detallesPedido, setDetallesPedido] = useState(null);
    const [selectedPedidoId, setSelectedPedidoId] = useState(null);
    const [selectedClienteId, setSelectedClienteId] = useState(null);

    const [modalPagoShow, setModalPagoShow] = useState(false);
    const [selectedPedidoPagoId, setSelectedPedidoPagoId] = useState(null);

    // Cargar pedidos
    useEffect(() => {
        const fetchPedidos = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8000/pedidos');
                setPedidos(response.data);
                setPedidosFiltrados(response.data); // Inicialmente, todos los pedidos
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los pedidos:", error);
                setError("Error al obtener los pedidos");
                setLoading(false);
            }
        };

        fetchPedidos();
    }, []);

    // Aplicar filtros
    useEffect(() => {
        const aplicarFiltros = () => {
            let filtered = [...pedidos];

            if (filtros.fechaInicio) {
                filtered = filtered.filter(pedido => new Date(pedido.fechaPedido) >= new Date(filtros.fechaInicio));
            }
            if (filtros.fechaFin) {
                filtered = filtered.filter(pedido => new Date(pedido.fechaPedido) <= new Date(filtros.fechaFin));
            }
            if (filtros.cliente) {
                const clienteFiltro = filtros.cliente.toLowerCase();
                filtered = filtered.filter(
                    pedido =>
                        `${pedido.cliente.nombre} ${pedido.cliente.apellido}`.toLowerCase().includes(clienteFiltro)
                );
            }
            if (filtros.estado !== '') {
                filtered = filtered.filter(pedido => pedido.estado.toString() === filtros.estado);
            }
            if (filtros.montoMin) {
                filtered = filtered.filter(pedido => pedido.montoTotal >= parseFloat(filtros.montoMin));
            }
            if (filtros.montoMax) {
                filtered = filtered.filter(pedido => pedido.montoTotal <= parseFloat(filtros.montoMax));
            }

            setPedidosFiltrados(filtered);
        };

        aplicarFiltros();
    }, [filtros, pedidos]);

    // Función para cancelar pedido
    const cancelarPedido = async (idPedido) => {
        try {
            await axios.delete(`http://localhost:8000/pedidos/${idPedido}/cancelar`);
            setPedidos(prevPedidos =>
                prevPedidos.map(pedido =>
                    pedido.idPedido === idPedido ? { ...pedido, estado: 'CANCELADO' } : pedido
                )
            );
        } catch (err) {
            setError("Error al cancelar el pedido");
        }
    };

    // Mostrar detalles del pedido
    const handleShowModal = async (idPedido) => {
        setSelectedPedidoId(idPedido);
        try {
            const response = await axios.get(`http://localhost:8000/pedidos/${idPedido}/detalles`);
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

    // Mostrar modal de pago
    const handleShowPagoModal = (idPedido, idCliente) => {
        setSelectedPedidoPagoId(idPedido);
        setSelectedClienteId(idCliente);
        setModalPagoShow(true);
    };

    const handleClosePagoModal = () => {
        setModalPagoShow(false);
        setSelectedPedidoPagoId(null);
    };

    const actualizarPedidos = async () => {
        try {
            const response = await axios.get('http://localhost:8000/pedidos');
            setPedidos(response.data);
            setPedidosFiltrados(response.data);
        } catch (error) {
            console.error('Error al actualizar los pedidos:', error);
        }
    };

    if (loading) return <p>Cargando pedidos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <Container>
            <h1>Listado de Pedidos</h1>
            <FiltroPedidos filtros={filtros} setFiltros={setFiltros} />
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Monto Total</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidosFiltrados.map((pedido) => (
                        <tr key={pedido.idPedido}>
                            <td>{pedido.idPedido}</td>
                            <td>{pedido.cliente.nombre} {pedido.cliente.apellido}</td>
                            <td>{new Date(pedido.fechaPedido).toLocaleDateString('es-ES')}</td>
                            <td>{pedido.estado}</td>
                            <td>{pedido.montoTotal}</td>
                            <td>
                                <Button variant="info" onClick={() => handleShowModal(pedido.idPedido)}>Detalles</Button>
                                <Button
                                    variant="danger"
                                    onClick={() => cancelarPedido(pedido.idPedido)}
                                    disabled={pedido.estado === 'CANCELADO' || pedido.estado == 'PAGADO'}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="success"
                                    onClick={() => handleShowPagoModal(pedido.idPedido, pedido.cliente.idCliente)}
                                    disabled={pedido.estado === 'CANCELADO' || pedido.estado == 'PAGADO'}
                                >
                                    Pagar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <RegistrarPagoModal
                show={modalPagoShow}
                onHide={handleClosePagoModal}
                pedidoId={selectedPedidoPagoId}
                clienteId={selectedClienteId}
                onPagoRegistrado={actualizarPedidos}

            />
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Alert } from 'react-bootstrap';
import FiltroPagos from './FiltroPagos';
import PagoModal from './PagoModal';

const ListarPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [filtros, setFiltros] = useState({
        fechaInicio: '',
        fechaFin: '',
        cliente: '',
        montoAbonadoMin: '',
        montoAbonadoMax: '',
        medioDePago: '',
    });
    const [mediosDePago, setMediosDePago] = useState([]);
    const [pagosOriginales, setPagosOriginales] = useState([]);
    const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchPagos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/pagos');
                setPagos(response.data);
                setPagosOriginales(response.data); // Guardamos los datos originales para filtrar
            } catch (error) {
                console.error('Error al obtener los pagos:', error);
                setError('Error al obtener los pagos. Intenta nuevamente.');
            }
        };

        const fetchMediosDePago = async () => {
            try {
                const response = await axios.get('http://localhost:8000/pagos/medios_pago');
                setMediosDePago(response.data);
            } catch (error) {
                console.error('Error al obtener los medios de pago:', error);
                setError('Error al obtener los medios de pago. Intenta nuevamente.');
            }
        };

        fetchPagos();
        fetchMediosDePago();
    }, []);

    useEffect(() => {
        const aplicarFiltros = () => {
            let pagosFiltrados = [...pagosOriginales];

            // Filtrar por fecha
            if (filtros.fechaInicio) {
                pagosFiltrados = pagosFiltrados.filter(
                    (pago) => new Date(pago.fecha) >= new Date(filtros.fechaInicio)
                );
            }
            if (filtros.fechaFin) {
                pagosFiltrados = pagosFiltrados.filter(
                    (pago) => new Date(pago.fecha) <= new Date(filtros.fechaFin)
                );
            }

            // Filtrar por cliente
            if (filtros.cliente) {
                const clienteFiltro = filtros.cliente.toLowerCase();
                pagosFiltrados = pagosFiltrados.filter(
                    (pago) =>
                        pago.cliente &&
                        `${pago.cliente.nombre} ${pago.cliente.apellido}`
                            .toLowerCase()
                            .includes(clienteFiltro)
                );
            }

            // Filtrar por monto abonado
            if (filtros.montoAbonadoMin) {
                pagosFiltrados = pagosFiltrados.filter(
                    (pago) => pago.monto_abonado >= parseFloat(filtros.montoAbonadoMin)
                );
            }
            if (filtros.montoAbonadoMax) {
                pagosFiltrados = pagosFiltrados.filter(
                    (pago) => pago.monto_abonado <= parseFloat(filtros.montoAbonadoMax)
                );
            }

            // Filtrar por medio de pago
            if (filtros.medioDePago) {
                pagosFiltrados = pagosFiltrados.filter(
                    (pago) => pago.medio_de_pago === filtros.medioDePago
                );
            }

            // Filtrar por ID Pedido
            if (filtros.idPedido) {
                pagosFiltrados = pagosFiltrados.filter(
                    (pago) => pago.idPedido === parseInt(filtros.idPedido, 10)
                );
            }

            setPagos(pagosFiltrados);
        };

        aplicarFiltros(); // Llama a aplicarFiltros cuando cambian los filtros
    }, [filtros, pagosOriginales]); // Ejecuta el efecto cuando cambian los filtros o los datos originales

    const cancelarPago = async (idPago) => {
        const confirmacion = window.confirm('¿Desea eliminar el pago?');
        if (!confirmacion) return;

        try {
            await axios.delete(`http://localhost:8000/pagos/${idPago}/eliminar`);
            setPagos(pagos.filter((pago) => pago.idPago !== idPago));
        } catch (error) {
            console.error('Error al cancelar el pago:', error);
            setError(error.response?.data?.detail || 'Error al cancelar el pago. Intenta nuevamente.');
        }
    };

    const verDetalles = (pago) => {
        setPagoSeleccionado(pago);
        setMostrarDetalles(true);
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Pagos</h2>

            {/* Mostrar errores */}
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

            {/* Componente de Filtros */}
            <FiltroPagos filtros={filtros} setFiltros={setFiltros} mediosDePago={mediosDePago} />

            {/* Tabla de pagos */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>ID Pedido</th>
                        <th>Monto Total</th>
                        <th>Monto Abonado</th>
                        <th>Medio de Pago</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map((pago) => (
                        <tr key={pago.idPago}>
                            <td>{pago.idPago}</td>
                            <td>{`${pago.cliente.nombre} ${pago.cliente.apellido}`}</td>
                            <td>{pago.idPedido}</td>
                            <td>{pago.monto_total}</td>
                            <td>{pago.monto_abonado}</td>
                            <td>{pago.medio_de_pago}</td>
                            <td>{new Date(pago.fecha).toLocaleString()}</td>
                            <td>
                                <Button variant="info" className="me-2" onClick={() => verDetalles(pago)}>
                                    Ver Detalles
                                </Button>
                                <Button variant="danger" onClick={() => cancelarPago(pago.idPago)}>
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {mostrarDetalles && (
                <PagoModal pago={pagoSeleccionado} cerrarModal={() => setMostrarDetalles(false)} />
            )}
        </div>
    );
};

export default ListarPagos;

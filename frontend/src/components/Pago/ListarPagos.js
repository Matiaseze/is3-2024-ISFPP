import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal } from 'react-bootstrap';
import PagoModal from './PagoModal';

const ListarPagos = () => {
    const [pagos, setPagos] = useState([]);
    const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
    const [mostrarDetalles, setMostrarDetalles] = useState(false);

    useEffect(() => {
        // Cargar los pagos desde el backend
        const fetchPagos = async () => {
            try {
                const response = await axios.get('http://localhost:8000/pagos');
                setPagos(response.data);
            } catch (error) {
                console.error('Error al obtener los pagos:', error);
            }
        };

        fetchPagos();
    }, []);

    const cancelarPago = async (idPago) => {
        try {
            await axios.delete(`http://localhost:8000/pagos/${idPago}/eliminar`);
            setPagos(pagos.filter((pago) => pago.idPago !== idPago));
        } catch (error) {
            console.error('Error al cancelar el pago:', error);
        }
    };

    const verDetalles = (pago) => {
        setPagoSeleccionado(pago);
        setMostrarDetalles(true);
    };

    return (
        <div className="container mt-4">
            <h2>Gestión de Pagos</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Monto</th>
                        <th>Medio de Pago</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pagos.map((pago) => (
                        <tr key={pago.idPago}>
                            <td>{pago.idPago}</td>
                            <td>{pago.monto_abonado}</td>
                            <td>{pago.medio_de_pago}</td>
                            <td>{new Date(pago.fecha).toLocaleString()}</td>
                            <td>
                                <Button 
                                    variant="info" 
                                    className="me-2"
                                    onClick={() => verDetalles(pago)}
                                >
                                    Ver Detalles
                                </Button>
                                <Button 
                                    variant="danger" 
                                    onClick={() => cancelarPago(pago.idPago)}
                                >
                                    Cancelar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {mostrarDetalles && (
                <DetallesPago 
                    pago={pagoSeleccionado} 
                    cerrarModal={() => setMostrarDetalles(false)} 
                />
            )}
        </div>
    );
};

export default ListarPagos;
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DetallesPago = ({ pago, cerrarModal }) => {
    if (!pago) return null;

    return (
        <Modal show onHide={cerrarModal}>
            <Modal.Header closeButton>
                <Modal.Title>Detalles del Pago</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>ID:</strong> {pago.idPago}</p>
                <p><strong>Monto:</strong> {pago.monto_abonado}</p>
                <p><strong>Medio de Pago:</strong> {pago.medio_de_pago}</p>
                <p><strong>Fecha:</strong> {new Date(pago.fecha).toLocaleString()}</p>
                <p><strong>ID Cliente:</strong> {pago.idCliente}</p>
                <p><strong>ID Pedido:</strong> {pago.idPedido}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={cerrarModal}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DetallesPago;

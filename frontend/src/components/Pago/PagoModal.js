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
                <p><strong>Pago N°: </strong>{pago.idPago}</p>
                <p><strong>Monto: </strong>{pago.monto_abonado}</p>
                <p><strong>Medio de pago: </strong>{pago.medio_de_pago}</p>
                <p><strong>Fecha de pago: </strong>{new Date(pago.fecha).toLocaleString()}</p>
                <p><strong>Cliente: </strong>{`${pago.cliente.nombre} ${pago.cliente.apellido}`}</p>
                <p><strong>Pedido N°: </strong>{pago.idPedido}</p>
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

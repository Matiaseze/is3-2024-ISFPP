import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const RegistrarPagoModal = ({ show, onHide, pedidoId, onPagoRegistrado }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const pago = {
            monto: formData.get('monto'),
            metodo: formData.get('metodo'),
        };

        try {
            await axios.post(`http://localhost:8000/pagos/crear_pago/`, pago);
            alert('Pago registrado con éxito');
            onPagoRegistrado(); // Notifica al componente padre para actualizar la lista
            onHide(); // Cierra el modal
        } catch (error) {
            console.error('Error al registrar el pago:', error);
            alert('Error al registrar el pago');
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Registrar Pago para Pedido {pedidoId}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Monto</label>
                        <input type="number" name="monto" className="form-control" required />
                    </div>
                    <div className="form-group">
                        <label>Método de Pago</label>
                        <select name="metodo" className="form-control" required>
                            <option value="EFECTIVO">Efectivo</option>
                            <option value="TARJETA">Tarjeta</option>
                            <option value="TRANSFERENCIA">Transferencia</option>
                        </select>
                    </div>
                    <Button variant="primary" type="submit">Registrar</Button>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegistrarPagoModal;

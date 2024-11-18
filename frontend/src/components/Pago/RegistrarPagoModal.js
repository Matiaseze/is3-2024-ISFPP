import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const RegistrarPagoModal = ({ show, onHide, pedidoId, clienteId, onPagoRegistrado }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [medioDePago, setMediosDePago] = useState([]);

    useEffect(() => {
        setLoading(true);
        const fetchMediosDePago = async () => {
            try {
                const response = await axios.get('http://localhost:8000/pagos/medios_pago');
                setMediosDePago(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error al obtener los medios de pago:", error);
                setError("Error al obtener los medios de pago");
                setLoading(false);
            }
        };

        fetchMediosDePago();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const montoAbonado = parseFloat(formData.get('monto'));
        const medioDePago = formData.get('metodo');

        // Validaciones
        if (!montoAbonado || montoAbonado <= 0) {
            alert("Por favor, ingresa un monto válido.");
            return;
        }
        if (!medioDePago) {
            alert("Por favor, selecciona un método de pago.");
            return;
        }

        // Crear objeto de pago
        const pago = {
            monto_abonado: montoAbonado,
            medio_de_pago: medioDePago,
            idCliente: clienteId,
            idPedido: pedidoId,
            fecha: new Date().toISOString(), // Opcional, dejar que el backend genere si prefieres
    };

    try {
        console.log(pago)
        await axios.post(`http://localhost:8000/pagos/crear_pago`, pago);
        alert('Pago registrado con éxito');
        onPagoRegistrado(); // Notifica al componente padre para actualizar la lista
        onHide(); // Cierra el modal
    } catch (error) {
        console.error('Error al registrar el pago:', error);
        alert('Error al registrar el pago');
    }
};

if (loading) return <p>Cargando...</p>;
if (error) return <p>{error}</p>;

return (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Registrar Pago para Pedido {pedidoId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Monto</label>
                    <input
                        type="number"
                        name="monto"
                        className="form-control"
                        min="0.01"
                        step="0.01"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Método de Pago</label>
                    <select name="metodo" className="form-control" required>
                        <option value="">Seleccione un medio de pago</option>
                        {medioDePago.map((medio, index) => (
                            <option key={index} value={medio}>
                                {medio}
                            </option>
                        ))}
                    </select>
                </div>
                <Button variant="primary" type="submit">
                    Registrar
                </Button>
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Cerrar
            </Button>
        </Modal.Footer>
    </Modal>
);
};

export default RegistrarPagoModal;

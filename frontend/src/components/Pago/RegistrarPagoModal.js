import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const RegistrarPagoModal = ({ show, onHide, pedidoId, clienteId, onPagoRegistrado }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [medioDePago, setMediosDePago] = useState([]);
    const [saldoRestante, setSaldoRestante] = useState(0);
    const [pagarTotal, setPagarTotal] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
    
                // Obtener los métodos de pago
                const mediosResponse = await axios.get('http://localhost:8000/pagos/medios_pago');
                setMediosDePago(mediosResponse.data);
    
                // Obtener el saldo restante del pedido
                console.log('CALCULANDO SALDO RESTANTE')
                const saldoResponse = await axios.get(`http://localhost:8000/pedidos/${pedidoId}/saldo_restante`);
                const saldoRestante = saldoResponse.data;  // Es solo un número flotante
    
                setSaldoRestante(saldoRestante);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
                console.log(error)
                setError('Error al cargar los datos del pedido. Intenta nuevamente.');
                setLoading(false);
            }
        };
    
        if (pedidoId) fetchData();
    }, [pedidoId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const montoAbonado = pagarTotal ? saldoRestante : parseFloat(formData.get('monto'));
        const medioDePago = formData.get('metodo');

        // Validaciones
        if (!montoAbonado || montoAbonado <= 0) {
            alert('Por favor, ingresa un monto válido.');
            return;
        }
        if (!medioDePago) {
            alert('Por favor, selecciona un método de pago.');
            return;
        }

        // Crear objeto de pago
        const pago = {
            monto_abonado: montoAbonado,
            medio_de_pago: medioDePago,
            idCliente: clienteId,
            idPedido: pedidoId,
            fecha: new Date().toISOString(),
        };

        try {
            await axios.post(`http://localhost:8000/pagos/crear_pago`, pago);
            alert('Pago registrado con éxito');
            onPagoRegistrado(); // Notifica al componente padre para actualizar la lista
            onHide(); // Cierra el modal
        } catch (error) {
            console.error('Error al registrar el pago:', error);

            // Extraer y mostrar el mensaje de error del backend
            const errorMessage = error.response?.data?.detail || 'Ocurrió un error inesperado';
            alert(`Error al registrar el pago: ${errorMessage}`);
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
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Saldo Restante</Form.Label>
                        <Form.Control type="text" value={`$${saldoRestante.toFixed(2)}`} readOnly />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Pagar el total"
                            checked={pagarTotal}
                            onChange={(e) => setPagarTotal(e.target.checked)}
                        />
                    </Form.Group>

                    {!pagarTotal && (
                        <Form.Group className="mb-3">
                            <Form.Label>Monto</Form.Label>
                            <Form.Control
                                type="number"
                                name="monto"
                                className="form-control"
                                min="0.01"
                                step="0.01"
                                max={saldoRestante}
                                required
                            />
                        </Form.Group>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Método de Pago</Form.Label>
                        <Form.Select name="metodo" className="form-control" required>
                            <option value="">Seleccione un medio de pago</option>
                            {medioDePago.map((medio, index) => (
                                <option key={index} value={medio}>
                                    {medio}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Registrar
                    </Button>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RegistrarPagoModal;

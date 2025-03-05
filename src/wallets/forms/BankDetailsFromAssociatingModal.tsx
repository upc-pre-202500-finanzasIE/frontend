import React from "react";
import { Modal, Button } from "antd";

interface BankDetailsFromAssociatingModalProps {
    visible: boolean;
    onClose: () => void;
    bank: {
        gastosIniciales: string;
        gastosFinales: string;
    };
}

const BankDetailsFromAssociatingModal: React.FC<BankDetailsFromAssociatingModalProps> = ({ visible, onClose, bank }) => {
    const initialExpenses = bank.gastosIniciales ? JSON.parse(bank.gastosIniciales) : null;
    const finalExpenses = bank.gastosFinales ? JSON.parse(bank.gastosFinales) : null;

    const renderExpenses = (expenses: Record<string, number>) => {
        return expenses ? (
            <div>
                {Object.entries(expenses).map(([key, value]) => {
                    let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                    if (key === "comisionPagoInicial") label = "Costo por letra";
                    if (key === "comisionFija") value = `${value}%`;
                    if (key === "seguroInicial") value = `${value}%`;
                    return (
                        <div key={key}>{label}: {value}</div>
                    );
                })}
            </div>
        ) : "No hay gastos asociados";
    };

    return (
        <Modal visible={visible} onCancel={onClose} footer={null} title="Detalles del Banco">
            <div>
                <div><strong>Gastos Iniciales:</strong></div>
                <div>{renderExpenses(initialExpenses)}</div>
                <div><strong>Gastos Finales:</strong></div>
                <div>{renderExpenses(finalExpenses)}</div>
            </div>
            <Button type="primary" onClick={onClose}>Cerrar</Button>
        </Modal>
    );
};

export default BankDetailsFromAssociatingModal;
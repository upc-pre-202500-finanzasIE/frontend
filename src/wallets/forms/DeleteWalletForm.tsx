// src/wallets/components/DeleteWalletForm.tsx
import React from 'react';
import { Modal, Button } from 'antd';

interface DeleteWalletFormProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    walletId: string | null;
}

const DeleteWalletForm: React.FC<DeleteWalletFormProps> = ({ visible, onConfirm, onCancel, walletId }) => {
    return (
        <Modal
            visible={visible}
            title="Confirmar Eliminación"
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>
                    No
                </Button>,
                <Button key="submit" type="primary" onClick={onConfirm}>
                    Sí
                </Button>,
            ]}
        >
            <p>¿Está seguro de que desea eliminar la cartera con ID: {walletId}?</p>
        </Modal>
    );
};

export default DeleteWalletForm;
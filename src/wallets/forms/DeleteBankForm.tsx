// src/wallets/forms/DeleteBankForm.tsx
import React from 'react';
import { Modal, Button } from 'antd';

interface DeleteBankFormProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    bankId: string | null;
}

const DeleteBankForm: React.FC<DeleteBankFormProps> = ({ visible, onConfirm, onCancel, bankId }) => {
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
            <p>¿Está seguro de que desea eliminar el banco con ID: {bankId}?</p>
        </Modal>
    );
};

export default DeleteBankForm;
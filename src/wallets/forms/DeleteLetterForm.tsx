// src/wallets/components/DeleteLetterForm.tsx
import React from 'react';
import { Modal, Button } from 'antd';

interface DeleteLetterFormProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    letterId: string | null;
}

const DeleteLetterForm: React.FC<DeleteLetterFormProps> = ({ visible, onConfirm, onCancel, letterId }) => {
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
            <p>¿Está seguro de que desea eliminar la carta con ID: {letterId}?</p>
        </Modal>
    );
};

export default DeleteLetterForm;
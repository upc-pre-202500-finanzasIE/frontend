// src/wallets/components/WalletButtonsComponent.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Modal } from 'antd';
import CreateWalletForm from '../forms/CreateWalletForm';
import DeleteWalletForm from '../forms/DeleteWalletForm';
import { deleteWalletById } from '../services/WalletService';

const WalletButtonsComponent: React.FC<{
    isItemSelected: boolean;
    selectedWalletId: string | null;
    onFormSubmit: () => void;
}> = ({ isItemSelected, selectedWalletId, onFormSubmit }) => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const formRef = useRef<any>(null);

    const handleAddClick = () => {
        setIsAddModalVisible(true);
    };

    const handleCancel = () => {
        setIsAddModalVisible(false);
        if (formRef.current) {
            formRef.current.resetFields();
        }
    };

    const handleDeleteClick = () => {
        console.log('Selected Wallet ID:', selectedWalletId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const handleDeleteConfirm = async () => {
        if (selectedWalletId) {
            try {
                await deleteWalletById(selectedWalletId);
                onFormSubmit();
                setIsDeleteModalVisible(false);
            } catch (error) {
                console.error('Error deleting wallet:', error);
            }
        }
    };

    return (
        <div style={{ margin: '8px' }}>
            <Button
                variant="contained"
                style={{
                    borderRadius: '20px',
                    backgroundColor: '#3f51b5',
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px',
                    margin: '8px',
                }}
                startIcon={<AddIcon />}
                onClick={handleAddClick}
            >
                Añadir
            </Button>
            <Button
                variant="contained"
                style={{
                    borderRadius: '20px',
                    backgroundColor: isItemSelected ? '#3f51b5' : '#b0b0b0',
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px',
                    margin: '8px',
                }}
                startIcon={<DeleteIcon />}
                disabled={!isItemSelected}
                onClick={handleDeleteClick}
            >
                Eliminar
            </Button>
            <Button
                variant="contained"
                style={{
                    borderRadius: '20px',
                    backgroundColor: isItemSelected ? '#3f51b5' : '#b0b0b0',
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px',
                    margin: '8px',
                }}
                startIcon={<EditIcon />}
                disabled={!isItemSelected}
            >
                Editar
            </Button>
            <Button
                variant="contained"
                style={{
                    borderRadius: '20px',
                    backgroundColor: '#3f51b5',
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px',
                    margin: '8px',
                }}
                startIcon={<FilterListIcon />}
            >
                Filtrar
            </Button>
            <Modal
                visible={isAddModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <CreateWalletForm ref={formRef} onCancel={handleCancel} onFormSubmit={onFormSubmit} />
            </Modal>
            <DeleteWalletForm
                visible={isDeleteModalVisible}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                walletId={selectedWalletId}
            />
        </div>
    );
};

export default WalletButtonsComponent;
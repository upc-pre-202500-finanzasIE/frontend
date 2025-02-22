// src/wallets/components/BanksButtonsComponent.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateBankForm from '../forms/CreateBankForm';
import DeleteBankForm from '../forms/DeleteBankForm';
import { Modal } from 'antd';
import { deleteBankById, getBankById } from '../services/BanksService';

const BanksButtonsComponent: React.FC<{
    isItemSelected: boolean;
    selectedBankId: string | null;
    onFormSubmit: () => void;
}> = ({ isItemSelected, selectedBankId, onFormSubmit }) => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [bankDetails, setBankDetails] = useState(null);
    const formRef = useRef<any>(null);

    const handleAddClick = () => {
        setIsAddModalVisible(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDetailsClick = async () => {
        if (selectedBankId) {
            try {
                const details = await getBankById(selectedBankId);
                setBankDetails(details);
                setIsDetailsModalVisible(true);
            } catch (error) {
                console.error('Error fetching bank details:', error);
            }
        }
    };

    const handleCancel = () => {
        setIsAddModalVisible(false);
        setIsDeleteModalVisible(false);
        setIsDetailsModalVisible(false);
        if (formRef.current) {
            formRef.current.resetFields();
        }
    };

    const handleDeleteConfirm = async () => {
        if (selectedBankId) {
            try {
                await deleteBankById(selectedBankId);
                onFormSubmit();
                setIsDeleteModalVisible(false);
            } catch (error) {
                console.error('Error deleting bank:', error);
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
                    backgroundColor: isItemSelected ? '#3f51b5' : '#b0b0b0',
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px',
                    margin: '8px',
                }}
                startIcon={<VisibilityIcon />}
                disabled={!isItemSelected}
                onClick={handleDetailsClick}
            >
                Ver Detalles
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
                <CreateBankForm ref={formRef} onCancel={handleCancel} onFormSubmit={onFormSubmit} />
            </Modal>
            <Modal
                visible={isDetailsModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <CreateBankForm ref={formRef} onCancel={handleCancel} onFormSubmit={onFormSubmit} initialValues={bankDetails} readOnly />
            </Modal>
            <DeleteBankForm
                visible={isDeleteModalVisible}
                onConfirm={handleDeleteConfirm}
                onCancel={handleCancel}
                bankId={selectedBankId}
            />
        </div>
    );
};

export default BanksButtonsComponent;
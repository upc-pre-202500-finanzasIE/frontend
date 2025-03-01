// src/wallets/components/LettersButtonsComponent.tsx
import React, { useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CreateLetterForm from '../forms/CreateLetterForm';
import DeleteLetterForm from '../forms/DeleteLetterForm';
import { Modal } from 'antd';
import { deleteLetterById, getLetterById } from '../services/LetterService';

const LettersButtonsComponent: React.FC<{
    isItemSelected: boolean;
    selectedLetterId: string | null;
    onFormSubmit: () => void;
}> = ({ isItemSelected, selectedLetterId, onFormSubmit }) => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
    const [letterDetails, setLetterDetails] = useState(null);
    const formRef = useRef<any>(null);

    const handleAddClick = () => {
        setIsAddModalVisible(true);
    };

    const handleDeleteClick = () => {
        setIsDeleteModalVisible(true);
    };

    const handleDetailsClick = async () => {
        if (selectedLetterId) {
            try {
                const details = await getLetterById(selectedLetterId);
                setLetterDetails(details);
                setIsDetailsModalVisible(true);
            } catch (error) {
                console.error('Error fetching letter details:', error);
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
        if (selectedLetterId) {
            try {
                await deleteLetterById(selectedLetterId);
                onFormSubmit();
                setIsDeleteModalVisible(false);
            } catch (error) {
                console.error('Error deleting letter:', error);
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
                startIcon={<VisibilityIcon />}
                disabled={!isItemSelected}
                onClick={handleDetailsClick}
            >
                Ver Detalles
            </Button>

            <Modal
                visible={isAddModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <CreateLetterForm ref={formRef} onCancel={handleCancel} onFormSubmit={onFormSubmit} />
            </Modal>
            <Modal
                visible={isDetailsModalVisible}
                onCancel={handleCancel}
                footer={null}
                width={600}
            >
                <CreateLetterForm ref={formRef} onCancel={handleCancel} onFormSubmit={onFormSubmit} initialValues={letterDetails} readOnly />
            </Modal>
            <DeleteLetterForm
                visible={isDeleteModalVisible}
                onConfirm={handleDeleteConfirm}
                onCancel={handleCancel}
                letterId={selectedLetterId}
            />
        </div>
    );
};

export default LettersButtonsComponent;
import React, { useState, useRef } from 'react';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import UpdateIcon from '@material-ui/icons/Update';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { Modal } from 'antd';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateWalletForm from '../forms/CreateWalletForm';
import DeleteWalletForm from '../forms/DeleteWalletForm';
import AssociatingWalletBankForm from '../forms/AssociatingWalletBankForm';
import WalletDetailsModal from '../forms/WalletDetailsModal';
import { deleteWalletById, updateWalletValorNeto } from '../services/WalletService';

const WalletButtonsComponent: React.FC<{
    isItemSelected: boolean;
    selectedWalletId: string | null;
    selectedWallet: { nombre: string; tipoDeCartera: string; bank: number | null } | null;
    onFormSubmit: () => void;
}> = ({ isItemSelected, selectedWalletId, selectedWallet, onFormSubmit }) => {
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isAssociateModalVisible, setIsAssociateModalVisible] = useState(false);
    const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
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

    const handleAssociateClick = () => {
        if (selectedWallet && selectedWallet.bank !== null) {
            toast.warning("Esta cartera ya tiene una institucion asociada", { position: "top-right", autoClose: 3000 });
            return;
        }
        setIsAssociateModalVisible(true);
    };

    const handleAssociateCancel = () => {
        setIsAssociateModalVisible(false);
    };
    const handleDetailsCancel = () => {
        setIsDetailsModalVisible(false);
    };

    const handleAssociateSubmit = (bankId: number) => {
        console.log('Wallet associated with bankId:', bankId);
        setIsAssociateModalVisible(false);
        onFormSubmit();
    };

    const handleUpdateValuesClick = async () => {
        if (selectedWalletId) {
            try {
                await updateWalletValorNeto(selectedWalletId);
                toast.success("Valores de cartera actualizados", { position: "top-right", autoClose: 3000 });
                onFormSubmit();
            } catch (error) {
                console.error('Error updating wallet values:', error);
                toast.error("Error al actualizar valores de cartera", { position: "top-right", autoClose: 3000 });
            }
        }
    };

    const handleDetailsClick = () => {
        setIsDetailsModalVisible(true);
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
                startIcon={<AddIcon />}
                disabled={!isItemSelected}
                onClick={handleAssociateClick}
            >
                Asociar cartera Institucion Financiera
            </Button>
            <Button
                variant="contained"
                style={{
                    borderRadius: '20px',
                    backgroundColor: isItemSelected && selectedWallet?.bank !== null ? '#3f51b5' : '#b0b0b0',
                    color: 'white',
                    fontSize: '14px',
                    padding: '10px',
                    margin: '8px',
                }}
                startIcon={<UpdateIcon />}
                disabled={!isItemSelected || selectedWallet?.bank === null}
                onClick={handleUpdateValuesClick}
            >
                Actualizar valores de cartera
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
                <CreateWalletForm ref={formRef} onCancel={handleCancel} onFormSubmit={onFormSubmit} />
            </Modal>
            <DeleteWalletForm
                visible={isDeleteModalVisible}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                walletId={selectedWalletId}
            />
            {selectedWallet && (
                <AssociatingWalletBankForm
                    visible={isAssociateModalVisible}
                    onCancel={handleAssociateCancel}
                    wallet={selectedWallet}
                    onFormSubmit={handleAssociateSubmit}
                />
            )}
            <WalletDetailsModal
                visible={isDetailsModalVisible}
                onCancel={handleDetailsCancel}
                walletName={selectedWallet?.nombre || ''}
                walletId={selectedWalletId || ''}
            />
        </div>
    );
};

export default WalletButtonsComponent;
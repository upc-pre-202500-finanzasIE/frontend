import React from 'react';
import { Modal, Box, Button, Typography } from '@material-ui/core';

interface ConfirmDeleteModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    walletName: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
                                                                   open,
                                                                   onClose,
                                                                   onConfirm,
                                                                   walletName,
                                                               }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    maxWidth: '400px',
                    margin: 'auto',
                    top: '30%',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    ¿Estás seguro de que deseas eliminar la cartera "{walletName}"?
                </Typography>
                <Box display="flex" justifyContent="space-between">
                    <Button
                        variant="contained"
                        onClick={onClose}
                        style={{
                            borderRadius: '20px',
                            backgroundColor: '#b0b0b0',
                            color: 'white',
                            fontSize: '14px',
                            padding: '10px',
                            margin: '8px',
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        onClick={onConfirm}
                        color="primary"
                        style={{
                            borderRadius: '20px',
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            fontSize: '14px',
                            padding: '10px',
                            margin: '8px',
                        }}
                    >
                        Confirmar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default ConfirmDeleteModal;

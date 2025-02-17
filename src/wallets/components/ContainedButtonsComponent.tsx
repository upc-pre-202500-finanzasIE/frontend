import React, { useState, useEffect } from 'react';
import { MenuItem, Select, InputAdornment, Button, Modal, TextField, Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import FilterListIcon from '@material-ui/icons/FilterList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {deleteWalletById, getWalletById, saveWallet} from '../services/WalletService';
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

const ContainedButtons: React.FC<{
    classWallet: string;
    isItemSelected: boolean;
    selectedWalletId: string | null;
    refreshData: () => void;
}> = ({ classWallet, isItemSelected, selectedWalletId, refreshData }) => {
    const [open, setOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [walletNameToDelete, setWalletNameToDelete] = useState('');
    const [numLetters, setNumLetters] = useState(1);
    const [startDates, setStartDates] = useState<string[]>(['']);
    const [endDates, setEndDates] = useState<string[]>(['']);
    const [montos, setMontos] = useState<string[]>(['']);
    const [teas, setTeas] = useState<string[]>(['']);
    const [currency, setCurrency] = useState<string[]>(['Soles']);
    const [rateType, setRateType] = useState<string[]>(['Tasa efectiva']);
    const [ratePeriod, setRatePeriod] = useState<string[]>(['Anual']);
    const [errors, setErrors] = useState<string[]>(['']);
    const [nombre, setNombre] = useState('');
    const [cliente, setCliente] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);




    const validateForm = () => {
        const isValid = Boolean(
            nombre && cliente && numLetters > 0 &&
            startDates.every(date => date) &&
            endDates.every(date => date) &&
            montos.every(monto => monto) &&
            teas.every(tea => tea) &&
            currency.every(curr => curr) &&
            rateType.every(rate => rate) &&
            ratePeriod.every(period => period)
        );
        setIsFormValid(isValid);
    };

    const handleOpen = () => {
        if (classWallet === 'WalletLetter') {
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNumLettersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const num = Number(event.target.value);
        setNumLetters(num);
        setStartDates(Array(num).fill(''));
        setEndDates(Array(num).fill(''));
        setMontos(Array(num).fill(''));
        setTeas(Array(num).fill(''));
        setCurrency(Array(num).fill('Soles'));
        setRateType(Array(num).fill('Tasa efectiva'));
        setRatePeriod(Array(num).fill('Anual'));
        setErrors(Array(num).fill(''));
    };


    const handleStartDateChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDates = [...startDates];
        newStartDates[index] = event.target.value;
        setStartDates(newStartDates);
        validateDates(index, event.target.value, endDates[index]);
    };

    const handleEndDateChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDates = [...endDates];
        newEndDates[index] = event.target.value;
        setEndDates(newEndDates);
        validateDates(index, startDates[index], event.target.value);
    };

    const handleMontoChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newMontos = [...montos];
        newMontos[index] = event.target.value.replace(/[^0-9.]/g, '');
        setMontos(newMontos);
    };
    const handleDelete = async () => {
        if (!selectedWalletId) return;

        try {
            const wallet = await getWalletById(selectedWalletId);
            setWalletNameToDelete(wallet.nombre);
            setIsDeleteModalOpen(true);
        } catch (error) {
            console.error('Error obteniendo la cartera:', error);
            toast.error('Error al obtener la cartera para eliminar');
        }
    };

    const handleConfirmDelete = async () => {
        if (!selectedWalletId) return;

        try {
            await deleteWalletById(selectedWalletId);
            toast.success('Cartera eliminada exitosamente', { position: 'top-right' });
            refreshData();
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error eliminando cartera:', error);
            toast.error('Error al eliminar la cartera');
        }
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };
    const handleTeaChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newTeas = [...teas];
        newTeas[index] = event.target.value.replace(/[^0-9.]/g, '');
        setTeas(newTeas);
    };

    const handleCurrencyChange = (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const newCurrency = [...currency];
        newCurrency[index] = event.target.value as string;
        setCurrency(newCurrency);
    };

    const handleRateTypeChange = (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const newRateType = [...rateType];
        newRateType[index] = event.target.value as string;
        setRateType(newRateType);
    };

    const handleRatePeriodChange = (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const newRatePeriod = [...ratePeriod];
        newRatePeriod[index] = event.target.value as string;
        setRatePeriod(newRatePeriod);
    };

    const validateDates = (index: number, startDate: string, endDate: string) => {
        const newErrors = [...errors];
        if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
            newErrors[index] = 'La fecha de vencimiento no puede ser anterior a la fecha de inicio';
        } else {
            newErrors[index] = '';
        }
        setErrors(newErrors);
    };

    const handleSave = async () => {


        const letras = startDates.map((startDate, index) => ({
            idTasa: (index + 1).toString(),
            startDate,
            endDate: endDates[index],
            monto: montos[index],
            currency: currency[index],
            tea: teas[index],
            rateType: rateType[index],
            ratePeriod: ratePeriod[index],
        }));

        const wallet = {
            nombre,
            cliente,
            numeroLetrasFacturas: numLetters,
            letras: JSON.stringify(letras),
        };

        try {
            await saveWallet(wallet);
            toast.success('El guardado de la información del cliente y sus letras fue exitoso', {
                position: 'top-right',
            });
            handleClose();
            refreshData();
        } catch (error) {
            console.error('Error saving wallet:', error);
        }
    };
    useEffect(() => {
        if (selectedWalletId) {
            console.log("ID de la cartera seleccionada en ContainedButtons:", selectedWalletId);
        }
    }, [selectedWalletId]);

    useEffect(() => {
        validateForm();
    }, [nombre, cliente, numLetters, startDates, endDates, montos, teas, currency, rateType, ratePeriod]);

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
                onClick={handleOpen}
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
                onClick={handleDelete}
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
            <ConfirmDeleteModal
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleConfirmDelete}
                walletName={walletNameToDelete}
            />
            <Modal
                open={open}
                onClose={handleClose}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    style={{
                        backgroundColor: 'white',
                        border: '2px solid #000',
                        boxShadow: '5px 5px 15px rgba(0,0,0,0.3)',
                        padding: '16px 32px 24px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        borderRadius: '15px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            padding: '16px',
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        <h2>Nueva cartera</h2>
                    </div>
                    <TextField
                        label="Nombre"
                        fullWidth
                        margin="normal"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <TextField
                        label="Cliente"
                        fullWidth
                        margin="normal"
                        value={cliente}
                        onChange={(e) => setCliente(e.target.value)}
                    />
                    <TextField
                        label="Número de letras"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={numLetters}
                        onChange={handleNumLettersChange}
                    />
                    {[...Array(numLetters)].map((_, index) => (
                        <Box key={index} mt={2}>
                            <h3>Letra {index + 1}</h3>
                            <TextField
                                label="Fecha de inicio"
                                type="date"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                value={startDates[index]}
                                onChange={handleStartDateChange(index)}
                            />
                            <TextField
                                label="Fecha de vencimiento"
                                type="date"
                                fullWidth
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                value={endDates[index]}
                                onChange={handleEndDateChange(index)}
                            />
                            {errors[index] && (
                                <div style={{ color: 'red', fontSize: '12px' }}>
                                    {errors[index]}
                                </div>
                            )}
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box flex={1} mr={1}>
                                    <Select
                                        value={currency[index]}
                                        onChange={handleCurrencyChange(index)}
                                        fullWidth
                                    >
                                        <MenuItem value="Soles">Soles</MenuItem>
                                        <MenuItem value="Dolares">Dolares</MenuItem>
                                    </Select>
                                </Box>
                                <Box flex={1} ml={1}>
                                    <TextField
                                        label="Monto"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={montos[index]}
                                        onChange={handleMontoChange(index)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    {currency[index] === 'Soles' ? 'S/' : '$'}
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box flex={1} mr={1}>
                                    <Select
                                        value={rateType[index]}
                                        onChange={handleRateTypeChange(index)}
                                        fullWidth
                                    >
                                        <MenuItem value="Tasa nominal">Tasa nominal</MenuItem>
                                        <MenuItem value="Tasa efectiva">Tasa efectiva</MenuItem>
                                    </Select>
                                </Box>
                                <Box flex={1} mx={1}>
                                    <Select
                                        value={ratePeriod[index]}
                                        onChange={handleRatePeriodChange(index)}
                                        fullWidth
                                    >
                                        <MenuItem value="Trimestral">Trimestral</MenuItem>
                                        <MenuItem value="Mensual">Mensual</MenuItem>
                                        <MenuItem value="Quincenal">Quincenal</MenuItem>
                                        <MenuItem value="Anual">Anual</MenuItem>
                                    </Select>
                                </Box>
                                <Box flex={1} ml={1}>
                                    <TextField
                                        label="TEA"
                                        type="number"
                                        fullWidth
                                        margin="normal"
                                        value={teas[index]}
                                        onChange={handleTeaChange(index)}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">%</InputAdornment>
                                            ),
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    ))}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={!isFormValid}
                    >
                        Guardar
                    </Button>
                </Box>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default ContainedButtons;
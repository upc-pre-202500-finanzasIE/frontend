import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/wallets';

export const getAllWallets = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching wallets:', error);
        throw error;
    }
};

export const saveWallet = async (wallet: { nombre: string; cliente: string; numeroLetrasFacturas: number; letras: string }) => {
    try {
        const response = await axios.post(API_URL, wallet);
        return response.data;
    } catch (error) {
        console.error('Error saving wallet:', error);
        throw error;
    }
};

export const getWalletById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching wallet with id ${id}:`, error);
        throw error;
    }
};

export const deleteWalletById = async (id: number) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting wallet with id ${id}:`, error);
        throw error;
    }
};

export const updateWalletById = async (id: number, wallet: { nombre: string; cliente: string; numeroLetrasFacturas: number; letras: string }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, wallet);
        return response.data;
    } catch (error) {
        console.error(`Error updating wallet with id ${id}:`, error);
        throw error;
    }
};

export const updateWalletBankId = async (walletId: number, bankId: number) => {
    try {
        const response = await axios.put(`${API_URL}/${walletId}/bank/${bankId}`);
        return response.data;
    } catch (error) {
        console.error(`Error updating wallet bank id with walletId ${walletId} and bankId ${bankId}:`, error);
        throw error;
    }
};

export const updateWalletValorNeto = async (walletId: number, gastosIniciales?: number, gastosFinales?: number) => {
    try {
        const params = new URLSearchParams();
        if (gastosIniciales !== undefined) {
            params.append('gastosIniciales', gastosIniciales.toString());
        }
        if (gastosFinales !== undefined) {
            params.append('gastosFinales', gastosFinales.toString());
        }
        await axios.put(`${API_URL}/${walletId}/update-valor-neto?${params.toString()}`);
    } catch (error) {
        console.error(`Error updating valor neto for wallet with id ${walletId}:`, error);
        throw error;
    }
};
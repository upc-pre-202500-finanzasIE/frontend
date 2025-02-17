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

export const getWalletById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching wallet with id ${id}:`, error);
        throw error;
    }
};

export const deleteWalletById = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting wallet with id ${id}:`, error);
        throw error;
    }
};

export const updateWalletById = async (id: string, wallet: { nombre: string; cliente: string; numeroLetrasFacturas: number; letras: string }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, wallet);
        return response.data;
    } catch (error) {
        console.error(`Error updating wallet with id ${id}:`, error);
        throw error;
    }
};
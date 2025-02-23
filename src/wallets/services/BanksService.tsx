// src/wallets/services/BankService.tsx
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/banks';

export const getAllBanks = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log('getAllBanks response:', response.data); // Log the response data
        return response.data;
    } catch (error) {
        console.error('Error fetching banks:', error);
        throw error;
    }
};

export const getBankById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching bank with id ${id}:`, error);
        throw error;
    }
};

export const insertBank = async (bank: { nombreBanco: string; tasaDeInteres: number; isNominal: boolean; isEfectiva: boolean; capitalizacion?: string; isDolares: boolean; isSoles: boolean; periodoTasa?: number }) => {
    try {
        const response = await axios.post(API_URL, bank);
        return response.data;
    } catch (error) {
        console.error('Error inserting bank:', error);
        throw error;
    }
};

export const updateBankById = async (id: number, bank: { nombreBanco: string; tasaDeInteres: number; isNominal: boolean; isEfectiva: boolean; capitalizacion?: string; isDolares: boolean; isSoles: boolean; periodoTasa?: number }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, bank);
        return response.data;
    } catch (error) {
        console.error(`Error updating bank with id ${id}:`, error);
        throw error;
    }
};

export const deleteBankById = async (id: number) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting bank with id ${id}:`, error);
        throw error;
    }
};

export const getBankByTipoMoneda = async (tipoMoneda: string) => {
    try {
        const response = await axios.get(`${API_URL}/tipoMoneda/${tipoMoneda}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching banks by tipoMoneda ${tipoMoneda}:`, error);
        throw error;
    }
};
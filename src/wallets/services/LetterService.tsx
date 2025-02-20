// src/wallets/services/LetterService.tsx
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/letters';

export const getAllLetters = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching letters:', error);
        throw error;
    }
};

export const getLetterById = async (id: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching letter with id ${id}:`, error);
        throw error;
    }
};

export const insertLetter = async (letter: { cliente: string; fechaFirma: string; valorNominal: number; fechaVencimiento: string; hasPlazo: boolean; plazo: number; isSoles: boolean; isDolares: boolean }) => {
    try {
        const response = await axios.post(API_URL, letter);
        return response.data;
    } catch (error) {
        console.error('Error inserting letter:', error);
        throw error;
    }
};

export const updateLetterById = async (id: string, letter: { cliente: string; fechaFirma: string; valorNominal: number; fechaVencimiento: string; hasPlazo: boolean; plazo: number; isSoles: boolean; isDolares: boolean }) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, letter);
        return response.data;
    } catch (error) {
        console.error(`Error updating letter with id ${id}:`, error);
        throw error;
    }
};

export const deleteLetterById = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
        console.error(`Error deleting letter with id ${id}:`, error);
        throw error;
    }
};

export const getByTipoMoneda = async (tipoMoneda: string, excludeWalletIds: string[] = []) => {
    try {
        const response = await axios.get(`${API_URL}/tipoMoneda/${tipoMoneda}`, {
            params: { excludeWalletIds: excludeWalletIds.join(',') }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching letters by tipoMoneda ${tipoMoneda}:`, error);
        throw error;
    }
};
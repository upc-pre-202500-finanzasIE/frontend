import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

export const AuthenticationService = {
    login: async (login: string, password: string) => {
        const response = await axios.post(`${API_URL}/login`, null, {
            params: { login, password }
        });
        return response.data;
    },
    register: async (login: string, password: string) => {
        const response = await axios.post(`${API_URL}/register`, null, {
            params: { login, password }
        });
        return response.data;
    }
};
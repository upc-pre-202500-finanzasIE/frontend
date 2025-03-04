import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationService } from '../services/AuthenticationService';
import './SignInPage.css';

const SignInPage: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await AuthenticationService.login(userName, password);
            console.log('Login successful:', response);
            localStorage.setItem('authToken', response.token); // Store token in localStorage
            navigate('/wallets'); // Navigate to /wallets on successful login
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const handleRegister = async () => {
        try {
            const response = await AuthenticationService.register(userName, password);
            console.log('Registration successful:', response);
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form-container">
                <h2>Finance You</h2>
                <form>
                    <div className="signin-form-group">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>
                    <div className="signin-form-group">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="signin-form-group">
                        <button type="button" onClick={handleLogin}>Login</button>
                        <button type="button" onClick={handleRegister}>Register</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignInPage;
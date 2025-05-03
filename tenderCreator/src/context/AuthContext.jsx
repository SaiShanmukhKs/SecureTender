import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Register new user
    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setToken(token);
            setUser(user);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Fetch current user profile
    const fetchProfile = async () => {
        if (!token) return;

        try {
            const response = await axios.get(`${API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
            if (err.response?.status === 401) {
                logout();
            }
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        setLoading(true);
        try {
            const response = await axios.patch(`${API_URL}/profile`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUser(response.data);
            setError(null);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Fetch profile on mount if token exists
    useEffect(() => {
        if (token) {
            fetchProfile();
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            error,
            register,
            login,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};
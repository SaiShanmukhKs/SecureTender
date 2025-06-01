import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Web3 from 'web3';
import './SignUp.css';

export default function SignUp() {
    const [isRegistering, setIsRegistering] = useState(true);
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: '',
        organization: '',
        address: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        let token = localStorage.getItem('userData');
        token = token ? JSON.parse(token).token : null;
        if (token) {
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 2000); // Redirect after 2 seconds
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'address') {
            try {
                const web3 = new Web3();
                // Check if the entered value is a valid Ethereum address
                if (web3.utils.isAddress(value)) {
                    setData((prevData) => ({
                        ...prevData,
                        address: value
                    }));
                    setError('');
                } else if (value === '') {
                    // Allow empty value (user is clearing the field)
                    setData((prevData) => ({
                        ...prevData,
                        address: value
                    }));
                    setError('');
                } else {
                    // Invalid address format
                    setData((prevData) => ({
                        ...prevData,
                        address: value
                    }));
                    setError('Invalid wallet address format');
                }
            } catch (error) {
                setData((prevData) => ({
                    ...prevData,
                    address: value
                }));
                setError('Invalid wallet address format');
                console.error('Error validating address:', error);
            }
        } else {
            setData((prevData) => {
                const newData = { ...prevData, [name]: value };

                if (isRegistering && (name === 'password' || name === 'confirmPassword')) {
                    if (value !== '' && newData.password.length < 8) {
                        setError('Password must be at least 8 characters');
                    } else if ((name === 'confirmPassword' && value !== '') && newData.password !== newData.confirmPassword) {
                        setError('Passwords do not match');
                    } else {
                        setError('');
                    }
                }

                return newData;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const url = `${backendUrl}${isRegistering ? '/api/register' : '/api/login'}`;
            const payload = isRegistering
                ? {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    walletAddress: data.address,
                    companyName: data.organization
                }
                : { email: data.email, password: data.password, role: data.role };
            console.log('Payload:', payload);
            console.log('URL:', url);
            const res = await axios.post(url, payload);
            localStorage.setItem('userData', JSON.stringify(res.data));
            
            // Force a re-render by using window.location instead of navigate
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 100); // Much shorter delay
        } catch (err) {
            console.error(err.response.data.error);
            setError(err.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                <h2 className="signup-title">
                    {isRegistering ? 'Create an Account' : 'Welcome Back'}
                </h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    {isRegistering && (
                        <>
                            <Input
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                            />
                            <Input
                                name="organization"
                                value={data.organization}
                                onChange={handleChange}
                                placeholder="Organization Name"
                            />
                        </>
                    )}
                    <Input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        placeholder="Email"
                    />
                    <Input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="Password"
                    />
                    {isRegistering ? (
                        <>
                            <Input
                                type="password"
                                name="confirmPassword"
                                value={data.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm Password"
                            />
                            <select
                                name="role"
                                value={data.role}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                <option value="" disabled>Select a role</option>
                                <option value="bidder">Bidder</option>
                                <option value="Tender Creator">Tender Creator</option>
                            </select>
                            <Input
                                name="address"
                                value={data.address}
                                onChange={handleChange}
                                placeholder="Wallet Address"
                            />
                        </>
                    ) : (
                        <select
                            name="role"
                            value={data.role}
                            onChange={handleChange}
                            className="form-select"
                            required
                        >
                            <option value="" disabled>Select a role</option>
                            <option value="bidder">Bidder</option>
                            <option value="Tender Creator">Tender Creator</option>
                        </select>
                    )}
                    {error && (
                        <div className="alert-box error">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="form-button"
                    >
                        {isRegistering ? 'Register' : 'Login'}
                    </button>
                </form>
                <p className="form-toggle">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}
                    <button
                        className="form-link"
                        onClick={() => {
                            setIsRegistering(!isRegistering)
                            setError('');
                            setData({
                                name: '',
                                email: '',
                                password: '',
                                confirmPassword: '',
                                role: '',
                                organization: '',
                                address: ''
                            });
                        }}
                        type="button"
                    >
                        {isRegistering ? 'Login' : 'Register'}
                    </button>
                </p>
            </div>
        </div>
    );
}

function Input({ type = 'text', name, value, onChange, placeholder }) {
    return (
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="form-input"
            required
        />
    );
}
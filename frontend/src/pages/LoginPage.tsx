import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { baseUrl } from '../utils/baseUrl';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                toast.success('Successfully logged in!');
                navigate('/');
            } else {
                toast.error(data.message || 'Failed to login');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-section">
            <div className="hero-bg-gradient"></div>
            <div className="auth-orb auth-orb-1"></div>
            <div className="auth-orb auth-orb-2"></div>

            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to manage your account</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label ">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="uk@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary-glow"
                        disabled={isLoading}
                        style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <span style={{ color: 'var(--light-500)', fontSize: '0.8rem' }}>Admin Access Only</span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

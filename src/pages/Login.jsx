import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [credentials, setCredentials] = useState({ email: '', password: '', name: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect logic: go back to where they came from (e.g. blog post) or default to home/admin
    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (isLogin) {
                // Sign In
                const { error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (error) throw error;
                // If successful, redirect
                if (from === '/') {
                    // Check if admin
                    navigate('/admin'); // Default behavior for direct login
                } else {
                    navigate(from);
                }
            } else {
                // Sign Up
                const { error } = await supabase.auth.signUp({
                    email: credentials.email,
                    password: credentials.password,
                    options: {
                        data: {
                            full_name: credentials.name,
                        },
                    },
                });
                if (error) throw error;
                setSuccessMsg('Account created! Please check your email to verify found or simply login if auto-confirmed.');
                setIsLogin(true); // Switch back to login
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '40px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#F3E8FF', color: 'var(--color-secondary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                    <Lock size={28} />
                </div>

                <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '8px' }}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                    {isLogin ? 'Please login to continue.' : 'Join to comment and interact.'}
                </p>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {!isLogin && (
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: '#B2BEC3' }} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                required
                                value={credentials.name}
                                onChange={handleChange}
                                className="input-field"
                            />
                        </div>
                    )}

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: '#B2BEC3' }} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            required
                            value={credentials.email}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '14px', top: '16px', color: '#B2BEC3', pointerEvents: 'none' }} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            value={credentials.password}
                            onChange={handleChange}
                            className="input-field"
                        />
                    </div>

                    {error && <div style={{ color: '#e74c3c', fontSize: '0.9rem', padding: '10px', background: '#fadbd8', borderRadius: '8px' }}>{error}</div>}
                    {successMsg && <div style={{ color: '#27ae60', fontSize: '0.9rem', padding: '10px', background: '#d5f5e3', borderRadius: '8px' }}>{successMsg}</div>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;

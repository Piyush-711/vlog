import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    // Only Sign In logic now
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });
            if (error) throw error;
            navigate('/admin');
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
                    Admin Login
                </h1>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                    Welcome back! Please login.
                </p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Processing...' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '24px', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                    New admin access is managed via database only.
                </div>
            </div>
        </div>
    );
};

export default Login;

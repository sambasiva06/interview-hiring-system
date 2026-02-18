import React, { useState } from 'react';
import { authService } from '../services/api';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ChevronRight, UserPlus, ShieldCheck } from 'lucide-react';

export default function Login({ onLogin, onSwitch }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await authService.login(email, password);
            onLogin(data);
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    padding: 'var(--space-10)',
                    border: 'none',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        style={{
                            width: '72px',
                            height: '72px',
                            background: 'var(--primary-gradient)',
                            borderRadius: '22px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            marginBottom: 'var(--space-6)',
                            boxShadow: '0 8px 24px rgba(95, 37, 159, 0.25)'
                        }}
                    >
                        <ShieldCheck size={36} />
                    </motion.div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Enter your details to continue your journey</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            padding: '1rem',
                            backgroundColor: 'var(--error-bg)',
                            color: 'var(--error)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--space-6)',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textAlign: 'center'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@company.com"
                                style={{ paddingLeft: '48px', border: '1px solid var(--border)', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', margin: 0 }}>PASSWORD</label>
                            <a href="#" style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Forgot?</a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                style={{ paddingLeft: '48px', border: '1px solid var(--border)', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            height: '56px',
                            marginTop: 'var(--space-4)',
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            borderRadius: 'var(--radius-md)'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Sign In'}
                        {!loading && <ChevronRight size={20} />}
                    </motion.button>
                </form>

                <div style={{
                    marginTop: 'var(--space-10)',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                        New here?
                        <button
                            onClick={onSwitch}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--primary)',
                                cursor: 'pointer',
                                fontWeight: 800,
                                marginLeft: '0.5rem',
                                fontSize: '0.9375rem'
                            }}
                        >
                            Create Account
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

import React, { useState } from 'react';
import { authService } from '../services/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, ChevronRight, LogIn, Users, Sparkles } from 'lucide-react';

export default function Register({ onRegister, onSwitch }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'CANDIDATE'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.register(formData);
            const data = await authService.login(formData.email, formData.password);
            onRegister(data);
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Registration failed. Please check your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1.5rem'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                    width: '100%',
                    maxWidth: '460px',
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
                        <Sparkles size={36} />
                    </motion.div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Get Started</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Join the next generation of hiring</p>
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
                        <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>FULL NAME</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                                placeholder="John Doe"
                                style={{ paddingLeft: '48px', border: '1px solid var(--border)', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>EMAIL ADDRESS</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="john@company.com"
                                style={{ paddingLeft: '48px', border: '1px solid var(--border)', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Min. 8 characters"
                                style={{ paddingLeft: '48px', border: '1px solid var(--border)', fontSize: '1rem' }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>I AM A...</label>
                        <div style={{ position: 'relative' }}>
                            <Users size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                style={{ paddingLeft: '48px', border: '1px solid var(--border)', fontSize: '1rem' }}
                            >
                                <option value="CANDIDATE">Candidate looking for jobs</option>
                                <option value="RECRUITER">Recruiter hiring talent</option>
                                <option value="INTERVIEWER">Interviewer evaluating talent</option>
                            </select>
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
                        {loading ? 'Creating Account...' : 'Continue'}
                        {!loading && <ChevronRight size={20} />}
                    </motion.button>
                </form>

                <div style={{
                    marginTop: 'var(--space-10)',
                    textAlign: 'center'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
                        Already have an account?
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
                            Log In
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

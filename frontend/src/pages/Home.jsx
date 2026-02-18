import React, { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Briefcase, ChevronRight, CheckCircle, AlertCircle, Search, Filter, Sparkles, Clock } from 'lucide-react';

export default function Home({ user }) {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await jobService.getAllOpen();
            setJobs(res || []);
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (jobId) => {
        if (!user) {
            setMessage({ type: 'error', text: 'Please login to apply' });
            return;
        }
        if (user.role !== 'CANDIDATE') {
            setMessage({ type: 'error', text: 'Only candidates can apply' });
            return;
        }

        try {
            await jobService.apply(jobId, user.userId);
            setMessage({ type: 'success', text: 'Application submitted successfully!' });
            // Auto hide message
            setTimeout(() => setMessage(null), 5000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data || 'Failed to apply' });
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
            <p style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Curating the best opportunities for you...</p>
        </div>
    );

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '3rem', position: 'relative' }}>
                <div style={{ maxWidth: '800px' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            borderRadius: '100px',
                            fontSize: '0.8125rem',
                            fontWeight: 800,
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        <Sparkles size={14} />
                        {user?.role === 'RECRUITER' ? 'Talent Acquisition Console' : 'New Opportunities Just Added'}
                    </motion.div>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: '1.1', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                        {user?.role === 'RECRUITER' ? (
                            <>Manage your <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hiring Pipeline</span></>
                        ) : (
                            <>Find your next <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dream Role</span></>
                        )}
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        {user?.role === 'RECRUITER'
                            ? "Streamline your recruitment process and find the best candidates efficiently."
                            : "Join thousands of world-class engineers and hunters building the future of hiring."}
                    </p>
                </div>
            </header>

            <AnimatePresence>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className={`alert alert-${message.type}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: message.type === 'success' ? 'var(--success-bg)' : 'var(--error-bg)',
                            color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                            border: 'none',
                            padding: '1.25rem 1.5rem',
                            borderRadius: '20px',
                            marginBottom: '2.5rem',
                            boxShadow: 'var(--shadow-sm)',
                            fontWeight: 700
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {message.type === 'success' ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
                            <span>{message.text}</span>
                        </div>
                        <button onClick={() => setMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1.5rem', padding: '0 0.5rem' }}>&times;</button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {jobs.map((job, index) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}
                        className="card"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '2rem',
                            border: 'none',
                            background: 'white',
                            height: '100%'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'var(--bg-app)',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <Briefcase size={28} />
                            </div>
                            <span style={{
                                padding: '0.4rem 0.75rem',
                                background: 'var(--success-bg)',
                                color: 'var(--success)',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em'
                            }}>
                                Active
                            </span>
                        </div>

                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{job.title}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-subtle)', fontSize: '0.875rem', marginBottom: '1.25rem', fontWeight: 600 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <MapPin size={16} />
                                    {job.location}
                                </div>
                                <div style={{ width: '4px', height: '4px', background: 'var(--border)', borderRadius: '50%' }}></div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <Clock size={16} />
                                    Full Time
                                </div>
                            </div>
                            <p style={{
                                fontSize: '1rem',
                                color: 'var(--text-muted)',
                                lineHeight: '1.6',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                marginBottom: '2rem'
                            }}>
                                {job.description}
                            </p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <span style={{
                                    padding: '0.35rem 0.6rem',
                                    background: 'var(--bg-app)',
                                    color: 'var(--text-subtle)',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>Remote</span>
                                <span style={{
                                    padding: '0.35rem 0.6rem',
                                    background: 'var(--bg-app)',
                                    color: 'var(--text-subtle)',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>IT</span>
                            </div>
                            {user?.role !== 'RECRUITER' && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-primary"
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        fontWeight: 700,
                                        fontSize: '0.9375rem',
                                        boxShadow: '0 4px 12px rgba(95, 37, 159, 0.15)'
                                    }}
                                    onClick={() => handleApply(job.id)}
                                    disabled={user?.role === 'INTERVIEWER'}
                                >
                                    Apply Now
                                    <ChevronRight size={18} />
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {jobs.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '6rem 2rem',
                    background: 'white',
                    borderRadius: '28px',
                    border: '1px dashed var(--border)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'var(--bg-app)',
                        borderRadius: '24px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-subtle)',
                        marginBottom: '1.5rem'
                    }}>
                        <Briefcase size={40} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No open roles right now</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>We're constantly updating our listings. Check back in a few hours!</p>
                </div>
            )}
        </div>
    );
}

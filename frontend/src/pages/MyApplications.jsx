import React, { useState, useEffect } from 'react';
import { jobService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Tag, CheckCircle, Clock, XCircle, FileSearch, Trash2, History, Building2, ExternalLink } from 'lucide-react';

export default function MyApplications({ user }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        if (user && user.role === 'CANDIDATE') {
            fetchApplications();
        }
    }, [user]);

    const fetchApplications = async () => {
        try {
            const res = await jobService.getMyApplications(user.userId);
            setApplications(res || []);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (appId) => {
        if (!window.confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) return;
        try {
            await jobService.withdraw(appId, user.userId);
            fetchApplications();
            if (selectedApp && selectedApp.id === appId) {
                setSelectedApp(null);
            }
        } catch (err) {
            alert(err || 'Failed to withdraw application');
        }
    };

    const fetchHistory = async (appId) => {
        setHistoryLoading(true);
        try {
            const res = await jobService.getHistory(appId);
            setHistory(res || []);
        } catch (err) {
            console.error('Failed to fetch history', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const toggleHistory = (app) => {
        if (selectedApp && selectedApp.id === app.id) {
            setSelectedApp(null);
            setHistory([]);
        } else {
            setSelectedApp(app);
            fetchHistory(app.id);
        }
    };

    const getStatusTheme = (status) => {
        switch (status) {
            case 'SELECTED': return { bg: 'var(--success-bg)', color: 'var(--success)', icon: <CheckCircle size={14} /> };
            case 'REJECTED': return { bg: 'var(--error-bg)', color: 'var(--error)', icon: <XCircle size={14} /> };
            case 'WITHDRAWN': return { bg: 'var(--bg-app)', color: 'var(--text-subtle)', icon: <Trash2 size={14} /> };
            case 'INTERVIEW_SCHEDULED': return { bg: '#fff4e6', color: '#fd7e14', icon: <Calendar size={14} /> };
            case 'APPLIED': return { bg: 'var(--primary-light)', color: 'var(--primary)', icon: <Clock size={14} /> };
            default: return { bg: 'var(--bg-app)', color: 'var(--text-subtle)', icon: <Tag size={14} /> };
        }
    };

    if (!user) return (
        <div style={{ textAlign: 'center', padding: '6rem' }}>
            <div style={{
                width: '80px', height: '80px', background: 'var(--error-bg)', color: 'var(--error)',
                borderRadius: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
            }}>
                <XCircle size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)' }}>Please login as a candidate to view applications.</p>
        </div>
    );

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto 1.5rem' }}></div>
            <p style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>Syncing your career progress...</p>
        </div>
    );

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Track Progress</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)' }}>Real-time updates on your active submissions and history.</p>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {applications.map((app, index) => {
                    const theme = getStatusTheme(app.status);
                    const isSelected = selectedApp?.id === app.id;

                    return (
                        <div key={app.id}>
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="card"
                                style={{
                                    padding: '1.5rem 2rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                                    boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                    background: 'white',
                                    borderRadius: '20px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: 'var(--bg-app)',
                                        borderRadius: '18px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: isSelected ? 'var(--primary)' : 'var(--text-subtle)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <Building2 size={32} />
                                    </div>

                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{app.jobTitle}</h3>
                                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-subtle)', fontSize: '0.875rem', fontWeight: 600 }}>
                                                <Calendar size={14} />
                                                Applied {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
                                                <ExternalLink size={14} />
                                                View Listing
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        padding: '0.5rem 1rem',
                                        background: theme.bg,
                                        color: theme.color,
                                        borderRadius: '100px',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {theme.icon}
                                        {app.status.replace('_', ' ')}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05, background: 'var(--bg-app)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="btn btn-secondary"
                                        style={{ width: '40px', height: '40px', padding: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        onClick={() => toggleHistory(app)}
                                        title="View History"
                                    >
                                        <History size={18} />
                                    </motion.button>

                                    {app.status !== 'WITHDRAWN' && app.status !== 'SELECTED' && app.status !== 'REJECTED' && (
                                        <motion.button
                                            whileHover={{ scale: 1.05, background: 'var(--error-bg)', color: 'var(--error)' }}
                                            whileTap={{ scale: 0.95 }}
                                            className="btn btn-secondary"
                                            style={{ width: '40px', height: '40px', padding: 0, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => handleWithdraw(app.id)}
                                            title="Withdraw Submission"
                                        >
                                            <Trash2 size={18} />
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        <div style={{
                                            background: '#fcfcfd',
                                            padding: '2.5rem',
                                            borderRadius: '24px',
                                            marginLeft: '4rem',
                                            border: '1px solid var(--border-light)',
                                            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)'
                                        }}>
                                            <h4 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                                <Clock size={20} style={{ color: 'var(--primary)' }} />
                                                Application Timeline
                                            </h4>

                                            {historyLoading ? (
                                                <div style={{ padding: '1rem', color: 'var(--text-subtle)' }}>Loading activity logs...</div>
                                            ) : (
                                                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                                                    {/* Vertical track */}
                                                    <div style={{ position: 'absolute', left: '0.35rem', top: '0.5rem', bottom: '0.5rem', width: '2px', background: 'var(--border-light)' }}></div>

                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                                        {history.map((h, i) => (
                                                            <div key={h.id} style={{ position: 'relative' }}>
                                                                {/* Pulse indicator for most recent */}
                                                                <div style={{
                                                                    position: 'absolute',
                                                                    left: '-2.15rem',
                                                                    top: '0.25rem',
                                                                    width: '14px',
                                                                    height: '14px',
                                                                    borderRadius: '50%',
                                                                    background: i === 0 ? 'var(--primary)' : 'var(--border)',
                                                                    border: '4px solid white',
                                                                    boxShadow: i === 0 ? '0 0 0 4px rgba(95, 37, 159, 0.1)' : 'none',
                                                                    zIndex: 2
                                                                }}></div>

                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                    <div>
                                                                        <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: '0.25rem' }}>{h.status.replace('_', ' ')}</div>
                                                                        <p style={{ margin: 0, fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{h.comment || 'No additional details provided.'}</p>
                                                                    </div>
                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700, whiteSpace: 'nowrap', paddingTop: '0.25rem' }}>
                                                                        {new Date(h.changedAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {applications.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: '6rem 2rem',
                    background: 'white',
                    borderRadius: '28px',
                    border: '1px dashed var(--border)',
                }}>
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'inline-flex',
                        padding: '2rem',
                        borderRadius: '24px',
                        background: 'var(--bg-app)',
                        color: 'var(--text-subtle)'
                    }}>
                        <FileSearch size={48} />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>No submissions yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2rem' }}>Ready to start your next chapter? Thousands of roles are waiting.</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                        style={{ padding: '0.875rem 2rem', borderRadius: '12px', fontWeight: 800 }}
                        onClick={() => window.location.href = '/'}
                    >
                        Browse Open Roles
                    </motion.button>
                </div>
            )}
        </div>
    );
}

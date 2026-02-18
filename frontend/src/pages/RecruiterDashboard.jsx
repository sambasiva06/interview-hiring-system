import React, { useState, useEffect } from 'react';
import { jobService, interviewService, userService, dashboardService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    MapPin,
    Users,
    Calendar,
    CheckCircle,
    AlertCircle,
    X,
    ChevronRight,
    Clock,
    Briefcase,
    TrendingUp,
    LayoutDashboard,
    ArrowUpRight,
    Edit2,
    Trash2,
    Mail
} from 'lucide-react';

export default function RecruiterDashboard({ user }) {
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applications, setApplications] = useState([]);
    const [showScheduleForm, setShowScheduleForm] = useState(null);
    const [showJobForm, setShowJobForm] = useState(false);
    const [scheduleData, setScheduleData] = useState({ interviewerId: '', scheduledAt: '' });
    const [jobData, setJobData] = useState({ title: '', description: '', location: '' });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [scheduleError, setScheduleError] = useState('');
    const [jobError, setJobError] = useState('');

    const [interviewers, setInterviewers] = useState([]);
    const [fetchingInterviewers, setFetchingInterviewers] = useState(false);
    const [stats, setStats] = useState(null);
    const [filter, setFilter] = useState('my'); // 'all' or 'my'

    useEffect(() => {
        fetchRecruiterJobs();
        fetchStats();
    }, []);

    useEffect(() => {
        if (showScheduleForm) {
            fetchInterviewers();
        }
    }, [showScheduleForm]);

    const fetchStats = async () => {
        try {
            const res = await dashboardService.getRecruiterStats(user.userId);
            setStats(res);
        } catch (err) {
            console.error('Failed to fetch stats', err);
        }
    };

    const fetchRecruiterJobs = async () => {
        setLoading(true);
        try {
            const res = await jobService.getAllOpen();
            setJobs(res || []);
            if (res && res.length > 0 && !selectedJobId) {
                handleViewApplications(res[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch jobs', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchInterviewers = async () => {
        setFetchingInterviewers(true);
        setScheduleError('');
        try {
            const res = await userService.getInterviewers();
            setInterviewers(res || []);
            if (res && res.length > 0) {
                setScheduleData(prev => ({ ...prev, interviewerId: res[0].userId }));
            }
        } catch (err) {
            setScheduleError('Failed to fetch experts.');
        } finally {
            setFetchingInterviewers(false);
        }
    };

    const handleViewApplications = async (jobId) => {
        try {
            const res = await jobService.getApplicationsForJob(jobId, user.userId);
            setApplications(res || []);
            setSelectedJobId(jobId);
        } catch (err) {
            console.error('Failed to fetch applications', err);
        }
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await interviewService.schedule({
                applicationId: showScheduleForm,
                interviewerId: scheduleData.interviewerId,
                scheduledAt: scheduleData.scheduledAt
            }, user.userId);
            setShowScheduleForm(null);
            if (selectedJobId) handleViewApplications(selectedJobId);
            fetchStats();
        } catch (err) {
            setScheduleError(err || 'Scheduling failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async (appId) => {
        if (!window.confirm('Reject this candidate?')) return;
        try {
            await jobService.reject(appId, user.userId);
            if (selectedJobId) handleViewApplications(selectedJobId);
            fetchStats();
        } catch (err) { console.error(err); }
    };

    const handleCloseJob = async () => {
        if (!window.confirm('Close this role?')) return;
        try {
            await jobService.close(selectedJobId, user.userId);
            setSelectedJobId(null);
            fetchRecruiterJobs();
            fetchStats();
        } catch (err) { console.error(err); }
    };

    const [editingJob, setEditingJob] = useState(null);

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingJob) await jobService.update(editingJob.id, jobData, user.userId);
            else await jobService.create(jobData, user.userId);
            setShowJobForm(false);
            fetchRecruiterJobs();
            fetchStats();
        } catch (err) { setJobError(err || 'Action failed'); }
        finally { setSubmitting(false); }
    };

    const openEditJob = (job) => {
        setEditingJob(job);
        setJobData({ title: job.title, description: job.description, location: job.location });
        setShowJobForm(true);
    };

    const openCreateJob = () => {
        setEditingJob(null);
        setJobData({ title: '', description: '', location: '' });
        setShowJobForm(true);
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="card"
            style={{ padding: '1.5rem', borderLeft: `4px solid ${color}`, background: 'white' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <div style={{ color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.25rem', color: 'var(--text-main)' }}>{value}</div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${color}10`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={24} />
                </div>
            </div>
            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '1rem', color: 'var(--success)', fontSize: '0.8125rem', fontWeight: 700 }}>
                    <TrendingUp size={14} />
                    {trend} vs last month
                </div>
            )}
        </motion.div>
    );

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Analyzing talent pipeline...</p>
        </div>
    );

    const activeJob = jobs.find(j => j.id === selectedJobId);



    const filteredJobs = jobs.filter(job => {
        if (filter === 'my') return job.recruiterId === user.userId;
        return true;
    });

    return (
        <div className="fade-in">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>Recruitment Hub</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Full visibility over your talent acquisition cycle.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary"
                    onClick={openCreateJob}
                    style={{ padding: '0.875rem 2rem', borderRadius: '14px' }}
                >
                    <Plus size={20} />
                    Create New Opening
                </motion.button>
            </header>

            <div className="grid grid-cols-4" style={{ marginBottom: '3rem' }}>
                <StatCard title="Open Positions" value={stats?.totalJobs || 0} icon={Briefcase} color="var(--primary)" />
                <StatCard title="Active Submissions" value={stats?.activeApplications || 0} icon={Users} color="var(--info)" />
                <StatCard title="Scheduled" value={stats?.scheduledInterviews || 0} icon={Calendar} color="var(--warning)" trend="+12%" />
                <StatCard title="Hired" value={stats?.applicationsByStatus?.['SELECTED'] || 0} icon={CheckCircle} color="var(--success)" />
            </div>

            <div className="dashboard-layout">
                {/* Job Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <LayoutDashboard size={20} style={{ color: 'var(--primary)' }} />
                            <h3 style={{ margin: 0, fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-subtle)', letterSpacing: '0.1em' }}>Positions</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '5px', background: 'var(--bg-app)', padding: '4px', borderRadius: '8px' }}>
                            <button
                                onClick={() => setFilter('my')}
                                style={{
                                    border: 'none',
                                    background: filter === 'my' ? 'white' : 'transparent',
                                    color: filter === 'my' ? 'var(--primary)' : 'var(--text-subtle)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    boxShadow: filter === 'my' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                My Jobs
                            </button>
                            <button
                                onClick={() => setFilter('all')}
                                style={{
                                    border: 'none',
                                    background: filter === 'all' ? 'white' : 'transparent',
                                    color: filter === 'all' ? 'var(--primary)' : 'var(--text-subtle)',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    boxShadow: filter === 'all' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                All
                            </button>
                        </div>
                    </div>

                    {filteredJobs.map(job => {
                        const isSelected = selectedJobId === job.id;
                        return (
                            <motion.div
                                key={job.id}
                                onClick={() => handleViewApplications(job.id)}
                                whileHover={{ x: 4 }}
                                style={{
                                    padding: '1.25rem 1.5rem',
                                    background: isSelected ? 'white' : 'transparent',
                                    border: isSelected ? '1px solid var(--primary)' : '1px solid transparent',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    boxShadow: isSelected ? 'var(--shadow-md)' : 'none',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{
                                            margin: 0,
                                            fontSize: '1.125rem',
                                            fontWeight: 800,
                                            color: isSelected ? 'var(--primary)' : 'var(--text-main)'
                                        }}>{job.title}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--text-subtle)', marginTop: '4px' }}>
                                            <MapPin size={14} />
                                            {job.location}
                                        </div>
                                    </div>
                                    {isSelected && <ArrowUpRight size={18} style={{ color: 'var(--primary)' }} />}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Main Content */}
                <div className="card" style={{ minHeight: '600px', display: 'flex', flexDirection: 'column', padding: '2.5rem' }}>
                    {activeJob ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <div style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Active Position</div>
                                    <h2 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 900 }}>{activeJob.title}</h2>
                                    <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-muted)', fontSize: '1rem' }}>
                                        {applications.length} verified candidates in loop
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        className="btn btn-secondary"
                                        style={{ height: '48px', width: '48px', padding: 0, borderRadius: '12px' }}
                                        onClick={() => openEditJob(activeJob)}
                                    >
                                        <Edit2 size={18} />
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05, background: 'var(--error-bg)', color: 'var(--error)' }}
                                        className="btn btn-secondary"
                                        style={{ height: '48px', width: '48px', padding: 0, borderRadius: '12px' }}
                                        onClick={handleCloseJob}
                                    >
                                        <Trash2 size={18} />
                                    </motion.button>
                                </div>
                            </div>

                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                                    <thead>
                                        <tr style={{ textAlign: 'left', fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            <th style={{ padding: '0 1.5rem' }}>Candidate Info</th>
                                            <th style={{ padding: '0 1.5rem' }}>Pipeline Stage</th>
                                            <th style={{ padding: '0 1.5rem' }}>Applied On</th>
                                            <th style={{ padding: '0 1.5rem', textAlign: 'right' }}>Management</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map(app => (
                                            <motion.tr
                                                key={app.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={{ background: 'var(--bg-app)', borderRadius: '20px' }}
                                            >
                                                <td style={{ padding: '1.25rem 1.5rem', borderRadius: '20px 0 0 20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 900, fontSize: '1.125rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                            {app.candidateName?.[0]}
                                                        </div>
                                                        <div>
                                                            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{app.candidateName}</div>
                                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                                <Mail size={12} /> {app.candidateEmail}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem' }}>
                                                    <div className={`badge status-${app.status.toLowerCase().replace('_', '-')}`}>
                                                        {app.status.replace('_', ' ')}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                                    {new Date(app.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </td>
                                                <td style={{ padding: '1.25rem 1.5rem', borderRadius: '0 20px 20px 0', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        {app.status === 'APPLIED' && (
                                                            <>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05 }}
                                                                    className="btn btn-primary"
                                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '10px' }}
                                                                    onClick={() => setShowScheduleForm(app.id)}
                                                                >
                                                                    Schedule
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.05, background: 'var(--error-bg)', color: 'var(--error)' }}
                                                                    className="btn btn-secondary"
                                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '10px' }}
                                                                    onClick={() => handleReject(app.id)}
                                                                >
                                                                    Reject
                                                                </motion.button>
                                                            </>
                                                        )}
                                                        {app.status === 'INTERVIEW_SCHEDULED' && (
                                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning)', background: '#fff7e6', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                                                                ASSESSMENT PENDING
                                                            </div>
                                                        )}
                                                        {(app.status === 'SELECTED' || app.status === 'REJECTED' || app.status === 'WITHDRAWN') && (
                                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 700 }}>PROCESSED</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {applications.length === 0 && (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                                    <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-app)', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                        <Users size={40} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Search globally</h3>
                                    <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No applications for this role yet. Expand your search or refine requirements.</p>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '40px', background: 'var(--bg-app)', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
                                <Briefcase size={60} />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.75rem' }}>Ready to Scale?</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '400px', textAlign: 'center' }}>
                                Select a role from your inventory to manage candidates and accelerate your hiring cycle.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {(showScheduleForm || showJobForm) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="glass"
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                        }}
                    >
                        {showScheduleForm && (
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                className="card"
                                style={{ width: '100%', maxWidth: '500px', padding: '3rem', boxShadow: 'var(--shadow-premium)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>Schedule Interview</h2>
                                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Assign a technical expert for evaluation.</p>
                                    </div>
                                    <button onClick={() => setShowScheduleForm(null)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                                        <X size={24} />
                                    </button>
                                </div>

                                {scheduleError && <div className="badge status-rejected" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', borderRadius: '12px' }}>{scheduleError}</div>}

                                <form onSubmit={handleScheduleSubmit}>
                                    <div className="form-group">
                                        <label>Technical Interviewer</label>
                                        <select
                                            value={scheduleData.interviewerId}
                                            onChange={e => setScheduleData({ ...scheduleData, interviewerId: e.target.value })}
                                            required
                                            disabled={fetchingInterviewers}
                                        >
                                            <option value="">{fetchingInterviewers ? 'Loading interviewers...' : 'Select Interviewer'}</option>
                                            {interviewers.map(i => (
                                                <option key={i.userId} value={i.userId}>
                                                    {i.name} (ID: {i.userId})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Preferred Timeslot</label>
                                        <input
                                            type="datetime-local"
                                            value={scheduleData.scheduledAt}
                                            onChange={e => setScheduleData({ ...scheduleData, scheduledAt: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '56px' }} disabled={submitting || interviewers.length === 0}>
                                            {submitting ? 'Confirming Slot...' : 'Schedule Now'}
                                        </button>
                                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowScheduleForm(null)}>Dismiss</button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {showJobForm && (
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                className="card"
                                style={{ width: '100%', maxWidth: '600px', padding: '3rem', boxShadow: 'var(--shadow-premium)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0 }}>{editingJob ? 'Edit Position' : 'New Opening'}</h2>
                                        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Define the core requirements for this role.</p>
                                    </div>
                                    <button onClick={() => setShowJobForm(false)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
                                        <X size={24} />
                                    </button>
                                </div>

                                {jobError && <div className="badge status-rejected" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', borderRadius: '12px' }}>{jobError}</div>}

                                <form onSubmit={handleJobSubmit}>
                                    <div className="form-group">
                                        <label>Job Title</label>
                                        <input type="text" value={jobData.title} placeholder="e.g. Lead Product Designer"
                                            onChange={e => setJobData({ ...jobData, title: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Primary Location</label>
                                        <input type="text" value={jobData.location} placeholder="e.g. Bengaluru, KA (Remote)"
                                            onChange={e => setJobData({ ...jobData, location: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Position Details</label>
                                        <textarea
                                            value={jobData.description}
                                            rows="4"
                                            placeholder="What does success look like in this role?"
                                            onChange={e => setJobData({ ...jobData, description: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '56px' }} disabled={submitting}>
                                            {submitting ? 'Processing...' : (editingJob ? 'Save Changes' : 'Launch Position')}
                                        </button>
                                        <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowJobForm(false)}>Discard</button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

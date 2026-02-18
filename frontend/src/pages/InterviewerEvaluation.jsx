import React, { useState, useEffect } from 'react';
import { evaluationService, interviewService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquare,
    CheckCircle,
    ChevronRight,
    ClipboardCheck,
    Award,
    Zap,
    ShieldCheck,
    User,
    Briefcase,
    Calendar,
    Clock,
    AlertCircle,
    FileText,
    Target
} from 'lucide-react';

const ScoreInput = ({ label, value, onChange, icon: Icon, description }) => (
    <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontWeight: 800, marginBottom: '4px' }}>
                    <Icon size={18} className="text-primary" />
                    {label}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-subtle)' }}>{description}</div>
            </div>
            <div style={{
                background: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '6px 16px',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 900,
                boxShadow: 'var(--shadow-sm)'
            }}>
                {value}<span style={{ opacity: 0.5, fontSize: '0.75rem', marginLeft: '2px' }}>/10</span>
            </div>
        </div>
        <div className="range-container">
            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={e => onChange(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', marginTop: '8px', fontSize: '0.625rem', color: 'var(--text-quiet)', fontWeight: 700, textTransform: 'uppercase' }}>
                <span>Novice</span>
                <span>Proficient</span>
                <span>Expert</span>
            </div>
        </div>
    </div>
);

export default function InterviewerEvaluation({ user }) {
    const [interviews, setInterviews] = useState([]);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [scores, setScores] = useState({ technical: 7, communication: 7, problemSolving: 7 });
    const [comments, setComments] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchMyAssignments();
    }, []);

    const fetchMyAssignments = async () => {
        setFetching(true);
        try {
            const res = await interviewService.getInterviewsByInterviewer(user.userId);
            // Only show scheduled interviews that haven't been evaluated yet
            setInterviews(res.filter(i => i.status === 'SCHEDULED') || []);
        } catch (err) {
            console.error('Failed to fetch assignments', err);
        } finally {
            setFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedInterview) return;
        setLoading(true);
        try {
            const res = await evaluationService.evaluate({
                interviewId: selectedInterview.id,
                technicalScore: scores.technical,
                communicationScore: scores.communication,
                problemSolvingScore: scores.problemSolving,
                comments
            }, user.userId);

            setResult(res);
            fetchMyAssignments();
        } catch (err) {
            console.error('Failed to submit evaluation', err);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
            <p style={{ marginTop: '1.5rem', color: 'var(--text-subtle)', fontWeight: 700 }}>Synchronizing evaluation datasets...</p>
        </div>
    );

    return (
        <div className="fade-in" style={{ maxWidth: selectedInterview ? '1000px' : '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', textAlign: selectedInterview ? 'left' : 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'var(--bg-app)', color: 'var(--primary)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    <Target size={14} />
                    Evaluation Protocol
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                    Interviewer's Assessment
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Provide data-driven evidence for hiring decisions.</p>
            </header>

            <AnimatePresence mode="wait">
                {result ? (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{ textAlign: 'center', padding: '5rem 3rem', borderRadius: '32px' }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                            style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '40px',
                                background: result.result === 'PASS' ? 'var(--success-light)' : 'var(--error-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2.5rem',
                                color: result.result === 'PASS' ? 'var(--success)' : 'var(--error)'
                            }}
                        >
                            {result.result === 'PASS' ? <Award size={60} /> : <ShieldCheck size={60} />}
                        </motion.div>
                        <h2 style={{ color: result.result === 'PASS' ? 'var(--success)' : 'var(--error)', margin: 0, fontSize: '2.5rem', fontWeight: 900 }}>
                            {result.result === 'PASS' ? 'Strong Hire' : 'No Pass'}
                        </h2>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '400px', margin: '1rem auto' }}>
                            Your comprehensive evaluation for <strong>{selectedInterview?.candidateName}</strong> has been encrypted and recorded.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary"
                            style={{ marginTop: '3rem', padding: '1rem 3rem' }}
                            onClick={() => { setResult(null); setSelectedInterview(null); }}
                        >
                            Review Other Assignments
                        </motion.button>
                    </motion.div>
                ) : !selectedInterview ? (
                    <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                        {interviews.length > 0 ? interviews.map((interview, idx) => (
                            <motion.div
                                key={interview.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.1 } }}
                                whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
                                className="card"
                                onClick={() => setSelectedInterview(interview)}
                                style={{ padding: '2rem', cursor: 'pointer', borderTop: '4px solid var(--primary)', background: 'white' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--bg-app)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <User size={24} />
                                    </div>
                                    <div className="badge status-info" style={{ borderRadius: '8px' }}>Scheduled</div>
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 0.5rem 0' }}>{interview.candidateName}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Briefcase size={16} /> {interview.jobTitle}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: 700 }}>
                                        <Clock size={16} /> {new Date(interview.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                                    Start Assessment
                                    <ChevronRight size={16} />
                                </div>
                            </motion.div>
                        )) : (
                            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 3rem', background: 'white' }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'var(--bg-app)', color: 'var(--text-quiet)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                    <CheckCircle size={40} />
                                </div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Agenda Clear</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>All pending technical evaluations have been processed.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid"
                        style={{ gridTemplateColumns: '350px 1fr', gap: '2.5rem', alignItems: 'start' }}
                    >
                        {/* Context Sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
                            <div className="card" style={{ padding: '2rem', background: 'white' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem' }}>
                                        {selectedInterview.candidateName[0]}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{selectedInterview.candidateName}</h3>
                                        <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Lead Candidate</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <Briefcase size={18} style={{ color: 'var(--text-subtle)', shrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-quiet)' }}>Role</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{selectedInterview.jobTitle}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <Calendar size={18} style={{ color: 'var(--text-subtle)', shrink: 0 }} />
                                        <div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-quiet)' }}>Session Date</div>
                                            <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{new Date(selectedInterview.scheduledAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedInterview(null)}
                                    className="btn btn-secondary"
                                    style={{ width: '100%', marginTop: '2rem', borderRadius: '12px', fontSize: '0.8125rem' }}
                                >
                                    Cancel & Return
                                </button>
                            </div>

                            <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-app)', border: 'none' }}>
                                <div style={{ display: 'flex', gap: '10px', color: 'var(--info)' }}>
                                    <AlertCircle size={18} />
                                    <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.5 }}>
                                        Evaluations are blind by default. Focus on specific behavioral evidence and technical output.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Assessment Form */}
                        <div className="card" style={{ padding: '3.5rem', background: 'white' }}>
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ClipboardCheck size={18} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>Core Competencies</h3>
                                </div>

                                <ScoreInput
                                    label="Technical Breadth & Depth"
                                    description="Ability to solve architectural problems and write optimized code."
                                    value={scores.technical}
                                    icon={Zap}
                                    onChange={v => setScores({ ...scores, technical: v })}
                                />
                                <ScoreInput
                                    label="System Design & Reasoning"
                                    description="Approaching problems with scalability and maintainability in mind."
                                    value={scores.problemSolving}
                                    icon={Target}
                                    onChange={v => setScores({ ...scores, problemSolving: v })}
                                />
                                <ScoreInput
                                    label="Behavioral & Team Fit"
                                    description="Communication clarity, collaboration, and cultural alignment."
                                    value={scores.communication}
                                    icon={MessageSquare}
                                    onChange={v => setScores({ ...scores, communication: v })}
                                />

                                <div style={{ marginTop: '4rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FileText size={18} />
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>Qualitative Feedback</h3>
                                    </div>
                                    <textarea
                                        rows="6"
                                        placeholder="Detailed analysis of performance, areas of strength, and potential flags..."
                                        value={comments}
                                        onChange={e => setComments(e.target.value)}
                                        required
                                        style={{
                                            padding: '1.5rem',
                                            borderRadius: '20px',
                                            background: 'var(--bg-app)',
                                            border: '1px solid var(--border)',
                                            fontSize: '1rem',
                                            lineHeight: 1.6
                                        }}
                                    ></textarea>
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '3.5rem', height: '64px', fontSize: '1.125rem', borderRadius: '16px' }}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                                            <div className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                                            Processing Assessment...
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                                            <CheckCircle size={20} />
                                            Submit Final Evaluation
                                        </div>
                                    )}
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

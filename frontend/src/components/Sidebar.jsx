import React from 'react';
import {
    Briefcase,
    FileText,
    Users,
    LogOut,
    Home,
    CheckCircle,
    Calendar,
    LayoutDashboard,
    Settings,
    Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ role, onNavigate, currentPage, isOpen, onClose }) => {
    const menuItems = {
        CANDIDATE: [
            { id: 'home', label: 'Explore Jobs', icon: Briefcase },
            { id: 'applications', label: 'My Applications', icon: FileText },
        ],
        RECRUITER: [
            { id: 'recruiter', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'jobs', label: 'Job Postings', icon: Briefcase },
        ],
        ADMIN: [
            { id: 'recruiter', label: 'Admin Panel', icon: Shield },
            { id: 'users', label: 'Manage Users', icon: Users },
        ],
        INTERVIEWER: [
            { id: 'interviewer', label: 'Interviews', icon: Calendar },
        ],
    };

    const currentMenu = menuItems[role] || [];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            ></div>

            <div
                className={`sidebar ${isOpen ? 'open' : ''}`}
                style={{
                    width: '280px',
                    background: 'white',
                    borderRight: '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '2rem 1.25rem',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    // responsive classes handle position on mobile
                }}
            >
                <div style={{ marginBottom: '3rem', padding: '0 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            background: 'var(--primary-gradient)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(95, 37, 159, 0.2)'
                        }}>
                            <CheckCircle size={22} />
                        </div>
                        <span style={{
                            fontSize: '1.5rem',
                            fontWeight: 900,
                            letterSpacing: '-0.03em',
                            color: 'var(--text-main)'
                        }}>HireHub</span>
                    </div>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: 'var(--text-subtle)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem',
                        padding: '0 0.75rem'
                    }}>Main Menu</p>
                    {currentMenu.map(item => (
                        <motion.button
                            key={item.id}
                            whileHover={{ x: 4, background: currentPage === item.id ? '' : 'var(--bg-app)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onNavigate(item.id)}
                            style={{
                                padding: '0.875rem 1rem',
                                borderRadius: '14px',
                                border: 'none',
                                background: currentPage === item.id ? 'var(--primary-light)' : 'transparent',
                                color: currentPage === item.id ? 'var(--primary)' : 'var(--text-subtle)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.9375rem',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'left'
                            }}
                        >
                            <item.icon size={20} strokeWidth={currentPage === item.id ? 2.5 : 2} />
                            {item.label}
                        </motion.button>
                    ))}
                </nav>

                <div style={{
                    marginTop: 'auto',
                    padding: '1.25rem',
                    background: 'var(--bg-app)',
                    borderRadius: '20px',
                    border: '1px solid var(--border-light)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--primary)',
                            fontWeight: 800,
                            fontSize: '0.875rem'
                        }}>
                            {role[0]}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: '1.2' }}>System Access</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 600 }}>{role}</p>
                        </div>
                    </div>
                    <button
                        style={{
                            width: '100%',
                            padding: '0.625rem',
                            borderRadius: '10px',
                            border: '1px solid var(--border)',
                            background: 'white',
                            color: 'var(--text-main)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Settings size={14} />
                        Preferences
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;

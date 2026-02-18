import React from 'react';
import { LogOut, Bell, User as UserIcon, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ user, onLogout, onNavigate, currentPage, onMenuClick }) => {
    return (
        <nav style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            padding: '0 2rem',
            height: '72px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow-sm)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {user && (
                    <button
                        className="show-on-mobile"
                        onClick={onMenuClick}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-main)',
                            padding: 0,
                            marginRight: '-0.5rem'
                        }}
                    >
                        <Menu size={24} />
                    </button>
                )}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => onNavigate('home')}
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'var(--primary-gradient)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 800
                    }}>H</div>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #7b3ebf 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>HireHub</span>
                </motion.div>

                {user && (
                    <div style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'var(--bg-app)',
                        borderRadius: '12px',
                        padding: '0 12px',
                        height: '40px',
                        width: '280px',
                        border: '1px solid transparent',
                        transition: 'all 0.2s ease',
                        marginLeft: '1rem'
                    }} className="search-box">
                        <Search size={16} style={{ color: 'var(--text-subtle)' }} />
                        <input
                            type="text"
                            placeholder="Search applications..."
                            style={{
                                border: 'none',
                                background: 'transparent',
                                paddingLeft: '8px',
                                outline: 'none',
                                fontSize: '0.875rem',
                                width: '100%',
                                color: 'var(--text-main)'
                            }}
                        />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                {!user ? (
                    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                        <button
                            className="btn btn-secondary"
                            style={{ border: 'none' }}
                            onClick={() => onNavigate('login')}
                        >
                            Log In
                        </button>
                        <button
                            className="btn btn-primary"
                            style={{ borderRadius: '12px' }}
                            onClick={() => onNavigate('register')}
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            style={{ position: 'relative', color: 'var(--text-subtle)', cursor: 'pointer' }}
                        >
                            <Bell size={22} />
                            <span style={{
                                position: 'absolute',
                                top: '-2px',
                                right: '-2px',
                                width: '8px',
                                height: '8px',
                                background: 'var(--error)',
                                borderRadius: '50%',
                                border: '2px solid white'
                            }}></span>
                        </motion.div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            paddingLeft: '1.25rem',
                            borderLeft: '1px solid var(--border)'
                        }}>
                            <div className="hide-on-mobile" style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: '1.2' }}>{user.name}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-subtle)', fontWeight: 500 }}>{user.role.toLowerCase()}</p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '12px',
                                    background: 'var(--primary-gradient)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 800,
                                    fontSize: '1rem',
                                    boxShadow: '0 4px 12px rgba(95, 37, 159, 0.2)'
                                }}>
                                {user.name?.[0].toUpperCase()}
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.1, color: 'var(--error)' }}
                                onClick={onLogout}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--text-subtle)',
                                    cursor: 'pointer',
                                    padding: 'var(--space-2)',
                                    marginLeft: '4px'
                                }}
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </motion.button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

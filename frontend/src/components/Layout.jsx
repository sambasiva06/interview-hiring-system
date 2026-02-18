import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, user, onLogout, onNavigate, currentPage }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="app-container" style={{ background: 'var(--bg-app)', display: 'flex', minHeight: '100vh' }}>
            {user && (
                <Sidebar
                    role={user.role}
                    onNavigate={(page) => {
                        onNavigate(page);
                        setSidebarOpen(false);
                    }}
                    currentPage={currentPage}
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            )}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', position: 'relative' }}>

                {/* Background Bubbles Container */}
                <div className="bubbles">
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                </div>

                <Navbar
                    user={user}
                    onLogout={onLogout}
                    onNavigate={onNavigate}
                    currentPage={currentPage}
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <main className="main-content" style={{
                    flex: 1,
                    padding: 'max(2rem, 5vw)',
                    maxWidth: '1600px',
                    margin: '0 auto',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default Layout;

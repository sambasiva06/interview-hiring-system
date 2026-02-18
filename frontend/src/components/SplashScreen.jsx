import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SplashScreen = ({ isVisible, onComplete }) => {
    React.useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onComplete();
            }, 3500); // 2.5s (loading bar) + 1s buffer
            return () => clearTimeout(timer);
        }
    }, [isVisible, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        transition: { duration: 0.8, ease: [0.65, 0, 0.35, 1] }
                    }}
                    className="splash-screen"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        backgroundColor: 'var(--primary)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}
                >
                    {/* Main Logo Container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: {
                                duration: 0.8,
                                ease: [0.34, 1.56, 0.64, 1],
                                delay: 0.2
                            }
                        }}
                        exit={{
                            scale: 1.2,
                            opacity: 0,
                            filter: 'blur(10px)',
                            transition: { duration: 0.6 }
                        }}
                        style={{ textAlign: 'center' }}
                    >
                        <div style={{
                            width: '120px',
                            height: '120px',
                            backgroundColor: 'white',
                            borderRadius: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '2rem',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}>
                            <motion.svg
                                width="60"
                                height="60"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                initial={{ pathLength: 0 }}
                                animate={{
                                    pathLength: 1,
                                    transition: { duration: 1.2, delay: 0.5, ease: "easeInOut" }
                                }}
                            >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <polyline points="16 11 18 13 22 9" />
                            </motion.svg>
                        </div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{
                                y: 0,
                                opacity: 1,
                                transition: { duration: 0.6, delay: 0.8 }
                            }}
                            style={{
                                color: 'white',
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                margin: 0,
                                letterSpacing: '-1px'
                            }}
                        >
                            HiringHub
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: 0.7,
                                transition: { duration: 0.6, delay: 1.2 }
                            }}
                            style={{
                                color: 'white',
                                fontSize: '1rem',
                                marginTop: '0.5rem',
                                fontWeight: '500'
                            }}
                        >
                            Excellence in Recruitment
                        </motion.p>
                    </motion.div>

                    {/* Bottom Loading Indicator */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: '100vw',
                            transition: { duration: 2.5, ease: "easeInOut" }
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: '4px',
                            backgroundColor: 'rgba(255,255,255,0.3)'
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;

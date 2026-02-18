import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: {
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1]
                }
            }}
            exit={{
                opacity: 0,
                y: -15,
                transition: { duration: 0.3 }
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageWrapper;

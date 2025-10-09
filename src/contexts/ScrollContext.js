"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';

const ScrollContext = createContext();

export const useScroll = () => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error('useScroll must be used within a ScrollProvider');
    }
    return context;
};

export const ScrollProvider = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 30);
        };

        // Throttle function for performance
        const throttle = (func, limit) => {
            let inThrottle;
            return function () {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        const throttledHandleScroll = throttle(handleScroll, 10);

        window.addEventListener('scroll', throttledHandleScroll);

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, []);

    return (
        <ScrollContext.Provider value={{ isScrolled }}>
            {children}
        </ScrollContext.Provider>
    );
};
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Coins, User, Home, Bell, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children }) => {
    const location = useLocation();
    const navItems = [
        { icon: Home, path: '/', label: 'Inicio' },
        { icon: Calendar, path: '/tasks', label: 'Tareas' },
        { icon: Coins, path: '/tokens', label: 'Tokens' },
        { icon: User, path: '/profile', label: 'Perfil' },
    ];

    return (
        <div className="app-container">
            <header style={{ padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Planit.</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Bell size={20} color="var(--text-muted)" />
                    <User size={20} color="var(--text-muted)" />
                </div>
            </header>

            <main style={{ flex: 1, padding: '0 20px 100px', overflowY: 'auto' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: 'rgba(3, 7, 18, 0.8)', backdropFilter: 'blur(20px)', borderTop: '1px solid var(--glass-border)', padding: '0 10px 10px' }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path === '/tasks' && location.pathname === '/');
                    return (
                        <Link key={item.path} to={item.path} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: isActive ? 'var(--primary)' : 'var(--text-muted)', transition: 'var(--transition)' }}>
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;

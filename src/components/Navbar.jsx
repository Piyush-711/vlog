import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
        { name: 'Categories', path: '/categories' },
        { name: 'About', path: '/about' },
    ];

    return (
        <nav style={{
            background: 'var(--color-header-bg)',
            backdropFilter: 'blur(8px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            borderBottom: '1px solid var(--color-border)'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-primary)' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-primary)' }}></div>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px solid var(--color-primary)' }}></div>
                    </div>
                    <span style={{ color: 'var(--color-text-main)' }}>Utsav Agarwal</span>
                </Link>

                {/* Desktop Nav - Centered */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '32px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            style={{
                                fontWeight: location.pathname === link.path ? '700' : '500',
                                color: location.pathname === link.path ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                                fontSize: '0.95rem'
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions - Login/Signup */}
                <div className="desktop-nav" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <ThemeToggle />
                    {/* Auth buttons passed to admin area only */}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ display: 'none', background: 'none' }}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    left: 0,
                    width: '100%',
                    background: 'var(--color-bg-card)',
                    padding: '20px',
                    boxShadow: 'var(--shadow-soft)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    color: 'var(--color-text-main)'
                }}>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            style={{ fontSize: '1.2rem', fontWeight: '600', textAlign: 'center' }}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--color-border)', margin: '10px 0', paddingTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <ThemeToggle />
                    </div>
                    <Link to="/admin" className="btn btn-primary" style={{ width: '100%' }}>Login / Sign Up</Link>
                </div>
            )}
            <style>
                {`
          @media (max-width: 900px) {
            .desktop-nav { display: none !important; }
            .mobile-toggle { display: block !important; }
          }
        `}
            </style>
        </nav>
    );
};

export default Navbar;

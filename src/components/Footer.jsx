import React from 'react';
import { Facebook, Twitter, Instagram, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ marginTop: 'auto', padding: '40px 0', borderTop: '1px solid var(--color-border)', background: 'white' }}>
            <div className="container" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '24px' }}>
                    <Instagram size={20} className="social-icon" />
                    <Twitter size={20} className="social-icon" />
                    <Facebook size={20} className="social-icon" />
                </div>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                    &copy; {new Date().getFullYear()} A Dilettante. All rights reserved.
                </p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    Made with <Heart size={14} fill="var(--color-primary)" stroke="none" /> for storytellers.
                </p>
            </div>
            <style>
                {`
          .social-icon {
            color: var(--color-text-muted);
            transition: color 0.2s;
            cursor: pointer;
          }
          .social-icon:hover {
            color: var(--color-primary);
          }
        `}
            </style>
        </footer>
    );
};

export default Footer;

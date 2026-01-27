import React from 'react';
import { Link } from 'react-router-dom';
import { Quote, Calendar, Share2 } from 'lucide-react';

const ShayariCard = ({ id, title, text_content, created_at, thumbnail }) => {
    // Title serves as the "Mood" or "Category" label

    // Format date
    const formattedDate = new Date(created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    return (
        <Link
            to={`/shayari/${id}`}
            style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block'
            }}
        >
            <div className="card" style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: thumbnail ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${thumbnail})` : 'var(--color-bg-card)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: thumbnail ? 'white' : 'var(--color-text-main)',
                border: thumbnail ? 'none' : '1px solid var(--color-border)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}>
                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Quote size={32} style={{ color: thumbnail ? 'rgba(255,255,255,0.8)' : 'var(--color-primary)', marginBottom: '24px', opacity: 0.8 }} />

                    <div style={{
                        fontSize: '1.25rem',
                        lineHeight: '1.6',
                        fontStyle: 'italic',
                        fontFamily: "'Playfair Display', serif", // Assuming this font is available or falls back
                        marginBottom: '24px',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}>
                        "{truncateText(text_content, 150)}"
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8, fontSize: '0.85rem' }}>
                        <span style={{
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            fontWeight: '600',
                            borderBottom: `1px solid ${thumbnail ? 'rgba(255,255,255,0.4)' : 'var(--color-primary)'}`,
                            paddingBottom: '2px'
                        }}>
                            {title}
                        </span>
                    </div>
                </div>

                <div style={{
                    padding: '16px 24px',
                    borderTop: thumbnail ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--color-border)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                    background: thumbnail ? 'rgba(0,0,0,0.2)' : 'transparent'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.7 }}>
                        <Calendar size={14} />
                        <span>{formattedDate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', opacity: 0.8 }}>
                        <span>Read More</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ShayariCard;

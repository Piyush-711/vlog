import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, BookOpen, PenTool, User, Calendar } from 'lucide-react';

const ContentCard = ({ id, title, category, thumbnail, preview, date }) => {
    const getIcon = () => {
        if (!category) return <BookOpen size={18} />;

        switch (category.toLowerCase()) {
            case 'vlog': return <PlayCircle size={18} />;
            case 'story': return <BookOpen size={18} />;
            case 'poetry': return <PenTool size={18} />;
            default: return <BookOpen size={18} />;
        }
    };

    return (
        <Link to={`/view/${id}`} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', textDecoration: 'none', color: 'inherit', border: 'none', boxShadow: 'var(--shadow-soft)' }}>
            {/* Thumbnail Area */}
            <div style={{ position: 'relative', paddingTop: '65%', background: '#F3E8FF' }}>
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    /* Abstract Pattern Placeholder if no image */
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 0%, rgb(255, 251, 136) 90%)' }}>
                        <span style={{ color: 'white', opacity: 0.8 }}>{getIcon()}</span>
                    </div>
                )}

                {/* Floating Circle Icon Wrapper for "Type" */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(255, 159, 67, 0.4)'
                }}>
                    {getIcon()}
                </div>
            </div>

            {/* Content Area */}
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4', fontWeight: '800', color: '#2D3436' }}>{title}</h3>

                <div style={{ marginBottom: '20px' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>
                        {/* Fake Author for design */}
                        <span style={{ fontWeight: '600', color: '#B2BEC3', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {category || 'Uncategorized'}
                        </span>
                    </p>
                </div>

                {/* Footer with Avatar and Date */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Avatar Placeholder */}
                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fab1a0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white', fontWeight: 'bold' }}>
                            A
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#636E72' }}>Admin</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#B2BEC3' }}>
                        <Calendar size={12} />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ContentCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';

const BlogCard = ({ id, title, thumbnail, preview, date }) => {
    return (
        <article className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: '#f0f0f0' }}>
                {thumbnail ? (
                    <img
                        src={thumbnail}
                        alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        No Image
                    </div>
                )}
            </div>

            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={14} />
                    <span>{date}</span>
                </div>

                <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '12px', lineHeight: '1.3' }}>
                    <Link to={`/blog/${id}`} style={{ color: 'var(--color-text-main)' }}>
                        {title}
                    </Link>
                </h3>

                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '24px', flex: 1 }}>
                    {preview}
                </p>

                <Link to={`/blog/${id}`} className="btn btn-ghost" style={{ paddingLeft: 0, justifyContent: 'flex-start', gap: '8px', color: 'var(--color-primary)' }}>
                    Read Article <ArrowRight size={18} />
                </Link>
            </div>
        </article>
    );
};

export default BlogCard;

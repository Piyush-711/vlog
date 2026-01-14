import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockApi } from '../lib/supabaseClient';
import { ArrowLeft, Calendar, User, Clock, Loader2 } from 'lucide-react';

const ViewContent = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadItem = async () => {
            setLoading(true);
            try {
                const data = await mockApi.fetchById(id);
                setItem(data);
            } catch (error) {
                console.error("Failed to load item", error);
            } finally {
                setLoading(false);
            }
        };
        loadItem();
    }, [id]);

    if (loading) {
        return (
            <div className="container section" style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
            </div>
        );
    }

    if (!item) {
        return (
            <div className="container section text-center">
                <h2>Content not found</h2>
                <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Go Home</Link>
            </div>
        );
    }

    const isVideo = item.category === 'vlog';
    const isPoetry = item.category === 'poetry';

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '60px 20px' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '32px', fontWeight: '500' }}>
                <ArrowLeft size={18} /> Back to Home
            </Link>

            <div style={{ marginBottom: '32px', textAlign: isPoetry ? 'center' : 'left' }}>
                <span style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: 'var(--color-bg-soft)',
                    color: 'var(--color-secondary-dark)',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    marginBottom: '16px',
                    textTransform: 'capitalize'
                }}>
                    {item.category}
                </span>
                <h1 style={{ fontSize: isPoetry ? '3rem' : '2.5rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '24px', fontFamily: isPoetry ? 'Georgia, serif' : 'var(--font-family-main)' }}>
                    {item.title}
                </h1>

                <div style={{ display: 'flex', gap: '20px', color: 'var(--color-text-muted)', fontSize: '0.9rem', justifyContent: isPoetry ? 'center' : 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={16} /> {item.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={16} /> Admin
                    </div>
                    {/* Fake read time */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={16} /> {isVideo ? '12 min watch' : '5 min read'}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="content-body" style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: isPoetry ? '60px' : '0', boxShadow: isPoetry ? 'var(--shadow-sm)' : 'none' }}>

                {isVideo ? (
                    <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', marginBottom: '40px', background: '#000', aspectRatio: '16/9' }}>
                        {(() => {
                            const getYouTubeId = (url) => {
                                if (!url) return null;
                                const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                const match = url.match(regExp);
                                return (match && match[2].length === 11) ? match[2] : null;
                            };

                            const videoId = getYouTubeId(item.content);

                            if (videoId) {
                                return (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={item.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                );
                            } else if (item.content && (item.content.endsWith('.mp4') || item.content.endsWith('.webm'))) {
                                return (
                                    <video width="100%" height="100%" controls>
                                        <source src={item.content} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                );
                            } else {
                                return (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexDirection: 'column', gap: '16px', padding: '20px', textAlign: 'center' }}>
                                        <p>Video source format not recognized or link is invalid.</p>
                                        {item.content && <a href={item.content} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>Watch on external site</a>}
                                    </div>
                                );
                            }
                        })()}
                    </div>
                ) : (
                    item.thumbnail && !isPoetry && (
                        <img
                            src={item.thumbnail}
                            alt={item.title}
                            style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: '40px', maxHeight: '500px', objectFit: 'cover' }}
                        />
                    )
                )}

                {/* Text Content */}
                {!isVideo && (
                    <div style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        color: 'var(--color-text-main)',
                        whiteSpace: 'pre-wrap',
                        fontFamily: isPoetry ? 'Georgia, serif' : 'var(--font-family-main)',
                        textAlign: isPoetry ? 'center' : 'left',
                        maxWidth: isPoetry ? '600px' : '100%',
                        margin: '0 auto'
                    }}>
                        {item.text_content || item.preview}
                    </div>
                )}

                {isVideo && (
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'var(--color-text-main)' }}>
                        <p>{item.preview}</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ViewContent;

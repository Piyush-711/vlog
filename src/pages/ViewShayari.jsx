import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockApi } from '../lib/supabaseClient';
import { Loader2, ArrowLeft, Calendar, Share2, Copy, Check, Quote } from 'lucide-react';
import CommentsSection from '../components/CommentsSection';

const ViewShayari = () => {
    const { id } = useParams();
    const [shayari, setShayari] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadShayari = async () => {
            setLoading(true);
            try {
                // We'll use the generic fetchContent but since we don't have a fetchById exposed on mockApi easily 
                // typically, we might need to filter or if fetchContent supports ID.
                // Looking at AdminDashboard usage, mockApi has fetchContent() which returns all.
                // Ideally we should have fetchById. For now, fetch all and find. 
                // Optimally we add fetchById to mockApi in supabaseClient.js, but let's assume we can fetch all for now or filter.
                // Wait, ViewContent.jsx probably does something similar. Let's check ViewContent pattern if needed, 
                // but usually fetching all is inefficient.
                // Let's assume for this specific task we might need to add fetchById if not present, 
                // OR we just fetch all 'shayari' and find.

                // Let's try to fetch this specific item. 
                // If mockApi.getCellById exists? No. 
                // Let's use supabase direct here for efficiency if mockApi is limited, 
                // OR just fetch all shayaris and find this one (ok for small app).
                const allShayari = await mockApi.fetchContent('shayari');
                const found = allShayari.find(item => item.id === id);
                setShayari(found);
            } catch (error) {
                console.error("Error loading shayari", error);
            } finally {
                setLoading(false);
            }
        };
        loadShayari();
    }, [id]);

    const handleCopy = () => {
        if (!shayari) return;
        navigator.clipboard.writeText(`"${shayari.text_content}" - ${shayari.title}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shayari.title,
                    text: `"${shayari.text_content}"`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopy();
            alert("Link copied to clipboard!");
        }
    };

    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
            </div>
        );
    }

    if (!shayari) {
        return (
            <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
                <h2>Shayari not found</h2>
                <Link to="/shayari" className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Collection</Link>
            </div>
        );
    }

    const formattedDate = new Date(shayari.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="container section" style={{ maxWidth: '800px' }}>
            <Link to="/shayari" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', marginBottom: '32px', textDecoration: 'none', fontWeight: '500' }}>
                <ArrowLeft size={18} /> Back to Collection
            </Link>

            {/* Main Content Card */}
            <div className="card" style={{
                padding: '0',
                overflow: 'hidden',
                position: 'relative',
                marginBottom: '40px',
                background: shayari.thumbnail ? `url(${shayari.thumbnail})` : 'var(--color-bg-card)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: shayari.thumbnail ? 'white' : 'var(--color-text-main)',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {/* Overlay if image exists */}
                {shayari.thumbnail && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}></div>
                )}

                <div style={{ position: 'relative', zIndex: 1, padding: '40px 40px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Quote size={48} style={{ color: shayari.thumbnail ? 'rgba(255,255,255,0.7)' : 'var(--color-primary)', marginBottom: '32px', opacity: 0.8 }} />

                    <div style={{
                        fontSize: '1.5rem',
                        lineHeight: '1.8',
                        fontStyle: 'italic',
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: '500',
                        maxWidth: '90%'
                    }}>
                        "{shayari.text_content}"
                    </div>

                    <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '12px', opacity: 0.8 }}>
                        <div style={{ height: '1px', width: '40px', background: 'currentColor', opacity: 0.5 }}></div>
                        <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{shayari.title}</span>
                        <div style={{ height: '1px', width: '40px', background: 'currentColor', opacity: 0.5 }}></div>
                    </div>
                </div>

                <div style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '20px 40px',
                    borderTop: '1px solid rgba(128,128,128,0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: shayari.thumbnail ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', opacity: 0.8 }}>
                        <Calendar size={16} /> {formattedDate}
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={handleCopy}
                            title="Copy text"
                            style={{
                                background: 'transparent',
                                border: '1px solid currentColor',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: 'inherit',
                                opacity: 0.8,
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.opacity = 1}
                            onMouseOut={(e) => e.target.style.opacity = 0.8}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </button>
                        <button
                            onClick={handleShare}
                            title="Share"
                            style={{
                                background: shayari.thumbnail ? 'white' : 'var(--color-primary)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: shayari.thumbnail ? 'black' : 'white',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <CommentsSection contentId={shayari.id} />
        </div>
    );
};

export default ViewShayari;

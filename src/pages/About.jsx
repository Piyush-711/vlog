import React, { useEffect, useState } from 'react';
import { mockApi } from '../lib/supabaseClient';
import { Award, Calendar, Image as ImageIcon } from 'lucide-react';

const About = () => {
    const [profile, setProfile] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profileData, galleryData, achievementsData] = await Promise.all([
                    mockApi.fetchProfile(),
                    mockApi.fetchGallery(),
                    mockApi.fetchAchievements()
                ]);
                setProfile(profileData);
                setGallery(galleryData);
                setAchievements(achievementsData);
            } catch (error) {
                console.error("Error loading about data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;
    }

    return (
        <div className="container section">
            {/* 1. Personal Introduction */}
            <div className="about-intro" style={{
                display: 'flex',
                gap: '60px',
                alignItems: 'center',
                marginBottom: '100px',
                flexWrap: 'wrap'
            }}>
                <div style={{ flex: '1 1 400px' }}>
                    <div style={{
                        width: '100%',
                        maxWidth: '400px',
                        aspectRatio: '1/1',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <img
                            src={profile?.thumbnail || 'https://via.placeholder.com/400'}
                            alt="Profile"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
                <div style={{ flex: '1 1 500px' }}>
                    <span className="section-subtitle">About Me</span>
                    <h1 className="section-title">{profile?.title || 'Hello, I a Creative Soul'}</h1>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                        {profile?.text_content || "I haven't written my bio yet! Check back soon."}
                    </div>
                </div>
            </div>

            {/* 2. Achievements Section */}
            <div style={{ marginBottom: '100px' }}>
                <div className="section-header">
                    <span className="section-subtitle">Journey</span>
                    <h2 className="section-title">Achievements & Milestones</h2>
                </div>

                <div className="timeline" style={{ position: 'relative', marginTop: '60px' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '2px',
                        height: '100%',
                        background: 'var(--color-border)',
                        display: 'none' // Hidden on mobile, handled via media query usually, simplified here
                    }}></div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                        {achievements.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>No achievements added yet.</p>
                        ) : (
                            achievements.map((item, index) => (
                                <div key={item.id} className="achievement-card" style={{
                                    display: 'flex',
                                    gap: '24px',
                                    alignItems: 'flex-start',
                                    background: 'white',
                                    padding: '24px',
                                    borderRadius: 'var(--radius-lg)',
                                    boxShadow: 'var(--shadow-sm)',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        background: 'var(--color-bg-alt)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                        color: 'var(--color-primary)'
                                    }}>
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                                        ) : (
                                            <Award size={28} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>{item.title}</h3>
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                fontSize: '0.9rem',
                                                color: 'var(--color-primary)',
                                                fontWeight: '600',
                                                background: '#FFF4E6',
                                                padding: '4px 12px',
                                                borderRadius: '20px'
                                            }}>
                                                <Calendar size={14} />
                                                {item.content} {/* Year stored in content */}
                                            </span>
                                        </div>
                                        <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{item.preview}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Photo Gallery */}
            <div>
                <div className="section-header">
                    <span className="section-subtitle">Visuals</span>
                    <h2 className="section-title">Photo Gallery</h2>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px',
                    marginTop: '40px'
                }}>
                    {gallery.length === 0 ? (
                        <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--color-text-muted)' }}>No photos uploaded yet.</p>
                    ) : (
                        gallery.map((photo) => (
                            <div key={photo.id} style={{
                                position: 'relative',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                aspectRatio: '1/1',
                                group: 'true',
                                cursor: 'pointer'
                            }}>
                                <img
                                    src={photo.thumbnail}
                                    alt={photo.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.4s ease'
                                    }}
                                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                />
                                {photo.title && (
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        width: '100%',
                                        padding: '20px',
                                        background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                        color: 'white',
                                        fontWeight: '500'
                                    }}>
                                        {photo.title}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default About;

import React, { useRef, useState } from 'react';
import { Play, Pause, Music } from 'lucide-react';

const SongCard = ({ title, content, thumbnail, text_content }) => {
    // content = audio URL
    // text_content = Artist / Description
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f0f0f0' }}>
                {thumbnail ? (
                    <img src={thumbnail} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>
                        <Music size={48} />
                    </div>
                )}

                <button
                    onClick={togglePlay}
                    style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                    {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" style={{ marginLeft: '4px' }} />}
                </button>
            </div>

            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '4px', color: 'var(--color-text-main)' }}>{title}</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>{text_content || 'Unknown Artist'}</p>

                <audio
                    ref={audioRef}
                    src={content}
                    onEnded={() => setIsPlaying(false)}
                    controls
                    style={{ width: '100%', marginTop: 'auto', height: '32px' }}
                />
            </div>
        </div>
    );
};

export default SongCard;

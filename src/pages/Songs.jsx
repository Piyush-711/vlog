import React, { useEffect, useState } from 'react';
import { mockApi } from '../lib/supabaseClient';
import SongCard from '../components/SongCard';
import { Loader2, Music } from 'lucide-react';

const Songs = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSongs = async () => {
            setLoading(true);
            try {
                const data = await mockApi.fetchContent('song');
                setSongs(data);
            } catch (error) {
                console.error("Failed to load songs", error);
            } finally {
                setLoading(false);
            }
        };
        loadSongs();
    }, []);

    return (
        <div className="container section">
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px' }}>Music Collection</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Listen to my latest tracks and covers.</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                </div>
            ) : (
                <div className="grid-layout">
                    {songs.length > 0 ? (
                        songs.map(song => (
                            <SongCard key={song.id} {...song} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
                            <Music size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>No songs uploaded yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Songs;

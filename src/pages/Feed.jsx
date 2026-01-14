import React, { useEffect, useState } from 'react';
import { mockApi } from '../lib/supabaseClient';
import ContentCard from '../components/ContentCard';
import { Loader2 } from 'lucide-react';

const Feed = ({ type }) => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                const data = await mockApi.fetchContent(type);
                setContent(data);
            } catch (error) {
                console.error("Failed to load content", error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, [type]); // Refetch when type changes

    const getPageTitle = () => {
        switch (type) {
            case 'story': return 'Written Stories';
            case 'vlog': return 'Video Logs';
            case 'poetry': return 'Poetry Collection';
            default: return 'All Content';
        }
    };

    return (
        <div className="container section">
            <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px' }}>{getPageTitle()}</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Explore our latest collection.</p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                </div>
            ) : (
                <div className="grid-layout">
                    {content.length > 0 ? (
                        content.map(item => (
                            <ContentCard key={item.id} {...item} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
                            No content found in this category yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Feed;

import React, { useEffect, useState } from 'react';
import { mockApi } from '../lib/supabaseClient';
import ContentCard from '../components/ContentCard';
import { Loader2 } from 'lucide-react';

const Explore = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            const data = await mockApi.fetchContent(); // Fetch ALL content
            setContent(data);
            setLoading(false);
        };
        loadContent();
    }, []);

    return (
        <div className="container section">
            <div className="section-header">
                <span className="section-subtitle">Discover</span>
                <h2 className="section-title">Explore All Content</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-text-muted)' }}>
                    Browse through our complete collection of stories, vlogs, and poetry.
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                </div>
            ) : (
                <div className="grid-layout">
                    {content.map(item => (
                        <ContentCard key={item.id} {...item} />
                    ))}
                </div>
            )}

            {!loading && content.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
                    No content found. Be the first to upload something!
                </div>
            )}
        </div>
    );
};

export default Explore;

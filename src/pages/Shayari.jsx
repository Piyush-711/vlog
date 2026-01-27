import React, { useEffect, useState } from 'react';
import { mockApi } from '../lib/supabaseClient';
import ShayariCard from '../components/ShayariCard';
import { Loader2, Feather } from 'lucide-react';

const Shayari = () => {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            try {
                // Fetch content where category is 'shayari'
                const data = await mockApi.fetchContent('shayari');
                setContent(data);
            } catch (error) {
                console.error("Failed to load shayari", error);
            } finally {
                setLoading(false);
            }
        };
        loadContent();
    }, []);

    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '60px', marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <div style={{ padding: '12px', background: 'rgba(255, 159, 67, 0.1)', borderRadius: '50%', color: 'var(--color-primary)' }}>
                        <Feather size={32} />
                    </div>
                </div>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px' }}>Shayari Collection</h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    A curated collection of poetic thoughts, emotions, and expressions.
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin { animation: spin 1s linear infinite; }`}</style>
                </div>
            ) : (
                <>
                    {content.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '32px'
                        }}>
                            {content.map(item => (
                                <ShayariCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                                No shayari added yet. Check back soon.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Shayari;

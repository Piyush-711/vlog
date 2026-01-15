import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ContentCard from '../components/ContentCard';
import CallToAction from '../components/CallToAction';
import { mockApi } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const Home = () => {
    const [latestContent, setLatestContent] = useState([]);
    const [pinnedContent, setPinnedContent] = useState([]);

    useEffect(() => {
        mockApi.fetchContent().then(data => {
            // Get latest 3
            setLatestContent(data.slice(0, 3));
        });

        mockApi.fetchPinned().then(data => {
            setPinnedContent(data);
        });
    }, []);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Hero />

            {/* Pinned / Featured Section */}
            {pinnedContent.length > 0 && (
                <div id="featured-content" className="container section" style={{ paddingBottom: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#2D3436' }}>Featured Stories</h2>
                        <span style={{ fontSize: '0.9rem', background: '#fdcb6e', color: 'black', padding: '4px 12px', borderRadius: '20px', fontWeight: '600' }}>Editor's Pick</span>
                    </div>

                    <div className="grid-layout">
                        {pinnedContent.map(item => (
                            <ContentCard key={item.id} {...item} />
                        ))}
                    </div>
                </div>
            )}

            <div id="latest-content" className="container section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#2D3436' }}>Latest Posts</h2>

                    {/* Simple dots indicator for design feel */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF9F43' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fab1a0' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dfe6e9' }}></div>
                    </div>
                </div>

                <div className="grid-layout">
                    {latestContent.map(item => (
                        <ContentCard key={item.id} {...item} />
                    ))}
                </div>
            </div>

            <CallToAction />
        </div>
    );
};

export default Home;

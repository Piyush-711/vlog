import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import ContentCard from '../components/ContentCard';
import CallToAction from '../components/CallToAction';
import { mockApi } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

const Home = () => {
    const [latestContent, setLatestContent] = useState([]);

    useEffect(() => {
        mockApi.fetchContent().then(data => {
            // Get latest 3
            setLatestContent(data.slice(0, 3));
        });
    }, []);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Hero />

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

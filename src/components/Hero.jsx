import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div style={{
            background: 'linear-gradient(180deg, #F3E8FF 0%, #FFFBF8 100%)', // Soft purple fade to cream
            padding: '80px 0 100px',
            overflow: 'hidden'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap-reverse' }}>

                {/* Text Content */}
                <div style={{ flex: '1 1 500px' }}>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '800',
                        marginBottom: '24px',
                        lineHeight: '1.1',
                        color: '#2D3436'
                    }}>
                        Share Your <br />
                        Vlogs, Stories <br />
                        & <span style={{ color: 'var(--color-primary)' }}>Poetry</span>
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        color: 'var(--color-text-muted)',
                        marginBottom: '40px',
                        maxWidth: '450px',
                        lineHeight: '1.6'
                    }}>
                        Upload your creative works, build an audience, and connect with the world.
                    </p>

                    <button
                        className="btn btn-primary"
                        style={{ padding: '16px 40px', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(255, 159, 67, 0.4)' }}
                        onClick={() => document.getElementById('latest-content').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Upload Now
                    </button>
                </div>

                {/* Illustration */}
                <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ position: 'relative' }}>
                        {/* Decorative blobs */}
                        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(224,195,252,0.4) 0%, rgba(255,255,255,0) 70%)', zIndex: 0 }}></div>

                        {/* Main Image */}
                        <img
                            src="/hero_section_illustration.png" // We will move the generated artifact here
                            alt="Creative people sharing content"
                            style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px', height: 'auto', borderRadius: 'var(--radius-xl)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

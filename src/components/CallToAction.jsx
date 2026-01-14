import React from 'react';
import { UploadCloud } from 'lucide-react';

const CallToAction = () => {
    return (
        <div className="container" style={{ padding: '0 24px 80px', marginTop: '40px' }}>
            <div style={{
                background: 'linear-gradient(120deg, #A29BFE 0%, #E0C3FC 100%)',
                borderRadius: '30px',
                padding: '60px 40px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px -10px rgba(162, 155, 254, 0.4)'
            }}>
                {/* Decorative Circles */}
                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                <div style={{ position: 'absolute', bottom: '-20px', right: '100px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }}></div>

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '16px' }}>
                        Upload Your Story or Vlog!
                    </h2>
                    <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
                        Drag & drop or browse to upload your creative works to share with our community.
                    </p>

                    <a href="/admin" className="btn" style={{
                        background: '#FF9F43',
                        color: 'white',
                        padding: '16px 40px',
                        fontSize: '1.1rem',
                        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }}>
                        Upload Now
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CallToAction;

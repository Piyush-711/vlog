import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Video, Feather } from 'lucide-react';

const CategoryCard = ({ title, icon: Icon, description, link, color }) => (
    <Link to={link} className="card" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '48px 24px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
    }}
        onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.borderColor = color;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'transparent';
        }}
    >
        <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `${color}20`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px'
        }}>
            <Icon size={40} />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '12px' }}>{title}</h3>
        <p style={{ color: 'var(--color-text-muted)' }}>{description}</p>
        <div style={{ marginTop: '24px', fontWeight: '600', color: color }}>Browse &rarr;</div>
    </Link>
);

const Categories = () => {
    return (
        <div className="container section">
            <div className="section-header">
                <span className="section-subtitle">Collections</span>
                <h2 className="section-title">Browse by Category</h2>
            </div>

            <div className="grid">
                <CategoryCard
                    title="Stories"
                    icon={BookOpen}
                    description="Immerse yourself in written tales and personal narratives."
                    link="/stories"
                    color="#FF9F43"
                />
                <CategoryCard
                    title="Vlogs"
                    icon={Video}
                    description="Watch visual journeys and daily adventures."
                    link="/vlogs"
                    color="#54a0ff"
                />
                <CategoryCard
                    title="Poetry"
                    icon={Feather}
                    description="Experience the beauty of rhythm and rhyme."
                    link="/poetry"
                    color="#A29BFE"
                />
            </div>
        </div>
    );
};

export default Categories;

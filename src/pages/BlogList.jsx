import React, { useEffect, useState } from 'react';
import { mockApi } from '../lib/supabaseClient';
import BlogCard from '../components/BlogCard';
import { Loader2, BookOpen } from 'lucide-react';

const BlogList = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPosts = async () => {
            setLoading(true);
            try {
                const data = await mockApi.fetchContent('blog');
                setPosts(data);
            } catch (error) {
                console.error("Failed to load blog posts", error);
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    return (
        <div className="container section">
            <div style={{ marginBottom: '60px', textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
                <span style={{
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    fontSize: '0.9rem',
                    marginBottom: '16px',
                    display: 'block'
                }}>
                    The Blog
                </span>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '24px', lineHeight: '1.1' }}>
                    Thoughts, Stories & <br /> Updates
                </h1>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
                    A collection of long-form articles about my journey, experiences, and things I learn along the way.
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
                    <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
                </div>
            ) : (
                <div className="grid-layout">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <BlogCard key={post.id} {...post} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', color: 'var(--color-text-muted)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
                            <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                            <p>No blog posts published yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BlogList;

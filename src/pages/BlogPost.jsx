import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockApi } from '../lib/supabaseClient';
import { Loader2, ArrowLeft, Calendar, User } from 'lucide-react';
import CommentsSection from '../components/CommentsSection';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPost = async () => {
            setLoading(true);
            try {
                const data = await mockApi.fetchById(id);
                setPost(data);
            } catch (error) {
                console.error("Failed to load blog post", error);
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id]);

    if (loading) {
        return (
            <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="animate-spin" size={40} color="var(--color-primary)" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container section" style={{ textAlign: 'center' }}>
                <h2>Post not found</h2>
                <Link to="/blog" className="btn btn-primary" style={{ marginTop: '20px' }}>Back to Blog</Link>
            </div>
        );
    }

    return (
        <article>
            {/* Header Image */}
            {post.thumbnail && (
                <div style={{
                    height: '60vh',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))',
                        zIndex: 1
                    }}></div>
                    <img
                        src={post.thumbnail}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div className="container" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '100%',
                        zIndex: 2,
                        paddingBottom: '60px'
                    }}>
                        <Link to="/blog" style={{ color: 'white', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontWeight: '600' }}>
                            <ArrowLeft size={20} /> Back to Blog
                        </Link>
                        <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: '800', lineHeight: 1.1, maxWidth: '900px' }}>
                            {post.title}
                        </h1>
                        <div style={{ display: 'flex', gap: '24px', color: 'rgba(255,255,255,0.9)', marginTop: '24px', fontSize: '1.1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={18} /> {post.date}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={18} /> Utsav Agarwal
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Body */}
            <div className="container section" style={{ maxWidth: '800px' }}>
                {!post.thumbnail && (
                    <div style={{ marginBottom: '40px', paddingBottom: '40px', borderBottom: '1px solid var(--color-border)' }}>
                        <Link to="/blog" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontWeight: '600' }}>
                            <ArrowLeft size={20} /> Back to Blog
                        </Link>
                        <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.1 }}>{post.title}</h1>
                        <div style={{ display: 'flex', gap: '24px', color: 'var(--color-text-muted)', marginTop: '16px' }}>
                            <span>{post.date}</span>
                            <span>By Utsav Agarwal</span>
                        </div>
                    </div>
                )}

                <div style={{
                    fontSize: '1.2rem',
                    lineHeight: '1.8',
                    color: 'var(--color-text-main)',
                    whiteSpace: 'pre-wrap'
                }}>
                    {post.text_content}
                </div>
            </div>
        </article>
    );
};

export default BlogPost;

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MessageCircle, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import CommentItem from './CommentItem';

const CommentsSection = ({ contentId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [isAdmin, setIsAdmin] = useState(false);

    // For Auth Redirect
    const location = useLocation();

    useEffect(() => {
        // Check Auth and Admin Status
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user || null;
            setUser(currentUser);

            if (currentUser) {
                checkAdminStatus(currentUser.id);
            } else {
                setIsAdmin(false);
            }
        };

        checkUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            const currentUser = session?.user || null;
            setUser(currentUser);
            if (currentUser) {
                checkAdminStatus(currentUser.id);
            } else {
                setIsAdmin(false);
            }
        });

        fetchComments();

        return () => subscription.unsubscribe();
    }, [contentId]);

    const checkAdminStatus = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', userId)
                .single();

            if (data?.is_admin) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (err) {
            console.error("Error checking admin status:", err);
            setIsAdmin(false);
        }
    };

    const fetchComments = async () => {
        try {
            // Fetch comments and join with profiles ideally, but for now we might rely on basic user data
            // Since we don't have a public profiles table set up in code yet (only auth.users),
            // we will need to adjust. If we used the schema I proposed, users might not have profiles yet.
            // Let's assume we fetch raw comments and maybe display email/meta.

            // To properly thread, we fetch all for this contentId
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('content_id', contentId)
                .order('created_at', { ascending: true }); // Oldest first for chronological discussion or Newest? YouTube is usually engagement based. Let's do Oldest first for threads.

            if (error) console.error("Error fetching comments", error);

            if (data) {
                // Fetch profiles for these comments
                const userIds = [...new Set(data.map(c => c.user_id))];
                let profileMap = {};

                if (userIds.length > 0) {
                    const { data: profiles, error: profilesError } = await supabase
                        .from('profiles')
                        .select('id, full_name, avatar_url')
                        .in('id', userIds);

                    if (profiles) {
                        profiles.forEach(p => {
                            profileMap[p.id] = p;
                        });
                    }
                }

                let commentMap = {};
                let roots = [];

                data.forEach(comment => {
                    comment.replies = [];
                    // Attach profile
                    comment.profiles = profileMap[comment.user_id] || null;
                    commentMap[comment.id] = comment;
                });

                data.forEach(comment => {
                    if (comment.parent_id) {
                        if (commentMap[comment.parent_id]) {
                            commentMap[comment.parent_id].replies.push(comment);
                        }
                    } else {
                        roots.push(comment);
                    }
                });

                // Reverse roots to show Newest threads at top? YouTube shows "Top" by default. 
                // Let's just reverse for "Newest First" on top level, but oldest first on replies.
                setComments(roots.reverse());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmitting(true);

        try {
            const { error } = await supabase.from('comments').insert({
                content_id: contentId,
                user_id: user.id,
                content: newComment,
                parent_id: null
            });

            if (error) throw error;
            setNewComment('');
            fetchComments(); // Refresh
        } catch (err) {
            alert("Failed to post comment");
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleReply = async (parentId, text) => {
        try {
            const { error } = await supabase.from('comments').insert({
                content_id: contentId,
                user_id: user.id,
                content: text,
                parent_id: parentId
            });

            if (error) throw error;
            fetchComments();
        } catch (err) {
            alert("Failed to post reply");
            console.error(err);
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm("Delete this comment?")) return;
        try {
            const { error } = await supabase.from('comments').delete().eq('id', commentId);
            if (error) throw error;
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to delete comment");
        }
    };

    const handleEdit = async (commentId, newContent) => {
        try {
            const { error } = await supabase
                .from('comments')
                .update({ content: newContent })
                .eq('id', commentId);

            if (error) throw error;
            fetchComments();
        } catch (err) {
            console.error(err);
            alert("Failed to update comment");
        }
    };

    // Calculate total comments
    const countComments = (list) => {
        let count = 0;
        list.forEach(c => {
            count += 1 + countComments(c.replies);
        });
        return count;
    };

    return (
        <div className="section" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '60px', marginTop: '60px' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MessageCircle /> {countComments(comments)} Comments
            </h3>

            {/* Comment Input */}
            <div style={{ marginBottom: '48px', display: 'flex', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: user ? '#a29bfe' : '#e0e0e0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    {user ? user.email.charAt(0).toUpperCase() : <SimpleUserIcon size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                    {user ? (
                        <form onSubmit={handlePostComment}>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    style={{
                                        width: '100%',
                                        border: 'none',
                                        borderBottom: '1px solid var(--color-border)',
                                        background: 'transparent',
                                        padding: '12px 0',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        color: 'var(--color-text-main)'
                                    }}
                                    onFocus={(e) => e.target.style.borderBottomColor = 'var(--color-text-main)'}
                                    onBlur={(e) => e.target.style.borderBottomColor = 'var(--color-border)'}
                                />
                                {newComment && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={submitting}
                                            style={{ padding: '8px 24px', fontSize: '0.9rem' }}
                                        >
                                            Comment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>
                    ) : (
                        <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'var(--color-bg-card)' }}>
                            <p style={{ marginBottom: '16px' }}>Log in to comment on this post.</p>
                            <Link
                                to="/login"
                                state={{ from: location }}
                                className="btn btn-primary"
                                style={{ padding: '8px 24px', fontSize: '0.9rem' }}
                            >
                                Login / Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* List */}
            {loading ? (
                <p>Loading comments...</p>
            ) : (
                <div>
                    {comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            user={user}
                            isAdmin={isAdmin}
                            onReply={handleReply}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Simple User Icon helper
const SimpleUserIcon = ({ size }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default CommentsSection;

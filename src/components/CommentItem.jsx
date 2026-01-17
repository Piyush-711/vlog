import React, { useState } from 'react';
import { User, MessageCircle, MoreVertical, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const CommentItem = ({ comment, user, onReply, onDelete, isReply = false }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Format relative time (simple version)
    const timeAgo = (dateFormatted) => {
        const date = new Date(dateFormatted);
        const diffIndex = Math.floor((new Date() - date) / 1000);

        if (diffIndex < 60) return 'just now';

        const minutes = Math.floor(diffIndex / 60);
        if (minutes < 60) return `${minutes}m ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;

        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setSubmitting(true);
        await onReply(comment.id, replyText);
        setReplyText('');
        setSubmitting(false);
        setShowReplyForm(false);
    };

    // Assuming we might join profiles later, but for now we might not have user metadata on the comment object widely available 
    // depending on how fetch works. If comment.profiles is available (via join), use it.
    const authorName = comment.profiles?.full_name || comment.author_email?.split('@')[0] || 'User';

    // Check ownership
    const isOwner = user && user.id === comment.user_id;

    return (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', marginTop: isReply ? '16px' : '0' }}>
            {/* Avatar */}
            <div style={{
                width: isReply ? '32px' : '40px',
                height: isReply ? '32px' : '40px',
                borderRadius: '50%',
                background: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: '0.9rem',
                color: '#7f8c8d'
            }}>
                {authorName.charAt(0).toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                        {authorName}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {timeAgo(comment.created_at)}
                    </span>
                </div>

                {/* Content */}
                <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                    {comment.content}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        style={{
                            background: 'none',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)'
                        }}
                    >
                        Reply
                    </button>

                    {isOwner && (
                        <button
                            onClick={() => onDelete(comment.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                color: '#ff7675'
                            }}
                        >
                            Delete
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                        {user ? (
                            <>
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Write a reply..."
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        borderBottom: '2px solid var(--color-border)',
                                        padding: '8px 0',
                                        background: 'transparent',
                                        color: 'var(--color-text-main)',
                                        outline: 'none',
                                        fontSize: '0.95rem'
                                    }}
                                    autoFocus
                                />
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowReplyForm(false)}
                                        className="btn btn-ghost"
                                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ padding: '8px 20px', fontSize: '0.85rem' }}
                                        disabled={submitting}
                                    >
                                        Reply
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Please login to reply.
                            </div>
                        )}
                    </form>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                user={user}
                                onReply={onReply}
                                onDelete={onDelete}
                                isReply={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;

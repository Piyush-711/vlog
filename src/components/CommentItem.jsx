import React, { useState } from 'react';
import { User, MessageCircle, MoreVertical, Trash2, Edit2, X, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const CommentItem = ({ comment, user, onReply, onDelete, onEdit, isAdmin, isReply = false }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [savingEdit, setSavingEdit] = useState(false);

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

    const handleEditSubmit = async () => {
        if (!editContent.trim() || editContent === comment.content) {
            setIsEditing(false);
            return;
        }
        setSavingEdit(true);
        await onEdit(comment.id, editContent);
        setSavingEdit(false);
        setIsEditing(false);
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
                {isEditing ? (
                    <div style={{ marginBottom: '8px' }}>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '60px',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-bg-card)',
                                color: 'var(--color-text-main)',
                                fontSize: '0.95rem',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                            <button
                                onClick={handleEditSubmit}
                                disabled={savingEdit}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    background: 'var(--color-primary)', color: 'white',
                                    border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer'
                                }}
                            >
                                <Check size={14} /> Save
                            </button>
                            <button
                                onClick={() => { setIsEditing(false); setEditContent(comment.content); }}
                                disabled={savingEdit}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    background: 'transparent', color: 'var(--color-text-muted)',
                                    border: '1px solid var(--color-border)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer'
                                }}
                            >
                                <X size={14} /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '8px', color: 'var(--color-text-main)' }}>
                        {comment.content}
                    </p>
                )}

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

                    {isOwner && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            style={{
                                background: 'none',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                color: 'var(--color-text-muted)'
                            }}
                        >
                            <Edit2 size={14} /> Edit
                        </button>
                    )}

                    {(isOwner || isAdmin) && !isEditing && (
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
                            <Trash2 size={14} /> Delete
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
                                isAdmin={isAdmin}
                                onReply={onReply}
                                onDelete={onDelete}
                                onEdit={onEdit}
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

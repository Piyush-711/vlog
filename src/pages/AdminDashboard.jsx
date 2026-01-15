import React, { useState, useEffect } from 'react';
import { mockApi } from '../lib/supabaseClient';
import { UploadCloud, CheckCircle, Trash2, Edit2, X, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [contentList, setContentList] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        category: 'story',
        thumbnail: '',
        preview: '',
        content: '', // Video link
        text_content: '' // Check for story/poetry
    });

    // Load existing content on mount
    useEffect(() => {
        loadContent();
    }, []);

    const loadContent = async () => {
        const data = await mockApi.fetchContent();
        setContentList(data);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'story',
            thumbnail: '',
            preview: '',
            content: '',
            text_content: ''
        });
        setEditMode(false);
        setCurrentId(null);
    };

    const handleEdit = (item) => {
        setFormData({
            title: item.title,
            category: item.category,
            thumbnail: item.thumbnail || '',
            preview: item.preview || '',
            content: item.content || '',
            text_content: item.text_content || ''
        });
        setCurrentId(item.id);
        setEditMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
            try {
                await mockApi.deleteContent(id);
                loadContent(); // Refresh list
            } catch (error) {
                alert(`Error deleting content: ${error.message}`);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editMode) {
                await mockApi.updateContent(currentId, formData);
                setSuccess('Content updated successfully!');
            } else {
                await mockApi.uploadContent(formData);
                setSuccess('Content uploaded successfully!');
            }

            loadContent(); // Refresh list to show changes

            setTimeout(() => {
                setSuccess('');
                if (!editMode) resetForm(); // Keep form if editing? No, reset is better.
                else resetForm();
            }, 2000);

        } catch (error) {
            console.error(error);
            alert(`Error saving content: ${error.message || error.error_description || "Unknown error"}. Check if table 'content' exists and RLS policies allow write access.`);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="container section" style={{ maxWidth: '900px' }}>
            <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Admin Dashboard</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Manage your platform content.</p>
                </div>
                {editMode && (
                    <button onClick={resetForm} className="btn" style={{ background: '#dfe6e9', color: '#636E72', gap: '8px' }}>
                        <X size={18} /> Cancel Edit
                    </button>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>

                {/* LEFT COLUMN: FORM */}
                <div className="card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: '700', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                        {editMode ? 'Edit Content' : 'Upload New Content'}
                    </h2>

                    {success ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: 'green' }}>
                            <CheckCircle size={48} style={{ margin: '0 auto 16px', color: 'var(--color-primary)' }} />
                            <h3>{success}</h3>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Title */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                                    placeholder="Enter title..."
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'white' }}
                                >
                                    <option value="story">Written Story</option>
                                    <option value="vlog">Video Log</option>
                                    <option value="poetry">Poetry</option>
                                    <option value="profile">Profile Intro</option>
                                    <option value="gallery">Gallery Image</option>
                                    <option value="achievement">Achievement</option>
                                </select>
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Thumbnail URL</label>
                                <input
                                    type="url"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Preview Text */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    {formData.category === 'profile' ? 'Role / Tagline' : (formData.category === 'achievement' ? 'Description' : 'Short Preview')}
                                </label>
                                <textarea
                                    name="preview"
                                    required
                                    value={formData.preview}
                                    onChange={handleChange}
                                    rows={3}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: 'inherit' }}
                                    placeholder="A short description for the card..."
                                />
                            </div>

                            {/* Dynamic Content Fields */}
                            {(formData.category === 'vlog' || formData.category === 'achievement') ? (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                        {formData.category === 'achievement' ? 'Year' : 'Video URL (Embed/Link)'}
                                    </label>
                                    <input
                                        type="text"
                                        name="content"
                                        required={true}
                                        value={formData.content}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                                        placeholder={formData.category === 'achievement' ? 'e.g., 2024' : 'Video source...'}
                                    />
                                </div>
                            ) : (
                                formData.category !== 'gallery' && (
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                            {formData.category === 'profile' ? 'Bio / Introduction' : 'Main Text Content'}
                                        </label>
                                        <textarea
                                            name="text_content"
                                            required={true}
                                            value={formData.text_content}
                                            onChange={handleChange}
                                            rows={10}
                                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: 'inherit' }}
                                            placeholder={formData.category === 'profile' ? 'Tell us about yourself...' : 'Write your story or poem here...'}
                                        />
                                    </div>
                                )
                            )}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                                style={{ marginTop: '10px' }}
                            >
                                {loading ? 'Saving...' : (editMode ? 'Update Content' : 'Publish Content')}
                                {editMode ? <CheckCircle size={18} style={{ marginLeft: '8px' }} /> : <UploadCloud size={18} style={{ marginLeft: '8px' }} />}
                            </button>
                        </form>
                    )}
                </div>

                {/* RIGHT COLUMN: LIST */}
                <div style={{ maxHeight: '800px', overflowY: 'auto' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '24px', fontWeight: '700', paddingBottom: '16px' }}>Existing Content</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {contentList.length === 0 ? (
                            <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No content uploaded yet.</div>
                        ) : (
                            contentList.map(item => (
                                <div key={item.id} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    {/* Tiny Thumbnail */}
                                    <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#eee', overflow: 'hidden', flexShrink: 0 }}>
                                        {item.thumbnail ? (
                                            <img src={item.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '100%', height: '100%', background: 'var(--color-secondary)', opacity: 0.2 }}></div>
                                        )}
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>{item.title}</h4>
                                        <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '600', letterSpacing: '0.5px' }}>{item.category}</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            style={{ padding: '8px', borderRadius: '50%', background: '#F0F0F0', color: 'var(--color-text-main)', cursor: 'pointer' }}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            style={{ padding: '8px', borderRadius: '50%', background: '#ff7675', color: 'white', cursor: 'pointer', border: 'none' }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

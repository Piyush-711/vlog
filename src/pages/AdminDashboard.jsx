import React, { useState, useEffect } from 'react';
import { mockApi } from '../lib/supabaseClient';
import { UploadCloud, CheckCircle, Trash2, Edit2, X, PlusCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [contentList, setContentList] = useState([]);
    const [inputType, setInputType] = useState('url');
    const [file, setFile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');

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
        setFile(null);
        setInputType('url');
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

    const handlePin = async (item) => {
        try {
            await mockApi.togglePin(item.id, item.is_pinned);
            loadContent(); // Refresh list to update star status
        } catch (error) {
            alert(`Error pinning content: ${error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let dataToSave = { ...formData }; // Initialize it first

            if (inputType === 'file' && file) {
                // Upload file to Supabase
                const uploadedUrl = await mockApi.uploadFile(file);

                if (formData.category === 'song') {
                    // For song, file is content
                    dataToSave.content = uploadedUrl;

                    // Keep existing thumbnail URL if present in form, or set to empty if not
                    // The logic below was checking inputType, but we are inside inputType === 'file'
                    // so we rely on formData.thumbnail staying as is (empty or URL)
                    // If user wanted to upload thumbnail for song, they can't do both in this simple form currently
                } else {
                    dataToSave.thumbnail = uploadedUrl;
                }
            }

            // Ensure thumbnail is set if we didn't upload one (e.g. URL mode)
            if (inputType === 'url') {
                dataToSave.thumbnail = formData.thumbnail;
                // And content for video/song/etc
                if (['vlog', 'song', 'achievement'].includes(formData.category)) {
                    dataToSave.content = formData.content;
                }
            }

            // Normalize song content if needed (already handled above roughly)
            // But let's stick to the previous logic's intent but fixed:

            // Re-evaluating the previous complex logic block:
            /* 
               The previous logic was trying to set properties on the not-yet-exist 'dataToSave'.
               Let's simplify.
               We have 'formData' which has the base state.
               We have 'finalThumbnailUrl' logic from lines 94-114 which I didn't include in replacement yet.
            */

            // Let's rewrite the whole handleSubmit block logic cleaner

            // Reset logic
            dataToSave = { ...formData };

            let finalThumbnailUrl = formData.thumbnail;
            let finalContentUrl = formData.content;

            if (inputType === 'file' && file) {
                const uploadedUrl = await mockApi.uploadFile(file);

                if (formData.category === 'song') {
                    finalContentUrl = uploadedUrl;
                    // Thumbnail remains what it was (likely empty or URL string)
                } else {
                    finalThumbnailUrl = uploadedUrl;
                }
            }

            dataToSave.thumbnail = finalThumbnailUrl;
            dataToSave.content = finalContentUrl;

            if (editMode) {
                await mockApi.updateContent(currentId, dataToSave);
                setSuccess('Content updated successfully!');
            } else {
                await mockApi.uploadContent(dataToSave);
                setSuccess('Content uploaded successfully!');
            }

            loadContent(); // Refresh list to show changes

            setTimeout(() => {
                setSuccess('');
                if (!editMode) resetForm();
                else resetForm();
            }, 2000);

        } catch (error) {
            console.error(error);
            console.error("Full error stack:", error);
            alert(`Error saving content: ${error.message || "Unknown error"}. Check console for details.`);
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
                                    <option value="blog">Blog Post</option>
                                    <option value="shayari">Shayari (Quote)</option>
                                    <option value="song">Song / Audio</option>
                                    <option value="vlog">Video Log</option>
                                    <option value="poetry">Poetry</option>
                                    <option value="profile">Profile Intro</option>
                                    <option value="gallery">Gallery Image</option>
                                    <option value="achievement">Achievement</option>
                                </select>
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    {formData.category === 'shayari' ? 'Background Image (Optional)' : 'Thumbnail Source'}
                                </label>
                                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="inputType"
                                            value="url"
                                            checked={inputType === 'url'}
                                            onChange={() => setInputType('url')}
                                        /> URL
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="inputType"
                                            value="file"
                                            checked={inputType === 'file'}
                                            onChange={() => setInputType('file')}
                                        /> Upload File
                                    </label>
                                </div>

                                {inputType === 'url' ? (
                                    <input
                                        type="url"
                                        name="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                                        placeholder="https://..."
                                    />
                                ) : (
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'white' }}
                                    />
                                )}
                            </div>

                            {/* Preview Text */}
                            {(formData.category !== 'shayari') && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                        {formData.category === 'profile' ? 'Role / Tagline' : (formData.category === 'achievement' ? 'Description' : 'Short Preview')}
                                    </label>
                                    <textarea
                                        name="preview"
                                        required={formData.category !== 'shayari'}
                                        value={formData.preview}
                                        onChange={handleChange}
                                        rows={3}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: 'inherit' }}
                                        placeholder={formData.category === 'achievement' ? 'e.g., Awarded for excellence...' : 'A short description for the card...'}
                                    />
                                </div>
                            )}

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
                                            {formData.category === 'profile' ? 'Bio / Introduction' : (
                                                formData.category === 'shayari' ? 'Shayari Content (The Quote)' :
                                                    (formData.category === 'blog' ? 'Blog Content' : 'Main Text Content')
                                            )}
                                        </label>
                                        <textarea
                                            name="text_content"
                                            required={true}
                                            value={formData.text_content}
                                            onChange={handleChange}
                                            rows={10}
                                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem', fontFamily: 'inherit' }}
                                            placeholder={formData.category === 'profile' ? 'Tell us about yourself...' :
                                                (formData.category === 'shayari' ? 'Write your shayari here...' : 'Write your story or poem here...')
                                            }
                                        />
                                    </div>
                                )
                            )}

                            {/* Song Audio Upload */}
                            {formData.category === 'song' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Audio File (MP3)</label>
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="songInputType"
                                                checked={inputType === 'url'} // Reusing inputType state for simplicity, heavily dependent on user flow not mixing inputs
                                                onChange={() => setInputType('url')}
                                            /> URL
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                            <input
                                                type="radio"
                                                name="songInputType"
                                                checked={inputType === 'file'}
                                                onChange={() => setInputType('file')}
                                            /> Upload File
                                        </label>
                                    </div>

                                    {inputType === 'url' ? (
                                        <input
                                            type="url"
                                            name="content"
                                            value={formData.content}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                                            placeholder="https://..."
                                        />
                                    ) : (
                                        <input
                                            type="file"
                                            accept="audio/mpeg, audio/mp3, audio/wav"
                                            onChange={(e) => setFile(e.target.files[0])} // Reusing file state
                                            required={inputType === 'file'}
                                            style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem', background: 'var(--color-input-bg)' }}
                                        />
                                    )}
                                </div>
                            )}

                            {(formData.category === 'song') && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Artist / Description</label>
                                    <input
                                        type="text"
                                        name="text_content"
                                        required
                                        value={formData.text_content}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '1rem' }}
                                        placeholder="e.g. Original Composition"
                                    />
                                </div>
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
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px',
                        borderBottom: '1px solid #eee',
                        paddingBottom: '16px'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Content List</h2>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            style={{
                                padding: '8px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                fontSize: '0.9rem',
                                background: 'white'
                            }}
                        >
                            <option value="all">All Categories</option>
                            <option value="story">Stories</option>
                            <option value="blog">Blog Posts</option>
                            <option value="song">Songs</option>
                            <option value="vlog">Vlogs</option>
                            <option value="poetry">Poetry</option>
                            <option value="shayari">Shayari</option>
                            <option value="profile">Profile</option>
                            <option value="gallery">Gallery</option>
                            <option value="achievement">Achievements</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {contentList
                            .filter(item => filterCategory === 'all' || item.category === filterCategory)
                            .length === 0 ? (
                            <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                                {filterCategory === 'all' ? 'No content uploaded yet.' : `No ${filterCategory} content found.`}
                            </div>
                        ) : (
                            contentList
                                .filter(item => filterCategory === 'all' || item.category === filterCategory)
                                .map(item => (
                                    <div key={item.id} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                                        {/* Tiny Thumbnail */}
                                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#eee', overflow: 'hidden', flexShrink: 0 }}>
                                            {item.thumbnail ? (
                                                <img src={item.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', background: 'var(--color-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,0.2)' }}>
                                                    {/* Simple placeholder icon if needed */}
                                                    #
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '4px' }}>{item.title}</h4>
                                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--color-primary)',
                                                    fontWeight: '700',
                                                    letterSpacing: '0.5px',
                                                    background: 'rgba(255, 159, 67, 0.1)',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px'
                                                }}>
                                                    {item.category}
                                                </span>
                                                {item.category === 'achievement' && (
                                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{item.content}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                onClick={() => handlePin(item)}
                                                style={{ padding: '8px', borderRadius: '50%', background: item.is_pinned ? '#fdcb6e' : '#F0F0F0', color: item.is_pinned ? 'white' : 'var(--color-text-main)', cursor: 'pointer', border: 'none' }}
                                                title={item.is_pinned ? "Unpin" : "Pin to Home"}
                                            >
                                                <Star size={16} fill={item.is_pinned ? "white" : "none"} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(item)}
                                                style={{ padding: '8px', borderRadius: '50%', background: '#F0F0F0', color: 'var(--color-text-main)', cursor: 'pointer', border: 'none' }}
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

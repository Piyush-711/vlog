
import { createClient } from '@supabase/supabase-js';

// Use the credentials provided by the user in the file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// We keep the "mockApi" name to avoid breaking imports in other files,
// but now it calls the REAL database.
const fetchContent = async (type = null) => {
    let query = supabase.from('content').select('*').order('created_at', { ascending: false });

    if (type) {
        query = query.eq('category', type);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase fetch error:", error);
        return [];
    }
    return data || [];
};

const fetchById = async (id) => {
    const { data, error } = await supabase.from('content').select('*').eq('id', id).single();
    if (error) {
        console.error("Supabase fetchById error:", error);
        return null;
    }
    return data;
};

const uploadContent = async (newItem) => {
    const itemToInsert = {
        title: newItem.title,
        category: newItem.category,
        thumbnail: newItem.thumbnail,
        preview: newItem.preview,
        content: newItem.content || null,
        text_content: newItem.text_content || null,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    const { data, error } = await supabase.from('content').insert([itemToInsert]).select();

    if (error) {
        console.error("Supabase upload error:", error);
        throw error;
    }
    return data ? data[0] : null;
};

const updateContent = async (id, updatedItem) => {
    const { data, error } = await supabase.from('content').update(updatedItem).eq('id', id).select();

    if (error) {
        console.error("Supabase update error:", error);
        throw error;
    }
    return data ? data[0] : null;
};

const deleteContent = async (id) => {
    const { error } = await supabase.from('content').delete().eq('id', id);

    if (error) {
        console.error("Supabase delete error:", error);
        throw error;
    }
    return true;
};

const fetchProfile = async () => {
    const data = await fetchContent('profile');
    return data[0] || null;
};

const fetchGallery = async () => {
    return await fetchContent('gallery');
};

const fetchAchievements = async () => {
    return await fetchContent('achievement');
};

const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

    if (uploadError) {
        console.error("Supabase storage upload error:", uploadError);
        throw uploadError;
    }

    const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
    return data.publicUrl;
};

const fetchPinned = async () => {
    const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('is_pinned', true)
        .limit(3);

    if (error) {
        console.error("Supabase fetchPinned error:", error);
        return [];
    }
    return data || [];
};

const togglePin = async (id, currentStatus) => {
    const { error } = await supabase
        .from('content')
        .update({ is_pinned: !currentStatus })
        .eq('id', id);

    if (error) {
        console.error("Supabase togglePin error:", error);
        throw error;
    }
    return true;
};

export const mockApi = {
    fetchContent,
    fetchById,
    uploadContent,
    updateContent,
    deleteContent,
    fetchProfile,
    fetchGallery,
    fetchAchievements,
    uploadFile,
    fetchPinned,
    togglePin
};

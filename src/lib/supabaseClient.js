
import { createClient } from '@supabase/supabase-js';

// Use the credentials provided by the user in the file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// We keep the "mockApi" name to avoid breaking imports in other files,
// but now it calls the REAL database.
export const mockApi = {
    fetchContent: async (type = null) => {
        let query = supabase.from('content').select('*').order('created_at', { ascending: false });

        if (type) {
            query = query.eq('category', type); // Case sensitive in DB usually, ensure DB has lowercase
        }

        const { data, error } = await query;

        if (error) {
            console.error("Supabase fetch error:", error);
            return [];
        }
        return data || [];
    },

    fetchById: async (id) => {
        const { data, error } = await supabase.from('content').select('*').eq('id', id).single();
        if (error) {
            console.error("Supabase fetchById error:", error);
            return null;
        }
        return data;
    },

    uploadContent: async (newItem) => {
        // Transform item if necessary to match DB schema
        const itemToInsert = {
            title: newItem.title,
            category: newItem.category,
            thumbnail: newItem.thumbnail,
            preview: newItem.preview,
            content: newItem.content || null,
            text_content: newItem.text_content || null,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            // created_at is automatic default usually, but we can send it
        };

        const { data, error } = await supabase.from('content').insert([itemToInsert]).select();

        if (error) {
            console.error("Supabase upload error:", error);
            throw error;
        }
        return data ? data[0] : null;
    },

    updateContent: async (id, updatedItem) => {
        const { data, error } = await supabase.from('content').update(updatedItem).eq('id', id).select();

        if (error) {
            console.error("Supabase update error:", error);
            throw error;
        }
        return data ? data[0] : null;
    },

    deleteContent: async (id) => {
        const { error } = await supabase.from('content').delete().eq('id', id);

        if (error) {
            console.error("Supabase delete error:", error);
            throw error;
        }
        return true;
    }
};

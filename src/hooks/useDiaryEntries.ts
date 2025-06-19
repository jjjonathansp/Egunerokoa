import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type DiaryEntry = Database['public']['Tables']['diary_entries']['Row'];
type DiaryEntryInsert = Database['public']['Tables']['diary_entries']['Insert'];
type DiaryEntryUpdate = Database['public']['Tables']['diary_entries']['Update'];

export function useDiaryEntries(diaryId?: string) {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && diaryId) {
      fetchEntries();
    } else {
      setEntries([]);
      setLoading(false);
    }
  }, [user, diaryId]);

  const fetchEntries = async () => {
    if (!diaryId) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('diary_id', diaryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async (entry: Omit<DiaryEntryInsert, 'user_id'>) => {
    if (!user) return { data: null, error: new Error('No user') };

    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert([{ ...entry, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setEntries(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateEntry = async (id: string, updates: DiaryEntryUpdate) => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => 
        prev.map(entry => entry.id === id ? data : entry)
      );
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    entries,
    loading,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
  };
}
import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from './useAuth';

type Diary = Database['public']['Tables']['diaries']['Row'];
type DiaryInsert = Database['public']['Tables']['diaries']['Insert'];
type DiaryUpdate = Database['public']['Tables']['diaries']['Update'];

export function useDiaries() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDiaries();
    } else {
      setDiaries([]);
      setLoading(false);
    }
  }, [user]);

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('diaries')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDiaries(data || []);
    } catch (error) {
      console.error('Error fetching diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDiary = async (diary: Omit<DiaryInsert, 'user_id'>) => {
    if (!user) return { data: null, error: new Error('No user') };

    try {
      const { data, error } = await supabase
        .from('diaries')
        .insert([{ ...diary, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setDiaries(prev => [data, ...prev]);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateDiary = async (id: string, updates: DiaryUpdate) => {
    try {
      const { data, error } = await supabase
        .from('diaries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setDiaries(prev => 
        prev.map(diary => diary.id === id ? data : diary)
      );
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const deleteDiary = async (id: string) => {
    try {
      const { error } = await supabase
        .from('diaries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDiaries(prev => prev.filter(diary => diary.id !== id));
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    diaries,
    loading,
    createDiary,
    updateDiary,
    deleteDiary,
    refetch: fetchDiaries,
  };
}
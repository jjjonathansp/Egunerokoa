import React, { useState } from 'react';
import { Plus, Edit, Trash2, Settings, FileText } from 'lucide-react';
import { useDiaryEntries } from '../hooks/useDiaryEntries';
import { useDiaries } from '../hooks/useDiaries';
import { EntryCard } from './EntryCard';
import { EntryForm } from './EntryForm';
import { DiaryForm } from './DiaryForm';

interface DiaryViewProps {
  diary: any;
}

export function DiaryView({ diary }: DiaryViewProps) {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [entryLoading, setEntryLoading] = useState(false);
  const [diaryLoading, setDiaryLoading] = useState(false);

  const { entries, loading, createEntry, updateEntry, deleteEntry } = useDiaryEntries(diary.id);
  const { updateDiary, deleteDiary } = useDiaries();

  const handleCreateEntry = async (data: { title: string; content: string }) => {
    setEntryLoading(true);
    try {
      const { error } = await createEntry({
        diary_id: diary.id,
        title: data.title,
        content: data.content,
      });
      
      if (!error) {
        setShowEntryForm(false);
      }
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setEntryLoading(false);
    }
  };

  const handleUpdateEntry = async (data: { title: string; content: string }) => {
    if (!editingEntry) return;
    
    setEntryLoading(true);
    try {
      const { error } = await updateEntry(editingEntry.id, data);
      
      if (!error) {
        setEditingEntry(null);
        setShowEntryForm(false);
      }
    } catch (error) {
      console.error('Error updating entry:', error);
    } finally {
      setEntryLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteEntry(entryId);
    }
  };

  const handleUpdateDiary = async (data: { title: string; description: string }) => {
    setDiaryLoading(true);
    try {
      const { error } = await updateDiary(diary.id, data);
      
      if (!error) {
        setShowDiaryForm(false);
      }
    } catch (error) {
      console.error('Error updating diary:', error);
    } finally {
      setDiaryLoading(false);
    }
  };

  const handleDeleteDiary = async () => {
    if (confirm('Are you sure you want to delete this diary? This will also delete all entries.')) {
      await deleteDiary(diary.id);
    }
  };

  const openEditEntry = (entry: any) => {
    setEditingEntry(entry);
    setShowEntryForm(true);
  };

  const closeEntryForm = () => {
    setShowEntryForm(false);
    setEditingEntry(null);
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-100">{diary.title}</h1>
            {diary.description && (
              <p className="text-gray-400 mt-1">{diary.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiaryForm(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-gray-700 transition-colors"
              title="Egunerokoa editatu"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={handleDeleteDiary}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
              title="Egunerokoa ezabatu"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowEntryForm(true)}
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-all duration-200 flex items-center gap-2"
              type="button"
            >
              <Plus className="w-5 h-5 text-gray-900" />
              Sarrera berria
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-900 text-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <span className="ml-3 text-gray-400">Sarrerak kargatzen...</span>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-100 mb-2">Ez dago sarrerarik</h3>
            <p className="text-gray-400 mb-6">Idatzi zure lehen eguneroko sarrera</p>
            <button
              onClick={() => setShowEntryForm(true)}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-all duration-200 flex items-center gap-2 mx-auto"
              type="button"
            >
              <Plus className="w-5 h-5 text-gray-900" />
              Lehen sarrera sortu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onEdit={() => openEditEntry(entry)}
                onDelete={() => handleDeleteEntry(entry.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <EntryForm
        isOpen={showEntryForm}
        onClose={closeEntryForm}
        onSave={editingEntry ? handleUpdateEntry : handleCreateEntry}
        initialData={editingEntry ? { title: editingEntry.title, content: editingEntry.content } : undefined}
        loading={entryLoading}
      />

      <DiaryForm
        isOpen={showDiaryForm}
        onClose={() => setShowDiaryForm(false)}
        onSave={handleUpdateDiary}
        initialData={{ title: diary.title, description: diary.description }}
        loading={diaryLoading}
      />
    </div>
  );
}
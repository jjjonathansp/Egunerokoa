import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface EntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { title: string; content: string }) => void;
  initialData?: { title: string; content: string };
  loading?: boolean;
}

export function EntryForm({ isOpen, onClose, onSave, initialData, loading }: EntryFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || '');
      setContent(initialData?.content || '');
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ title: title.trim(), content });
    }
  };

  const handleClose = () => {
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-semibold text-gray-100">
            {initialData ? 'Sarrera editatu' : 'Sarrera berria'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex flex-col flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <div className="p-6 pb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Izenburua *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Sarreraren izenburua"
                required
              />
            </div>

            <div className="px-6 pb-4 flex-1 flex flex-col">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Edukia
              </label>
              <div className="flex-1 min-h-[200px]">
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 pt-4 border-t border-gray-700 sticky bottom-0 bg-gray-800 z-10">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Utzi
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex-1 bg-yellow-400 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {initialData ? 'Eguneratu' : 'Gorde'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Calendar, Edit, Trash2 } from 'lucide-react';

interface EntryCardProps {
  entry: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContentPreview = (html: string) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    const text = div.textContent || div.innerText || '';
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow duration-200 text-gray-100">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-100 flex-1 pr-4">
          {entry.title}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-gray-700 transition-colors"
            title="Edit entry"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-700 transition-colors"
            title="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
        <Calendar className="w-4 h-4" />
        <span>Created {formatDate(entry.created_at)}</span>
        {entry.updated_at !== entry.created_at && (
          <span>• Updated {formatDate(entry.updated_at)}</span>
        )}
      </div>

      {entry.content && (
        <div className="text-gray-200 leading-relaxed">
          {getContentPreview(entry.content)}
        </div>
      )}
    </div>
  );
}
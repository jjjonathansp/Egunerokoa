import React, { useState } from 'react';
import { BookOpen, LogOut, Menu, X, Plus, FileText, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDiaries } from '../hooks/useDiaries';

interface LayoutProps {
  children: React.ReactNode;
  currentDiary?: any;
  onDiarySelect: (diary: any) => void;
  onCreateDiary: () => void;
  onExportPDF?: () => void;
}

export function Layout({ children, currentDiary, onDiarySelect, onCreateDiary, onExportPDF }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { diaries, loading } = useDiaries();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-80 bg-gray-800 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:block
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Nire Egunerokoak</h1>
                <p className="text-sm text-gray-300">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-200" />
            </button>
          </div>

          {/* Create Diary Button */}
          <div className="p-4">
            <button
              onClick={onCreateDiary}
              className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-300 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Eguneroko berria
            </button>
          </div>
          {/* Diaries List */}
          <div className="flex-1 overflow-y-auto p-4">
            <button
              onClick={onCreateDiary}
              className="w-full mb-4 bg-yellow-400 text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-yellow-300 transition-all duration-200 flex items-center justify-center gap-2"
              type="button"
            >
              <Plus className="w-5 h-5 text-gray-900" />
              Sarrera berria
            </button>
            <div className="space-y-2">
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-gray-300">Egunerokoak kargatzen...</p>
                </div>
              ) : diaries.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300">Ez dago egunerokorik</p>
                  <p className="text-sm text-gray-500">Sortu zure lehen egunerokoa hasteko</p>
                </div>
              ) : (
                diaries.map((diary) => (
                  <button
                    key={diary.id}
                    onClick={() => onDiarySelect(diary)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      currentDiary?.id === diary.id
                        ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-400 ring-opacity-20 text-gray-900'
                        : 'bg-gray-700 border-gray-700 hover:bg-gray-600 text-gray-100'
                    }`}
                  >
                    <h3 className="font-medium truncate">{diary.title}</h3>
                    {diary.description && (
                      <p className="text-sm text-gray-400 mt-1 truncate">{diary.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(diary.updated_at).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700 space-y-2">
            {currentDiary && onExportPDF && (
              <button
                onClick={onExportPDF}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-900 bg-yellow-400 hover:bg-yellow-300 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                PDFra esportatu
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-yellow-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Saioa itxi
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-screen lg:ml-80">
        {/* Navigation Bar - Always visible at the top */}
        <div className="bg-gray-800 shadow-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-200" />
            </button>
            <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-yellow-400" />
                <span className="font-semibold text-white">
                  {currentDiary?.title || "Nire egunerokoa"}
                </span>
              </div>
              {currentDiary?.description && (
                <span className="text-sm text-gray-400 lg:ml-2">{currentDiary.description}</span>
              )}
            </div>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
        {/* Page Content */}
        <div className="flex-1 bg-gray-900">
          {children}
        </div>
      </div>
    </div>
  );
}
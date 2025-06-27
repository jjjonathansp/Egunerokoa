import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useDiaries } from './hooks/useDiaries';
import { useDiaryEntries } from './hooks/useDiaryEntries';
import { AuthForm } from './components/AuthForm';
import { Layout } from './components/Layout';
import { DiaryView } from './components/DiaryView';
import { DiaryForm } from './components/DiaryForm';
import { generateDiaryPDF } from './utils/pdfGenerator';
import { FileText } from 'lucide-react';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { createDiary } = useDiaries();
  const [currentDiary, setCurrentDiary] = useState<any>(null);
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [diaryLoading, setDiaryLoading] = useState(false);

  const { entries: currentEntries } = useDiaryEntries(currentDiary?.id);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  const handleCreateDiary = async (data: { title: string; description: string }) => {
    setDiaryLoading(true);
    try {
      const { data: newDiary, error } = await createDiary(data);
      
      if (!error && newDiary) {
        setCurrentDiary(newDiary);
        setShowDiaryForm(false);
      }
    } catch (error) {
      console.error('Error creating diary:', error);
    } finally {
      setDiaryLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (currentDiary && currentEntries) {
      generateDiaryPDF(currentDiary, currentEntries);
    }
  };

  return (
    <Layout
      currentDiary={currentDiary}
      onDiarySelect={setCurrentDiary}
      onCreateDiary={() => setShowDiaryForm(true)}
      onExportPDF={currentDiary ? handleExportPDF : undefined}
    >
      {currentDiary ? (
        <DiaryView diary={currentDiary} />
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 bg-gray-900 text-gray-100">
          <div className="text-center max-w-md bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
            <FileText className="w-20 h-20 text-gray-700 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-100 mb-3">
              Ongietorri zure eguneroko webgunera!
            </h2>
            <p className="text-gray-400 mb-6">
              Sortu ezazu zure egunerokoa eta hasi zure bizitzako une garrantzitsuenak isladatzen.
            </p>
            <button
              onClick={() => setShowDiaryForm(true)}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-yellow-300 transition-all duration-200"
            >
              Sortu eguneroko berria
            </button>
          </div>
        </div>
      )}

      <DiaryForm
        isOpen={showDiaryForm}
        onClose={() => setShowDiaryForm(false)}
        onSave={handleCreateDiary}
        loading={diaryLoading}
      />
    </Layout>
  );
}

export default App;
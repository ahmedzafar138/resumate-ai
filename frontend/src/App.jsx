import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ScoreCard from './components/ScoreCard';
import KeywordsList from './components/KeywordsList';
import BulletsList from './components/BulletsList';
import axios from 'axios';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (resumeFile, jdFile) => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jdFile);
    try {
      const { data } = await axios.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-300 to-gray-700 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 bg-opacity-70 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-gray-100">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
          ResuMate AI
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Upload your resume and a job description for instant ATS analysis
        </p>

        <UploadForm onAnalyze={handleAnalyze} loading={loading} />

        {error && (
          <div className="mt-6 p-4 bg-red-900 bg-opacity-50 border border-red-400 rounded-xl text-red-200">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <ScoreCard scoreText={result.ats_score} />
            <KeywordsList keywordsText={result.missing_keywords} />
            <BulletsList bulletsText={result.improved_bullets} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
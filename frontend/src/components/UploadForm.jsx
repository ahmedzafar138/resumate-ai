import { useRef } from 'react';

export default function UploadForm({ onAnalyze, loading }) {
  const resumeRef = useRef(null);
  const jdRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const resumeFile = resumeRef.current.files[0];
    const jdFile = jdRef.current.files[0];
    if (!resumeFile || !jdFile) {
      alert('Please select both files.');
      return;
    }
    onAnalyze(resumeFile, jdFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[1.75rem] border border-white/10 bg-white/5 p-6 shadow-[0_15px_60px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-300">Resume (PDF/DOCX)</label>
          <input
            ref={resumeRef}
            type="file"
            accept=".pdf,.docx"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500 text-gray-400 cursor-pointer"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-300">Job Description (PDF/DOCX)</label>
          <input
            ref={jdRef}
            type="file"
            accept=".pdf,.docx"
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500 text-gray-400 cursor-pointer"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </span>
        ) : (
          'Analyze Resume'
        )}
      </button>
    </form>
  );
}
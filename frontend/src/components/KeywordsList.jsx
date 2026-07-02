export default function KeywordsList({ keywordsText }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/60 p-6">
      <h2 className="mb-3 text-xl font-semibold text-gray-200">Missing Keywords</h2>
      <pre className="whitespace-pre-wrap font-sans text-gray-300">{keywordsText}</pre>
    </div>
  );
}
export default function BulletsList({ bulletsText }) {
  return (
    <div className="bg-gray-900 bg-opacity-50 rounded-xl p-6 border border-gray-700">
      <h2 className="text-xl font-semibold mb-3 text-gray-200">✨ Improved Bullets</h2>
      <pre className="whitespace-pre-wrap text-gray-300 font-sans">{bulletsText}</pre>
    </div>
  );
}
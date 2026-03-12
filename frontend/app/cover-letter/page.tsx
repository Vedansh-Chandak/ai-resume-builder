'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function CoverLetterPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [form, setForm] = useState({
    resume_id: '',
    company: '',
    role: '',
    job_description: '',
    tone: 'professional',
    region: 'india',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/api/resume/').then((res) => setResumes(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/resume/cover-letter', {
        ...form,
        resume_id: parseInt(form.resume_id),
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-blue-600 hover:underline text-sm mb-6 block"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cover Letter Generator</h1>
        <p className="text-gray-500 mb-8">AI-generated cover letters tailored to the company</p>

        {!result ? (
          <div className="bg-white p-8 rounded-xl shadow-sm">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Resume
                </label>
                <select
                  value={form.resume_id}
                  onChange={(e) => setForm({ ...form, resume_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Choose a resume...</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description
                </label>
                <textarea
                  value={form.job_description}
                  onChange={(e) => setForm({ ...form, job_description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-32"
                  placeholder="Paste the job description here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['professional', 'conversational', 'bold'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, tone: t })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition ${
                        form.tone === t
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region
                </label>
                <select
                  value={form.region}
                  onChange={(e) => setForm({ ...form, region: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="india">India</option>
                  <option value="usa">USA</option>
                  <option value="uk">UK</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '✉️ Generating...' : 'Generate Cover Letter'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Subject Line */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-xs text-gray-400 uppercase font-medium mb-1">Subject Line</p>
              <p className="text-gray-900 font-medium">{result.subject}</p>
            </div>

            {/* Key Points */}
            {result.key_points?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">💡 Key Points Highlighted</h3>
                <ul className="space-y-2">
                  {result.key_points.map((point: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-blue-500">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cover Letter */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">Cover Letter</h3>
                <button
                  onClick={handleCopy}
                  className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700"
                >
                  {copied ? '✅ Copied!' : '📋 Copy'}
                </button>
              </div>
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {result.cover_letter}
              </div>
            </div>

            <button
              onClick={() => setResult(null)}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm"
            >
              Generate Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
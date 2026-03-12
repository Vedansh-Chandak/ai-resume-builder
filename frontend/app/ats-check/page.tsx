'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function ATSCheckPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [form, setForm] = useState({
    resume_id: '',
    company: '',
    role: '',
    job_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/resume/').then((res) => setResumes(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/resume/ats-check', {
        ...form,
        resume_id: parseInt(form.resume_id),
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'ATS check failed');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-50';
    if (score >= 70) return 'bg-yellow-50';
    return 'bg-red-50';
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">ATS Checker</h1>
        <p className="text-gray-500 mb-8">Industry-grade ATS analysis with 8 dimensions</p>

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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '🔍 Analyzing...' : 'Check ATS Score'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Overall Score */}
            <div className={`p-6 rounded-xl text-center ${getScoreBg(result.overall_score)}`}>
              <p className={`text-6xl font-bold ${getScoreColor(result.overall_score)}`}>
                {result.overall_score}
              </p>
              <p className="text-gray-500 text-sm mt-1">Overall ATS Score</p>
              <p className={`text-2xl font-bold mt-2 ${getScoreColor(result.overall_score)}`}>
                Grade: {result.grade}
              </p>
              <p className="text-gray-600 mt-2 text-sm">{result.verdict}</p>
            </div>

            {/* Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Score Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(result.breakdown || {}).map(([key, val]: any) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium">{val.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${val.score >= 85 ? 'bg-green-500' : val.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${val.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Keywords */}
            {result.matched_keywords?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">✅ Matched Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched_keywords.map((kw: string, i: number) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {result.missing_keywords?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">❌ Missing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw: string, i: number) => (
                    <span key={i} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">💪 Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-green-500">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">🔧 Improvements</h3>
                <div className="space-y-3">
                  {result.improvements.map((imp: any, i: number) => (
                    <div key={i} className={`p-3 rounded-lg text-sm ${imp.priority === 'high' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                      <p className={`font-medium ${imp.priority === 'high' ? 'text-red-700' : 'text-yellow-700'}`}>
                        {imp.priority === 'high' ? '🔴' : '🟡'} {imp.issue}
                      </p>
                      <p className="text-gray-600 mt-1">→ {imp.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recruiter Tips */}
            {result.recruiter_tips?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">💡 Recruiter Tips</h3>
                <ul className="space-y-2">
                  {result.recruiter_tips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-blue-500">→</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm"
            >
              Check Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function SkillGapPage() {
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
      const res = await api.post('/api/resume/skill-gap', {
        ...form,
        resume_id: parseInt(form.resume_id),
      });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const getReadinessColor = (level: string) => {
    if (level === 'Ready') return 'text-green-600 bg-green-50';
    if (level === 'Almost Ready') return 'text-blue-600 bg-blue-50';
    if (level === 'Developing') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Gap Analyzer</h1>
        <p className="text-gray-500 mb-8">Find exactly what skills you need and how to get them</p>

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
                  Target Company
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
                  Target Role
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? '📊 Analyzing...' : 'Analyze Skill Gap'}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">

            {/* Overall Match */}
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <p className="text-6xl font-bold text-blue-600">
                {result.overall_match_percentage}%
              </p>
              <p className="text-gray-500 text-sm mt-1">Overall Match</p>
              <span className={`inline-block mt-3 px-4 py-1 rounded-full text-sm font-medium ${getReadinessColor(result.readiness_level)}`}>
                {result.readiness_level}
              </span>
              <p className="text-gray-600 text-sm mt-3">{result.summary}</p>
            </div>

            {/* Skills Analysis */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Skills Analysis</h3>

              {/* Matched */}
              {result.skills_analysis?.matched_skills?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-green-700 mb-2">✅ Matched Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {result.skills_analysis.matched_skills.map((s: string, i: number) => (
                      <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Critical */}
              {result.skills_analysis?.missing_critical?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-red-700 mb-2">🔴 Missing Critical Skills</p>
                  <div className="space-y-2">
                    {result.skills_analysis.missing_critical.map((s: any, i: number) => (
                      <div key={i} className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-red-800">{s.skill}</p>
                        <p className="text-xs text-red-600 mt-1">{s.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Nice to Have */}
              {result.skills_analysis?.missing_nice_to_have?.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-yellow-700 mb-2">🟡 Nice to Have</p>
                  <div className="space-y-2">
                    {result.skills_analysis.missing_nice_to_have.map((s: any, i: number) => (
                      <div key={i} className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">{s.skill}</p>
                        <p className="text-xs text-yellow-600 mt-1">{s.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transferable */}
              {result.skills_analysis?.transferable_skills?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-2">🔄 Transferable Skills</p>
                  <div className="space-y-2">
                    {result.skills_analysis.transferable_skills.map((s: any, i: number) => (
                      <div key={i} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">
                          {s.current_skill} → {s.transfers_to}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">{s.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Gap */}
            {result.experience_analysis && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">Experience Gap</h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{result.experience_analysis.required_years}</p>
                    <p className="text-xs text-gray-500">Required</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{result.experience_analysis.current_years}</p>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-lg font-bold text-red-600">{result.experience_analysis.gap}</p>
                    <p className="text-xs text-gray-500">Gap</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{result.experience_analysis.quality_assessment}</p>
              </div>
            )}

            {/* Learning Path */}
            {result.learning_path?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">📚 Learning Path</h3>
                <div className="space-y-4">
                  {result.learning_path.map((item: any, i: number) => (
                    <div key={i} className="border border-gray-100 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold text-white bg-blue-600 px-2 py-0.5 rounded mr-2">
                            #{item.priority}
                          </span>
                          <span className="font-semibold text-gray-900">{item.skill}</span>
                        </div>
                        <span className="text-xs text-gray-500">{item.time_to_learn}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.resources?.map((r: any, j: number) => (
                          <a
                            key={j}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline bg-blue-50 px-2 py-1 rounded"
                          >
                            {r.name} ({r.type})
                          </a>
                        ))}
                      </div>
                      {item.milestones?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-medium mb-1">Milestones:</p>
                          <ul className="space-y-0.5">
                            {item.milestones.map((m: string, j: number) => (
                              <li key={j} className="text-xs text-gray-600 flex gap-1">
                                <span>→</span>{m}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {result.timeline && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">⏱ Timeline to Apply</h3>
                <div className="grid grid-cols-3 gap-4 text-center mb-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-bold text-green-700">{result.timeline.optimistic}</p>
                    <p className="text-xs text-gray-500">Optimistic</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-bold text-blue-700">{result.timeline.realistic}</p>
                    <p className="text-xs text-gray-500">Realistic</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-bold text-gray-700">{result.timeline.conservative}</p>
                    <p className="text-xs text-gray-500">Conservative</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {result.timeline.breakdown?.map((b: any, i: number) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-blue-600 font-medium w-24 shrink-0">{b.month}</span>
                      <span className="text-gray-600">{b.focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Actions */}
            {result.immediate_actions?.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3">⚡ Immediate Actions</h3>
                <ul className="space-y-2">
                  {result.immediate_actions.map((action: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-blue-500 font-bold">{i + 1}.</span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Company Tips */}
            {result.company_specific_tips?.length > 0 && (
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-bold text-blue-900 mb-3">
                  🎯 {form.company} Specific Tips
                </h3>
                <ul className="space-y-2">
                  {result.company_specific_tips.map((tip: string, i: number) => (
                    <li key={i} className="text-sm text-blue-800 flex gap-2">
                      <span>→</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setResult(null)}
              className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm"
            >
              Analyze Another
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function GeneratePage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [form, setForm] = useState({
    resume_id: '',
    company: '',
    role: '',
    job_description: '',
    region: 'india',
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
      const res = await api.post('/api/resume/generate', {
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

  const boldText = (text: string, atsDetails: any) => {
    if (!text) return text;
    const actionVerbs = atsDetails?.action_verbs_found || [];
    const keywords = atsDetails?.matched_keywords || [];
    let result = text;

    result = result.replace(
      /(\b\d+[\+\%]?\s?(?:users|accounts|ms|seconds|hours|days|months|years|%|\+)?\b)/g,
      '<b>$1</b>'
    );
    keywords.forEach((kw: string) => {
      const regex = new RegExp(`\\b(${kw})\\b`, 'gi');
      result = result.replace(regex, '<b>$1</b>');
    });
    actionVerbs.forEach((verb: string) => {
      const regex = new RegExp(`\\b(${verb})\\b`, 'gi');
      result = result.replace(regex, '<b>$1</b>');
    });
    return result;
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Generate Resume</h1>
        <p className="text-gray-500 mb-8">AI-powered ATS optimized resume generator</p>

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
                {loading ? '🤖 Generating... (this may take 30s)' : 'Generate Resume'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm space-y-6">

            {/* Header */}
            <div className="border-b pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {result.resume?.name}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {result.resume?.email} · {result.resume?.phone}
                </p>
              </div>
              <div className="text-center bg-green-50 px-4 py-2 rounded-xl">
                <p className="text-3xl font-bold text-green-600">{result.ats_score}</p>
                <p className="text-xs text-gray-500">ATS Score</p>
                <p className="text-xs font-medium text-green-700">
                  Grade: {result.resume?.ats_score_details?.grade}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                Summary
              </h3>
              <p
                className="text-gray-700 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: boldText(result.resume?.summary, result.resume?.ats_score_details)
                }}
              />
            </div>

            {/* Experience */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Experience
              </h3>
              {result.resume?.experience?.map((exp: any, i: number) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">{exp.title}</p>
                      <p className="text-blue-600 text-sm">{exp.company}</p>
                    </div>
                    <p className="text-gray-400 text-xs">{exp.dates}</p>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {exp.bullets?.map((b: string, j: number) => (
                      <li key={j} className="text-sm text-gray-700 flex gap-2">
                        <span className="text-blue-400 mt-1">▸</span>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: boldText(b, result.resume?.ats_score_details)
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Projects */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Projects
              </h3>
              {result.resume?.projects?.map((proj: any, i: number) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold text-gray-900">{proj.name}</p>
                  <p
                    className="text-sm text-gray-600 mt-1"
                    dangerouslySetInnerHTML={{
                      __html: boldText(proj.description, result.resume?.ats_score_details)
                    }}
                  />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.tech?.map((t: string, j: number) => (
                      <span key={j} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.resume?.skills?.map((skill: string, i: number) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                Education
              </h3>
              {result.resume?.education?.map((edu: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                  </div>
                  <p className="text-gray-400 text-sm">{edu.year}</p>
                </div>
              ))}
            </div>

            {/* Achievements */}
            {result.resume?.achievements && result.resume.achievements.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Achievements
                </h3>
                <ul className="space-y-1">
                  {result.resume.achievements.map((ach: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-yellow-400 mt-1">★</span>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: boldText(ach, result.resume?.ats_score_details)
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ATS Analysis */}
            {result.resume?.ats_score_details && (
              <div className="bg-gray-50 p-4 rounded-xl">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                  ATS Analysis
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {Object.entries(result.resume.ats_score_details.breakdown || {}).map(([key, val]: any) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-gray-900">{val.score}/100</span>
                    </div>
                  ))}
                </div>
                {result.resume.ats_score_details.improvements?.map((imp: any, i: number) => (
                  <div key={i} className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded mt-1">
                    <span className="font-medium">⚠ {imp.priority}:</span> {imp.fix}
                  </div>
                ))}
              </div>
            )}

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
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

  return (
    <main style={{ background: '#050508', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        h1,h2,h3 { font-family: 'Syne', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fillBar {
          from { width: 0; }
        }

        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.1s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s 0.2s ease forwards; opacity: 0; }

        .back-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.25);
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0;
          transition: color 0.2s;
        }
        .back-btn:hover { color: rgba(255,255,255,0.7); }

        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s;
          border-radius: 2px;
        }
        .input-field:focus {
          background: rgba(255,255,255,0.04);
          border-color: rgba(150,120,255,0.35);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.1); }
        select.input-field option { background: #0f0f18; }

        .textarea-field {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: #fff;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s;
          border-radius: 2px;
          height: 160px;
          resize: vertical;
        }
        .textarea-field:focus {
          background: rgba(255,255,255,0.04);
          border-color: rgba(150,120,255,0.35);
        }
        .textarea-field::placeholder { color: rgba(255,255,255,0.1); }

        .submit-btn {
          width: 100%;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 16px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .submit-btn:hover:not(:disabled) {
          background: rgba(150,120,255,0.1);
          border-color: rgba(150,120,255,0.3);
          color: rgba(180,160,255,1);
        }
        .submit-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .label {
          font-size: 10px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          display: block;
          margin-bottom: 8px;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          border-top-color: rgba(255,255,255,0.6);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }

        .ats-bar {
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
          margin-top: 8px;
          overflow: hidden;
        }
        .ats-bar-fill {
          height: 100%;
          border-radius: 1px;
          animation: fillBar 1s ease forwards;
        }

        .kw-tag {
          display: inline-block;
          padding: 4px 10px;
          font-size: 11px;
          border-radius: 2px;
          margin: 3px;
          letter-spacing: 0.03em;
        }

        .result-section {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          padding-bottom: 32px;
          margin-bottom: 32px;
        }
        .result-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .section-label {
          font-size: 10px;
          color: rgba(255,255,255,0.18);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 20px;
        }

        .again-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.3);
          padding: 12px 24px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .again-btn:hover {
          border-color: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
        }

        .imp-item {
          border-left-width: 1px;
          border-left-style: solid;
          padding-left: 16px;
          margin-bottom: 16px;
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        padding: '20px 56px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'sticky',
        top: 0,
        background: 'rgba(5,5,8,0.96)',
        backdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <div
          style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '15px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          RESUMAI
        </div>
        <button className="back-btn" onClick={() => router.push('/dashboard')}>
          ← Dashboard
        </button>
      </nav>

      {!result ? (
        /* FORM */
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 56px' }}>

          <div className="fade-up" style={{ marginBottom: '56px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>
              — Step 03
            </p>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              Check your<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>ATS score.</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '20px', lineHeight: 1.7, fontWeight: 300 }}>
              Industry-grade 8-dimension ATS analysis used by top companies like Google, Amazon and Microsoft.
            </p>
          </div>

          {error && (
            <div style={{ borderLeft: '1px solid rgba(255,80,80,0.4)', paddingLeft: '16px', color: 'rgba(255,100,100,0.8)', fontSize: '13px', marginBottom: '32px' }}>
              {error}
            </div>
          )}

          <form className="fade-up-2" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label className="label">Select Resume</label>
              <select
                className="input-field"
                value={form.resume_id}
                onChange={(e) => setForm({ ...form, resume_id: e.target.value })}
                required
              >
                <option value="">Choose a resume...</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="label">Company</label>
                <input
                  className="input-field"
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Google"
                />
              </div>
              <div>
                <label className="label">Role</label>
                <input
                  className="input-field"
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Software Engineer"
                />
              </div>
            </div>

            <div>
              <label className="label">Job Description</label>
              <textarea
                className="textarea-field"
                value={form.job_description}
                onChange={(e) => setForm({ ...form, job_description: e.target.value })}
                placeholder="Paste the job description here..."
                required
              />
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" />Analyzing...</> : 'Check ATS Score →'}
            </button>
          </form>

          <div className="fade-up-3" style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
              — 8 Dimensions scored
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {['Keyword Match', 'Skills Match', 'Experience', 'Education', 'Format', 'Achievements', 'Action Verbs', 'Completeness'].map((dim, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.12)', fontFamily: 'Syne', fontWeight: 700, minWidth: '20px' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)' }}>{dim}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      ) : (
        /* RESULT */
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 56px' }}>

          {/* Score header */}
          <div className="fade-up" style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px' }}>
              — ATS Analysis Complete
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '16px' }}>
              <div style={{
                fontSize: 'clamp(80px, 12vw, 120px)',
                fontWeight: 800,
                fontFamily: 'Syne',
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: result.overall_score >= 85 ? 'rgba(80,220,120,0.9)' : result.overall_score >= 70 ? 'rgba(220,180,80,0.9)' : 'rgba(220,80,80,0.9)',
              }}>
                {result.overall_score}
              </div>
              <div style={{ paddingBottom: '12px' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Syne', color: 'rgba(255,255,255,0.3)', letterSpacing: '-0.03em' }}>
                  {result.grade}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>Grade</div>
              </div>
            </div>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.35)', fontWeight: 300 }}>
              {result.verdict}
            </p>
          </div>

          <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

            {/* Score breakdown */}
            <div className="result-section">
              <p className="section-label">— Score Breakdown</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(result.breakdown || {}).map(([key, val]: any) => (
                  <div key={key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textTransform: 'capitalize' }}>
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span style={{ fontSize: '13px', fontFamily: 'Syne', fontWeight: 700, color: val.score >= 85 ? 'rgba(80,220,120,0.8)' : val.score >= 70 ? 'rgba(220,180,80,0.8)' : 'rgba(220,80,80,0.8)' }}>
                        {val.score}
                      </span>
                    </div>
                    <div className="ats-bar">
                      <div
                        className="ats-bar-fill"
                        style={{
                          width: `${val.score}%`,
                          background: val.score >= 85 ? 'rgba(80,220,120,0.5)' : val.score >= 70 ? 'rgba(220,180,80,0.5)' : 'rgba(220,80,80,0.5)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="result-section">
              <p className="section-label">— Keywords</p>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '11px', color: 'rgba(80,220,120,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Matched
                </p>
                <div>
                  {result.matched_keywords?.map((kw: string, i: number) => (
                    <span key={i} className="kw-tag" style={{ background: 'rgba(80,220,120,0.06)', color: 'rgba(80,220,120,0.7)', border: '1px solid rgba(80,220,120,0.15)' }}>
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              {result.missing_keywords?.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', color: 'rgba(220,80,80,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                    Missing
                  </p>
                  <div>
                    {result.missing_keywords?.map((kw: string, i: number) => (
                      <span key={i} className="kw-tag" style={{ background: 'rgba(220,80,80,0.06)', color: 'rgba(220,80,80,0.7)', border: '1px solid rgba(220,80,80,0.15)' }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Strengths */}
            {result.strengths?.length > 0 && (
              <div className="result-section">
                <p className="section-label">— Strengths</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.strengths.map((s: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(80,220,120,0.5)', fontSize: '10px', marginTop: '4px' }}>✓</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Improvements */}
            {result.improvements?.length > 0 && (
              <div className="result-section">
                <p className="section-label">— Improvements</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {result.improvements.map((imp: any, i: number) => (
                    <div key={i} className="imp-item" style={{ borderLeftColor: imp.priority === 'high' ? 'rgba(220,80,80,0.3)' : 'rgba(220,180,80,0.3)' }}>
                      <p style={{ fontSize: '10px', color: imp.priority === 'high' ? 'rgba(220,80,80,0.6)' : 'rgba(220,180,80,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
                        {imp.priority} priority
                      </p>
                      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>{imp.issue}</p>
                      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>→ {imp.fix}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recruiter tips */}
            {result.recruiter_tips?.length > 0 && (
              <div className="result-section">
                <p className="section-label">— Recruiter Tips</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.recruiter_tips.map((tip: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(150,120,255,0.5)', fontSize: '10px', marginTop: '4px' }}>→</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fade-up-3" style={{ marginTop: '48px', display: 'flex', gap: '12px' }}>
            <button className="again-btn" onClick={() => setResult(null)}>Check Another</button>
            <button className="again-btn" onClick={() => router.push('/dashboard')}>Dashboard →</button>
          </div>
        </div>
      )}
    </main>
  );
}
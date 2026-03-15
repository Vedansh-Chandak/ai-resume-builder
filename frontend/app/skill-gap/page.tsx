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

  const readinessColor = (level: string) => {
    if (level === 'Ready') return 'rgba(80,220,120,0.8)';
    if (level === 'Almost Ready') return 'rgba(100,160,255,0.8)';
    if (level === 'Developing') return 'rgba(220,180,80,0.8)';
    return 'rgba(220,80,80,0.8)';
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

        .result-section {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          padding-bottom: 40px;
          margin-bottom: 40px;
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
          margin-bottom: 24px;
        }

        .skill-pill {
          display: inline-block;
          padding: 5px 12px;
          font-size: 12px;
          border-radius: 2px;
          margin: 3px;
        }

        .learning-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 24px;
          border-radius: 2px;
          margin-bottom: 12px;
          transition: all 0.3s;
        }
        .learning-card:hover {
          background: rgba(255,255,255,0.035);
          border-color: rgba(150,120,255,0.15);
        }

        .resource-link {
          display: inline-block;
          font-size: 11px;
          color: rgba(150,120,255,0.6);
          text-decoration: none;
          border: 1px solid rgba(150,120,255,0.15);
          padding: 4px 10px;
          border-radius: 2px;
          margin: 3px;
          transition: all 0.2s;
        }
        .resource-link:hover {
          background: rgba(150,120,255,0.08);
          color: rgba(150,120,255,0.9);
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

        .timeline-row {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 20px 24px;
          border-radius: 2px;
          text-align: center;
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
              — Step 04
            </p>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              Analyze your<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>skill gap.</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '20px', lineHeight: 1.7, fontWeight: 300 }}>
              Find exactly what skills you're missing and get a personalized learning path with timeline.
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
                <label className="label">Target Company</label>
                <input
                  className="input-field"
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Google"
                  required
                />
              </div>
              <div>
                <label className="label">Target Role</label>
                <input
                  className="input-field"
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="Software Engineer"
                  required
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
              {loading ? <><span className="spinner" />Analyzing...</> : 'Analyze Skill Gap →'}
            </button>
          </form>
        </div>

      ) : (
        /* RESULT */
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 56px' }}>

          {/* Header */}
          <div className="fade-up" style={{ marginBottom: '64px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '24px' }}>
              — Skill Gap Analysis
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '20px' }}>
              <div style={{
                fontSize: 'clamp(80px, 12vw, 120px)',
                fontWeight: 800,
                fontFamily: 'Syne',
                letterSpacing: '-0.05em',
                lineHeight: 1,
                color: readinessColor(result.readiness_level),
              }}>
                {result.overall_match_percentage}%
              </div>
              <div style={{ paddingBottom: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne', color: readinessColor(result.readiness_level) }}>
                  {result.readiness_level}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '4px' }}>Overall Match</div>
              </div>
            </div>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, fontWeight: 300, maxWidth: '600px' }}>
              {result.summary}
            </p>
          </div>

          <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Skills Analysis */}
            <div className="result-section">
              <p className="section-label">— Skills Analysis</p>

              {result.skills_analysis?.matched_skills?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(80,220,120,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    Matched
                  </p>
                  <div>
                    {result.skills_analysis.matched_skills.map((s: string, i: number) => (
                      <span key={i} className="skill-pill" style={{ background: 'rgba(80,220,120,0.06)', color: 'rgba(80,220,120,0.7)', border: '1px solid rgba(80,220,120,0.15)' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.skills_analysis?.missing_critical?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(220,80,80,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    Missing Critical
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.skills_analysis.missing_critical.map((s: any, i: number) => (
                      <div key={i} style={{ borderLeft: '1px solid rgba(220,80,80,0.2)', paddingLeft: '16px' }}>
                        <p style={{ fontSize: '13px', color: 'rgba(220,80,80,0.7)', fontWeight: 500 }}>{s.skill}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{s.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.skills_analysis?.missing_nice_to_have?.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(220,180,80,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    Nice to Have
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.skills_analysis.missing_nice_to_have.map((s: any, i: number) => (
                      <div key={i} style={{ borderLeft: '1px solid rgba(220,180,80,0.2)', paddingLeft: '16px' }}>
                        <p style={{ fontSize: '13px', color: 'rgba(220,180,80,0.7)', fontWeight: 500 }}>{s.skill}</p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{s.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.skills_analysis?.transferable_skills?.length > 0 && (
                <div>
                  <p style={{ fontSize: '11px', color: 'rgba(100,160,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px' }}>
                    Transferable
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.skills_analysis.transferable_skills.map((s: any, i: number) => (
                      <div key={i} style={{ borderLeft: '1px solid rgba(100,160,255,0.2)', paddingLeft: '16px' }}>
                        <p style={{ fontSize: '13px', color: 'rgba(100,160,255,0.7)', fontWeight: 500 }}>
                          {s.current_skill} → {s.transfers_to}
                        </p>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{s.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Experience Gap */}
            {result.experience_analysis && (
              <div className="result-section">
                <p className="section-label">— Experience Gap</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  {[
                    { label: 'Required', value: result.experience_analysis.required_years, color: 'rgba(255,255,255,0.6)' },
                    { label: 'Current', value: result.experience_analysis.current_years, color: 'rgba(100,160,255,0.7)' },
                    { label: 'Gap', value: result.experience_analysis.gap, color: 'rgba(220,80,80,0.7)' },
                  ].map((item, i) => (
                    <div key={i} className="stat-box">
                      <div style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Syne', color: item.color, letterSpacing: '-0.02em' }}>
                        {item.value}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                  {result.experience_analysis.quality_assessment}
                </p>
              </div>
            )}

            {/* Learning Path */}
            {result.learning_path?.length > 0 && (
              <div className="result-section">
                <p className="section-label">— Learning Path</p>
                {result.learning_path.map((item: any, i: number) => (
                  <div key={i} className="learning-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', fontFamily: 'Syne', fontWeight: 700, minWidth: '20px' }}>
                          #{item.priority}
                        </span>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em', color: 'rgba(255,255,255,0.8)' }}>
                          {item.skill}
                        </h3>
                      </div>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.03em' }}>
                        {item.time_to_learn}
                      </span>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      {item.resources?.map((r: any, j: number) => (
                        <a key={j} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                          {r.name}
                        </a>
                      ))}
                    </div>
                    {item.milestones?.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {item.milestones.map((m: string, j: number) => (
                          <div key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <span style={{ color: 'rgba(150,120,255,0.4)', fontSize: '10px', marginTop: '3px' }}>→</span>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Timeline */}
            {result.timeline && (
              <div className="result-section">
                <p className="section-label">— Timeline to Apply</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                  {[
                    { label: 'Optimistic', value: result.timeline.optimistic, color: 'rgba(80,220,120,0.7)' },
                    { label: 'Realistic', value: result.timeline.realistic, color: 'rgba(100,160,255,0.7)' },
                    { label: 'Conservative', value: result.timeline.conservative, color: 'rgba(255,255,255,0.4)' },
                  ].map((item, i) => (
                    <div key={i} className="stat-box">
                      <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Syne', color: item.color, letterSpacing: '-0.02em' }}>
                        {item.value}
                      </div>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '4px' }}>
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.timeline.breakdown?.map((b: any, i: number) => (
                    <div key={i} className="timeline-row">
                      <span style={{ fontSize: '11px', color: 'rgba(150,120,255,0.5)', fontFamily: 'Syne', fontWeight: 700, minWidth: '100px', letterSpacing: '0.03em' }}>
                        {b.month}
                      </span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>{b.focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Actions */}
            {result.immediate_actions?.length > 0 && (
              <div className="result-section">
                <p className="section-label">— Immediate Actions</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.immediate_actions.map((action: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.15)', fontFamily: 'Syne', fontWeight: 700, minWidth: '20px', marginTop: '2px' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Company Tips */}
            {result.company_specific_tips?.length > 0 && (
              <div className="result-section">
                <p className="section-label">— {form.company} Specific Tips</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.company_specific_tips.map((tip: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(150,120,255,0.4)', fontSize: '10px', marginTop: '4px' }}>→</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="fade-up-3" style={{ marginTop: '48px', display: 'flex', gap: '12px' }}>
            <button className="again-btn" onClick={() => setResult(null)}>Analyze Another</button>
            <button className="again-btn" onClick={() => router.push('/dashboard')}>Dashboard →</button>
          </div>
        </div>
      )}
    </main>
  );
}
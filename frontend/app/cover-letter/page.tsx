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

  const tones = [
    { value: 'professional', label: 'Professional', desc: 'Formal & structured' },
    { value: 'conversational', label: 'Conversational', desc: 'Warm & approachable' },
    { value: 'bold', label: 'Bold', desc: 'Confident & direct' },
  ];

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

        .tone-btn {
          flex: 1;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.4);
          padding: 14px 16px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
          text-align: left;
          border-radius: 2px;
        }
        .tone-btn:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7);
        }
        .tone-btn.active {
          background: rgba(150,120,255,0.08);
          border-color: rgba(150,120,255,0.3);
          color: rgba(180,160,255,0.9);
        }

        .copy-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          padding: 10px 20px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .copy-btn:hover {
          background: rgba(150,120,255,0.08);
          border-color: rgba(150,120,255,0.25);
          color: rgba(150,120,255,0.8);
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
              — Step 05
            </p>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              Generate cover<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>letter.</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '20px', lineHeight: 1.7, fontWeight: 300 }}>
              Company-specific cover letters with deep research into culture, values, and what they look for.
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
                  required
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

            {/* Tone selector */}
            <div>
              <label className="label">Tone</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {tones.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    className={`tone-btn ${form.tone === t.value ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, tone: t.value })}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '2px', fontSize: '13px' }}>{t.label}</div>
                    <div style={{ fontSize: '11px', opacity: 0.6 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="label">Region</label>
              <select
                className="input-field"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                <option value="india">India</option>
                <option value="usa">USA</option>
                <option value="uk">UK</option>
              </select>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? <><span className="spinner" />Generating...</> : 'Generate Cover Letter →'}
            </button>
          </form>
        </div>

      ) : (
        /* RESULT */
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 56px' }}>

          <div className="fade-up" style={{ marginBottom: '56px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>
              — Cover Letter Generated
            </p>
            <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              {result.company}<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>{result.role}</span>
            </h1>
            <div style={{ display: 'flex', gap: '12px', marginTop: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(150,120,255,0.6)', border: '1px solid rgba(150,120,255,0.2)', padding: '4px 10px', borderRadius: '2px', textTransform: 'capitalize' }}>
                {result.tone} tone
              </span>
            </div>
          </div>

          <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column' }}>

            {/* Subject */}
            {result.subject && (
              <div className="result-section">
                <p className="section-label">— Subject Line</p>
                <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                  {result.subject}
                </p>
              </div>
            )}

            {/* Key Points */}
            {result.key_points?.length > 0 && (
              <div className="result-section">
                <p className="section-label">— Key Points</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.key_points.map((point: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(80,220,120,0.5)', fontSize: '10px', marginTop: '4px' }}>✓</span>
                      <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            <div className="result-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <p className="section-label" style={{ margin: 0 }}>— Cover Letter</p>
                <button className="copy-btn" onClick={handleCopy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.015)',
                border: '1px solid rgba(255,255,255,0.04)',
                padding: '32px',
                borderRadius: '2px',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.8,
                fontWeight: 300,
              }}>
                {result.cover_letter}
              </div>
            </div>
          </div>

          <div className="fade-up-3" style={{ marginTop: '48px', display: 'flex', gap: '12px' }}>
            <button className="again-btn" onClick={() => setResult(null)}>Generate Another</button>
            <button className="again-btn" onClick={() => router.push('/dashboard')}>Dashboard →</button>
          </div>
        </div>
      )}
    </main>
  );
}
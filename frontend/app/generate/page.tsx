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

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const resume = result.resume;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${resume.name} - Resume</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Inter', sans-serif; color: #111; background: #fff; padding: 48px; font-size: 13px; line-height: 1.6; }
          .header { border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 24px; }
          .name { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 6px; }
          .contact { font-size: 12px; color: #555; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #888; border-bottom: 1px solid #eee; padding-bottom: 6px; margin-bottom: 14px; }
          .exp-title { font-weight: 600; font-size: 14px; }
          .exp-company { color: #555; font-size: 12px; }
          .exp-date { color: #888; font-size: 11px; float: right; }
          .exp-header { overflow: hidden; margin-bottom: 6px; }
          ul { padding-left: 16px; margin-top: 4px; }
          li { margin-bottom: 3px; font-size: 12px; color: #333; }
          .skills { display: flex; flex-wrap: wrap; gap: 6px; }
          .skill { border: 1px solid #ddd; padding: 3px 8px; font-size: 11px; border-radius: 2px; color: #444; }
          .proj-name { font-weight: 600; font-size: 13px; margin-bottom: 3px; }
          .proj-desc { font-size: 12px; color: #444; margin-bottom: 4px; }
          .edu-degree { font-weight: 600; font-size: 13px; }
          .edu-inst { color: #555; font-size: 12px; }
          .ach-item { font-size: 12px; color: #333; margin-bottom: 4px; }
          @media print { body { padding: 32px; } @page { margin: 0.5cm; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="name">${resume.name}</div>
          <div class="contact">${[resume.email, resume.phone, resume.linkedin, resume.github].filter(Boolean).join(' · ')}</div>
        </div>
        ${resume.summary ? `<div class="section"><div class="section-title">Summary</div><p style="color:#333;font-size:12px;">${resume.summary}</p></div>` : ''}
        ${resume.experience?.length ? `
          <div class="section">
            <div class="section-title">Experience</div>
            ${resume.experience.map((exp: any) => `
              <div style="margin-bottom:16px">
                <div class="exp-header">
                  <span class="exp-date">${exp.dates}</span>
                  <div class="exp-title">${exp.title}</div>
                  <div class="exp-company">${exp.company}</div>
                </div>
                <ul>${exp.bullets?.map((b: string) => `<li>${b}</li>`).join('') || ''}</ul>
              </div>
            `).join('')}
          </div>` : ''}
        ${resume.projects?.length ? `
          <div class="section">
            <div class="section-title">Projects</div>
            ${resume.projects.map((proj: any) => `
              <div style="margin-bottom:14px">
                <div class="proj-name">${proj.name}</div>
                <div class="proj-desc">${proj.description}</div>
                <div class="skills">${proj.tech?.map((t: string) => `<span class="skill">${t}</span>`).join('') || ''}</div>
              </div>
            `).join('')}
          </div>` : ''}
        ${resume.skills?.length ? `
          <div class="section">
            <div class="section-title">Skills</div>
            <div class="skills">${resume.skills.map((s: string) => `<span class="skill">${s}</span>`).join('')}</div>
          </div>` : ''}
        ${resume.education?.length ? `
          <div class="section">
            <div class="section-title">Education</div>
            ${resume.education.map((edu: any) => `
              <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                <div>
                  <div class="edu-degree">${edu.degree}</div>
                  <div class="edu-inst">${edu.institution}</div>
                </div>
                <div style="color:#888;font-size:12px">${edu.year || ''}</div>
              </div>
            `).join('')}
          </div>` : ''}
        ${resume.achievements?.length ? `
          <div class="section">
            <div class="section-title">Achievements</div>
            ${resume.achievements.map((a: string) => `<div class="ach-item">★ ${a}</div>`).join('')}
          </div>` : ''}
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
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
        @keyframes fillBar { from { width: 0; } }

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
        select.input-field option { background: #0f0f18; color: #fff; }

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

        .section-title {
          font-size: 10px;
          color: rgba(255,255,255,0.18);
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 16px;
        }

        .resume-section {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          padding-bottom: 32px;
          margin-bottom: 32px;
        }
        .resume-section:last-child {
          border-bottom: none;
          padding-bottom: 0;
          margin-bottom: 0;
        }

        .skill-tag {
          display: inline-block;
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.4);
          padding: 4px 10px;
          font-size: 12px;
          border-radius: 2px;
          margin: 3px;
          transition: all 0.2s;
        }
        .skill-tag:hover {
          border-color: rgba(150,120,255,0.3);
          color: rgba(150,120,255,0.8);
        }

        .ats-bar {
          height: 2px;
          background: rgba(255,255,255,0.05);
          border-radius: 1px;
          margin-top: 6px;
          overflow: hidden;
        }
        .ats-bar-fill {
          height: 100%;
          border-radius: 1px;
          transition: width 1s ease;
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

        .pdf-btn {
          background: rgba(150,120,255,0.08);
          border: 1px solid rgba(150,120,255,0.25);
          color: rgba(150,120,255,0.8);
          padding: 12px 24px;
          font-size: 12px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .pdf-btn:hover {
          background: rgba(150,120,255,0.15);
          border-color: rgba(150,120,255,0.4);
          color: rgba(180,160,255,1);
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
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '80px 56px' }}>
          <div className="fade-up" style={{ marginBottom: '56px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>
              — Step 02
            </p>
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
              Generate your<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>resume.</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '20px', lineHeight: 1.7, fontWeight: 300 }}>
              RAG-powered generation using real hired resumes from your target company.
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
              {loading ? <><span className="spinner" />Generating... (30s)</> : 'Generate Resume →'}
            </button>
          </form>

          <div className="fade-up-3" style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
              — How it works
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { num: '01', text: 'Scrapes real hired resumes from Reddit, GitHub, Common Crawl' },
                { num: '02', text: 'RAG pipeline retrieves most similar resumes for your target role' },
                { num: '03', text: 'LLM generates optimized resume, loops until ATS score ≥ 80' },
              ].map((step) => (
                <div key={step.num} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', fontFamily: 'Syne', fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px', minWidth: '24px' }}>
                    {step.num}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.6 }}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '80px 56px' }}>

          <div className="fade-up" style={{ marginBottom: '56px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>
                  — Generated Resume
                </p>
                <h1 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
                  {result.resume?.name}
                </h1>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', marginTop: '12px' }}>
                  {result.resume?.email} · {result.resume?.phone}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: '64px', fontWeight: 800, fontFamily: 'Syne',
                  letterSpacing: '-0.04em', lineHeight: 1,
                  color: result.ats_score >= 85 ? 'rgba(80,220,120,0.9)' : result.ats_score >= 70 ? 'rgba(220,180,80,0.9)' : 'rgba(220,80,80,0.9)'
                }}>
                  {result.ats_score}
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ATS Score</div>
                <div style={{ fontSize: '16px', fontFamily: 'Syne', fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                  Grade {result.resume?.ats_score_details?.grade}
                </div>
              </div>
            </div>
          </div>

          <div className="fade-up-2" style={{ display: 'flex', flexDirection: 'column' }}>

            <div className="resume-section">
              <p className="section-title">— Summary</p>
              <p
                style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, fontWeight: 300 }}
                dangerouslySetInnerHTML={{ __html: boldText(result.resume?.summary, result.resume?.ats_score_details) }}
              />
            </div>

            <div className="resume-section">
              <p className="section-title">— Experience</p>
              {result.resume?.experience?.map((exp: any, i: number) => (
                <div key={i} style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontFamily: 'Syne', letterSpacing: '-0.01em' }}>
                        {exp.title}
                      </p>
                      <p style={{ fontSize: '12px', color: 'rgba(150,120,255,0.6)', marginTop: '2px' }}>{exp.company}</p>
                    </div>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>{exp.dates}</p>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {exp.bullets?.map((b: string, j: number) => (
                      <li key={j} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                        <span style={{ color: 'rgba(150,120,255,0.4)', fontSize: '10px', marginTop: '5px', flexShrink: 0 }}>▸</span>
                        <span
                          style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}
                          dangerouslySetInnerHTML={{ __html: boldText(b, result.resume?.ats_score_details) }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <p className="section-title">— Projects</p>
              {result.resume?.projects?.map((proj: any, i: number) => (
                <div key={i} style={{ marginBottom: '24px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontFamily: 'Syne', letterSpacing: '-0.01em', marginBottom: '6px' }}>
                    {proj.name}
                  </p>
                  <p
                    style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: '8px' }}
                    dangerouslySetInnerHTML={{ __html: boldText(proj.description, result.resume?.ats_score_details) }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {proj.tech?.map((t: string, j: number) => (
                      <span key={j} className="skill-tag">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="resume-section">
              <p className="section-title">— Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {result.resume?.skills?.map((skill: string, i: number) => (
                  <span key={i} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="resume-section">
              <p className="section-title">— Education</p>
              {result.resume?.education?.map((edu: any, i: number) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.85)', fontFamily: 'Syne', letterSpacing: '-0.01em' }}>
                      {edu.degree}
                    </p>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{edu.institution}</p>
                  </div>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)' }}>{edu.year}</p>
                </div>
              ))}
            </div>

            {result.resume?.achievements?.length > 0 && (
              <div className="resume-section">
                <p className="section-title">— Achievements</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.resume.achievements.map((ach: string, i: number) => (
                    <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: 'rgba(220,180,80,0.5)', fontSize: '10px', marginTop: '4px' }}>★</span>
                      <span
                        style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}
                        dangerouslySetInnerHTML={{ __html: boldText(ach, result.resume?.ats_score_details) }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.resume?.ats_score_details && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', padding: '32px', borderRadius: '2px', marginTop: '8px' }}>
                <p className="section-title">— ATS Analysis</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  {Object.entries(result.resume.ats_score_details.breakdown || {}).map(([key, val]: any) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: 'Syne', fontWeight: 700 }}>
                          {val.score}
                        </span>
                      </div>
                      <div className="ats-bar">
                        <div
                          className="ats-bar-fill"
                          style={{
                            width: `${val.score}%`,
                            background: val.score >= 85 ? 'rgba(80,220,120,0.6)' : val.score >= 70 ? 'rgba(220,180,80,0.6)' : 'rgba(220,80,80,0.6)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {result.resume.ats_score_details.improvements?.map((imp: any, i: number) => (
                  <div key={i} style={{
                    borderLeft: `1px solid ${imp.priority === 'high' ? 'rgba(255,80,80,0.3)' : 'rgba(220,180,80,0.3)'}`,
                    paddingLeft: '16px',
                    marginBottom: '12px',
                  }}>
                    <p style={{ fontSize: '10px', color: imp.priority === 'high' ? 'rgba(255,100,100,0.7)' : 'rgba(220,180,80,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                      {imp.priority} priority
                    </p>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>{imp.fix}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="fade-up-3" style={{ marginTop: '48px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="again-btn" onClick={() => setResult(null)}>
              Generate Another
            </button>
            <button className="again-btn" onClick={() => router.push('/dashboard')}>
              Dashboard →
            </button>
            <button className="pdf-btn" onClick={handleDownloadPDF}>
              Download PDF ↓
            </button>
            <button
  className="again-btn"
  style={{ borderColor: 'rgba(80,220,120,0.2)', color: 'rgba(80,220,120,0.6)' }}
  onClick={() => {
    localStorage.setItem('resume_to_edit', JSON.stringify(result.resume));
    router.push('/resume-editor');
  }}
>
  Edit Resume ✎
</button>
          </div>
        </div>
      )}
    </main>
  );
}
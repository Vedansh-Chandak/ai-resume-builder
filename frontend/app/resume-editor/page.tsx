'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const THEMES = {
  classic: { accent: '#111', light: '#f5f5f5', border: '#e0e0e0' },
  navy: { accent: '#1a3a5c', light: '#e8f0f8', border: '#b8d0e8' },
  forest: { accent: '#1a3a2a', light: '#e8f5ee', border: '#b8d8c8' },
  rose: { accent: '#5c1a2a', light: '#f8e8ec', border: '#e8b8c8' },
  purple: { accent: '#3a1a5c', light: '#f0e8f8', border: '#c8b8e8' },
};

const FONTS = ['Inter', 'Georgia', 'Merriweather', 'Playfair Display', 'Roboto'];

export default function ResumeEditorPage() {
  const router = useRouter();
  const [resume, setResume] = useState<any>(null);
  const [theme, setTheme] = useState<keyof typeof THEMES>('classic');
  const [font, setFont] = useState('Inter');
  const [fontSize, setFontSize] = useState(13);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [sections, setSections] = useState([
    'summary', 'experience', 'projects', 'skills', 'education', 'achievements'
  ]);
  const resumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = localStorage.getItem('resume_to_edit');
    if (data) setResume(JSON.parse(data));
    else router.push('/generate');
  }, []);

  const t = THEMES[theme];

  const handleDownloadPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const content = resumeRef.current?.innerHTML || '';
    printWindow.document.write(`
      <!DOCTYPE html><html><head>
      <title>${resume?.name} - Resume</title>
      <link href="https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font}', sans-serif; background: #fff; padding: 0; font-size: ${fontSize}px; }
        @media print { @page { margin: 1cm; } }
        .drag-handle { display: none !important; }
        .add-item-btn { display: none !important; }
        .remove-item-btn { display: none !important; }
        [contenteditable] { outline: none !important; border: none !important; background: transparent !important; }
      </style>
      </head><body>${content}</body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleDrop = (e: React.DragEvent, toId: string) => {
    e.currentTarget.classList.remove('drag-over');
    if (!draggedSection || draggedSection === toId) return;
    const newSections = [...sections];
    const fromIdx = newSections.indexOf(draggedSection);
    const toIdx = newSections.indexOf(toId);
    newSections.splice(fromIdx, 1);
    newSections.splice(toIdx, 0, draggedSection);
    setSections(newSections);
  };

  if (!resume) return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'Syne,sans-serif', fontSize: '14px', letterSpacing: '0.1em' }}>LOADING...</div>
    </main>
  );

  const renderSection = (sectionId: string) => {
    switch (sectionId) {

      case 'summary':
        return resume.summary ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: `${fontSize * 0.75}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.accent, marginBottom: '6px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>
              Summary
            </div>
            <div
              contentEditable suppressContentEditableWarning
              onBlur={(e) => setResume({ ...resume, summary: e.currentTarget.textContent })}
              style={{ color: '#444', lineHeight: 1.7, outline: 'none', cursor: 'text' }}
            >
              {resume.summary}
            </div>
          </div>
        ) : null;

      case 'experience':
        return resume.experience?.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: `${fontSize * 0.75}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.accent, marginBottom: '10px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>
              Experience
            </div>
            {resume.experience.map((exp: any, i: number) => (
              <div key={i} style={{ marginBottom: '14px', position: 'relative' }}>
                <button className="remove-item-btn" style={{ position: 'absolute', right: -20, top: 0 }} onClick={() => {
                  setResume({ ...resume, experience: resume.experience.filter((_: any, idx: number) => idx !== i) });
                }}>×</button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                  <div>
                    <span
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => { const u = [...resume.experience]; u[i].title = e.currentTarget.textContent; setResume({ ...resume, experience: u }); }}
                      style={{ fontWeight: 600, fontSize: `${fontSize * 1.05}px`, outline: 'none', cursor: 'text' }}
                    >{exp.title}</span>
                    <span style={{ color: '#888', margin: '0 6px' }}>@</span>
                    <span
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => { const u = [...resume.experience]; u[i].company = e.currentTarget.textContent; setResume({ ...resume, experience: u }); }}
                      style={{ color: t.accent, outline: 'none', cursor: 'text' }}
                    >{exp.company}</span>
                  </div>
                  <span
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => { const u = [...resume.experience]; u[i].dates = e.currentTarget.textContent; setResume({ ...resume, experience: u }); }}
                    style={{ color: '#888', fontSize: `${fontSize * 0.88}px`, outline: 'none', cursor: 'text', flexShrink: 0 }}
                  >{exp.dates}</span>
                </div>
                {exp.bullets?.map((b: string, j: number) => (
                  <div key={j} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span style={{ color: t.accent, marginTop: '3px', flexShrink: 0 }}>▸</span>
                    <span
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => { const u = [...resume.experience]; u[i].bullets[j] = e.currentTarget.textContent || ''; setResume({ ...resume, experience: u }); }}
                      style={{ color: '#444', outline: 'none', cursor: 'text', flex: 1 }}
                    >{b}</span>
                    <button className="remove-item-btn" onClick={() => {
                      const u = [...resume.experience];
                      u[i].bullets = u[i].bullets.filter((_: any, idx: number) => idx !== j);
                      setResume({ ...resume, experience: u });
                    }}>×</button>
                  </div>
                ))}
                <button className="add-item-btn" onClick={() => {
                  const u = [...resume.experience];
                  u[i].bullets = [...(u[i].bullets || []), 'New bullet point'];
                  setResume({ ...resume, experience: u });
                }}>+ Add bullet</button>
              </div>
            ))}
            <button className="add-item-btn" onClick={() => {
              setResume({ ...resume, experience: [...resume.experience, { title: 'Job Title', company: 'Company', dates: '2024 - Present', bullets: ['Bullet point'] }] });
            }}>+ Add experience</button>
          </div>
        ) : null;

      case 'projects':
        return resume.projects?.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: `${fontSize * 0.75}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.accent, marginBottom: '10px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>
              Projects
            </div>
            {resume.projects.map((proj: any, i: number) => (
              <div key={i} style={{ marginBottom: '12px', position: 'relative' }}>
                <button className="remove-item-btn" style={{ position: 'absolute', right: -20, top: 0 }} onClick={() => {
                  setResume({ ...resume, projects: resume.projects.filter((_: any, idx: number) => idx !== i) });
                }}>×</button>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                  <span
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => { const u = [...resume.projects]; u[i].name = e.currentTarget.textContent; setResume({ ...resume, projects: u }); }}
                    style={{ fontWeight: 600, color: t.accent, outline: 'none', cursor: 'text' }}
                  >{proj.name}</span>
                  <span style={{ color: '#ccc', fontSize: `${fontSize * 0.85}px` }}>
                    {proj.tech?.filter(Boolean).join(' · ')}
                  </span>
                </div>
                <div
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => { const u = [...resume.projects]; u[i].description = e.currentTarget.textContent; setResume({ ...resume, projects: u }); }}
                  style={{ color: '#444', lineHeight: 1.6, outline: 'none', cursor: 'text' }}
                >{proj.description}</div>
              </div>
            ))}
            <button className="add-item-btn" onClick={() => {
              setResume({ ...resume, projects: [...resume.projects, { name: 'Project Name', description: 'Project description', tech: ['Tech'] }] });
            }}>+ Add project</button>
          </div>
        ) : null;

      case 'skills':
        return resume.skills?.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: `${fontSize * 0.75}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.accent, marginBottom: '8px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>
              Skills
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {resume.skills.map((skill: string, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', background: t.light, border: `1px solid ${t.border}`, padding: '3px 8px', borderRadius: '2px', gap: '4px' }}>
                  <span
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => { const u = [...resume.skills]; u[i] = e.currentTarget.textContent || ''; setResume({ ...resume, skills: u }); }}
                    style={{ fontSize: `${fontSize * 0.88}px`, color: t.accent, outline: 'none', cursor: 'text', minWidth: '20px' }}
                  >{skill}</span>
                  <button className="remove-item-btn" style={{ fontSize: '12px', padding: '0 2px' }} onClick={() => {
                    setResume({ ...resume, skills: resume.skills.filter((_: any, idx: number) => idx !== i) });
                  }}>×</button>
                </div>
              ))}
              <button
                style={{ background: 'transparent', border: `1px dashed ${t.border}`, padding: '3px 10px', borderRadius: '2px', fontSize: `${fontSize * 0.88}px`, color: '#aaa', cursor: 'pointer' }}
                onClick={() => setResume({ ...resume, skills: [...resume.skills, 'New Skill'] })}
              >+ Add</button>
            </div>
          </div>
        ) : null;

      case 'education':
        return resume.education?.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: `${fontSize * 0.75}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.accent, marginBottom: '10px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>
              Education
            </div>
            {resume.education.map((edu: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', position: 'relative' }}>
                <button className="remove-item-btn" style={{ position: 'absolute', right: -20, top: 0 }} onClick={() => {
                  setResume({ ...resume, education: resume.education.filter((_: any, idx: number) => idx !== i) });
                }}>×</button>
                <div>
                  <div
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => { const u = [...resume.education]; u[i].degree = e.currentTarget.textContent; setResume({ ...resume, education: u }); }}
                    style={{ fontWeight: 600, outline: 'none', cursor: 'text' }}
                  >{edu.degree}</div>
                  <div
                    contentEditable suppressContentEditableWarning
                    onBlur={(e) => { const u = [...resume.education]; u[i].institution = e.currentTarget.textContent; setResume({ ...resume, education: u }); }}
                    style={{ color: '#666', fontSize: `${fontSize * 0.92}px`, outline: 'none', cursor: 'text' }}
                  >{edu.institution}</div>
                </div>
                <div
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => { const u = [...resume.education]; u[i].year = e.currentTarget.textContent; setResume({ ...resume, education: u }); }}
                  style={{ color: '#888', fontSize: `${fontSize * 0.88}px`, outline: 'none', cursor: 'text', flexShrink: 0 }}
                >{edu.year}</div>
              </div>
            ))}
          </div>
        ) : null;

      case 'achievements':
        return resume.achievements?.length > 0 ? (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: `${fontSize * 0.75}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: t.accent, marginBottom: '8px', borderBottom: `1px solid ${t.border}`, paddingBottom: '4px' }}>
              Achievements
            </div>
            {resume.achievements.map((ach: string, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '4px' }}>
                <span style={{ color: t.accent }}>★</span>
                <span
                  contentEditable suppressContentEditableWarning
                  onBlur={(e) => { const u = [...resume.achievements]; u[i] = e.currentTarget.textContent || ''; setResume({ ...resume, achievements: u }); }}
                  style={{ color: '#444', outline: 'none', cursor: 'text', flex: 1 }}
                >{ach}</span>
                <button className="remove-item-btn" onClick={() => {
                  setResume({ ...resume, achievements: resume.achievements.filter((_: any, idx: number) => idx !== i) });
                }}>×</button>
              </div>
            ))}
            <button className="add-item-btn" onClick={() => {
              setResume({ ...resume, achievements: [...resume.achievements, 'New achievement'] });
            }}>+ Add achievement</button>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <main style={{ background: '#1a1a2e', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&family=Inter:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap');

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }

        .theme-dot {
          width: 20px; height: 20px; border-radius: 50%;
          cursor: pointer; border: 2px solid transparent;
          transition: all 0.2s; flex-shrink: 0;
        }
        .theme-dot.active { border-color: #fff; transform: scale(1.2); }
        .theme-dot:hover { transform: scale(1.1); }

        .pdf-btn {
          background: rgba(150,120,255,0.15);
          border: 1px solid rgba(150,120,255,0.4);
          color: rgba(180,160,255,1);
          padding: 8px 20px; font-size: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; transition: all 0.2s;
          letter-spacing: 0.06em; text-transform: uppercase;
          border-radius: 3px; font-weight: 500;
        }
        .pdf-btn:hover { background: rgba(150,120,255,0.25); }

        .back-btn {
          background: none; border: none;
          color: rgba(255,255,255,0.3); font-size: 12px; cursor: pointer;
          font-family: 'DM Sans', sans-serif; letter-spacing: 0.08em;
          text-transform: uppercase; padding: 0; transition: color 0.2s;
        }
        .back-btn:hover { color: rgba(255,255,255,0.7); }

        .resume-page {
          background: #fff; width: 794px; min-height: 1123px;
          margin: 0 auto; box-shadow: 0 24px 80px rgba(0,0,0,0.5);
          position: relative;
        }

        [contenteditable]:focus { outline: none; }
        [contenteditable]:hover { background: rgba(0,0,0,0.015); }

        .add-item-btn {
          background: transparent;
          border: 1px dashed rgba(0,0,0,0.12);
          color: rgba(0,0,0,0.25); padding: 4px 12px; font-size: 11px;
          cursor: pointer; font-family: sans-serif; transition: all 0.2s;
          border-radius: 2px; margin-top: 6px; width: 100%; text-align: left;
        }
        .add-item-btn:hover { background: rgba(0,0,0,0.03); color: rgba(0,0,0,0.4); }

        .remove-item-btn {
          background: none; border: none; color: rgba(0,0,0,0.15);
          cursor: pointer; font-size: 14px; padding: 0 4px;
          transition: color 0.2s; line-height: 1; flex-shrink: 0;
        }
        .remove-item-btn:hover { color: rgba(220,50,50,0.6); }

        .font-select {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7); padding: 5px 8px; font-size: 12px;
          outline: none; border-radius: 3px;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
        }
        .font-select option { background: #1a1a2e; }

        .size-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6); width: 28px; height: 28px;
          cursor: pointer; font-size: 14px; border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        }
        .size-btn:hover { background: rgba(255,255,255,0.12); color: #fff; }

        .draggable-section {
          position: relative;
          transition: opacity 0.2s;
        }
        .draggable-section:hover .drag-handle { opacity: 1; }
        .drag-handle {
          position: absolute;
          left: -32px; top: 2px;
          opacity: 0; transition: opacity 0.2s;
          cursor: grab; color: #bbb; font-size: 16px;
          user-select: none; padding: 4px 6px;
          background: rgba(0,0,0,0.04);
          border-radius: 3px;
        }
        .drag-handle:hover { color: #888; background: rgba(0,0,0,0.08); }
        .drag-handle:active { cursor: grabbing; }
        .dragging { opacity: 0.3; }
        .drag-over-top { border-top: 2px solid #7060ff !important; padding-top: 8px; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        padding: '12px 32px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: 'rgba(10,10,20,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '15px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em', cursor: 'pointer' }} onClick={() => router.push('/')}>
            RESUMAI
          </div>
          <span style={{ color: 'rgba(255,255,255,0.1)' }}>·</span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>Visual Editor</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select className="font-select" value={font} onChange={(e) => setFont(e.target.value)}>
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button className="size-btn" onClick={() => setFontSize(Math.max(10, fontSize - 1))}>−</button>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', minWidth: '24px', textAlign: 'center' }}>{fontSize}</span>
            <button className="size-btn" onClick={() => setFontSize(Math.min(16, fontSize + 1))}>+</button>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', padding: '0 8px', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>
            {Object.entries(THEMES).map(([key, val]) => (
              <div
                key={key}
                className={`theme-dot ${theme === key ? 'active' : ''}`}
                style={{ background: val.accent }}
                onClick={() => setTheme(key as keyof typeof THEMES)}
                title={key}
              />
            ))}
          </div>

          <button className="back-btn" onClick={() => router.push('/generate')}>← Back</button>
          <button className="pdf-btn" onClick={handleDownloadPDF}>Download PDF ↓</button>
        </div>
      </nav>

      {/* Canvas */}
      <div style={{ padding: '40px 20px 80px', overflow: 'auto' }}>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginBottom: '8px', letterSpacing: '0.05em' }}>
          ✎ Click any text to edit
        </p>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.15)', marginBottom: '24px', letterSpacing: '0.05em' }}>
          ⠿ Hover a section and drag the handle to reorder
        </p>

        <div ref={resumeRef} className="resume-page fade-in" style={{ fontFamily: `'${font}', sans-serif`, fontSize: `${fontSize}px`, color: '#111', padding: '56px 64px 56px 80px' }}>

          {/* Header */}
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: `2px solid ${t.accent}` }}>
            <div
              contentEditable suppressContentEditableWarning
              onBlur={(e) => setResume({ ...resume, name: e.currentTarget.textContent })}
              style={{ fontSize: `${fontSize * 2.2}px`, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, color: t.accent, outline: 'none', marginBottom: '6px' }}
            >
              {resume.name}
            </div>
            <div style={{ fontSize: `${fontSize * 0.9}px`, color: '#666', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {['email', 'phone', 'linkedin', 'github'].map((field, i) => (
                resume[field] ? (
                  <span key={field} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {i > 0 && <span style={{ color: '#ccc' }}>·</span>}
                    <span
                      contentEditable suppressContentEditableWarning
                      onBlur={(e) => setResume({ ...resume, [field]: e.currentTarget.textContent })}
                      style={{ outline: 'none', cursor: 'text' }}
                    >
                      {resume[field]}
                    </span>
                  </span>
                ) : null
              ))}
            </div>
          </div>

          {/* Draggable sections */}
          {sections.map((sectionId) => {
            const content = renderSection(sectionId);
            if (!content) return null;
            return (
              <div
                key={sectionId}
                className={`draggable-section ${draggedSection === sectionId ? 'dragging' : ''}`}
                draggable
                onDragStart={(e) => {
                  setDraggedSection(sectionId);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnd={() => setDraggedSection(null)}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('drag-over-top');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('drag-over-top');
                }}
                onDrop={(e) => handleDrop(e, sectionId)}
              >
                <div className="drag-handle" title="Drag to reorder">⠿</div>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
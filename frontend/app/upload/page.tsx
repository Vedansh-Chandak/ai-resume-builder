'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/api/resume/upload', formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
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
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
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
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .back-btn:hover { color: rgba(255,255,255,0.7); }

        .drop-zone {
          border: 1px dashed rgba(255,255,255,0.08);
          padding: 64px 48px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          border-radius: 2px;
        }
        .drop-zone:hover {
          border-color: rgba(150,120,255,0.25);
          background: rgba(150,120,255,0.02);
        }
        .drop-zone.active {
          border-color: rgba(150,120,255,0.4);
          background: rgba(150,120,255,0.04);
        }

        .upload-btn {
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
        .upload-btn:hover:not(:disabled) {
          background: rgba(150,120,255,0.1);
          border-color: rgba(150,120,255,0.3);
          color: rgba(180,160,255,1);
        }
        .upload-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          border-top-color: rgba(255,255,255,0.6);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
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

      {/* Content */}
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 56px' }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: '56px' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>
            — Step 01
          </p>
          <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
            Upload your<br />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>resume.</span>
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.3)', marginTop: '20px', lineHeight: 1.7, fontWeight: 300 }}>
            Our AI parser extracts every detail — experience, skills, projects, and metrics with precision.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ borderLeft: '1px solid rgba(255,80,80,0.4)', paddingLeft: '16px', color: 'rgba(255,100,100,0.8)', fontSize: '13px', marginBottom: '32px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Drop zone */}
          <div className="fade-up-2">
            <div
              className={`drop-zone ${dragOver ? 'active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input
                className="file-input"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />

              {!file ? (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.3 }}>↑</div>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>
                    Drop your resume here
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.05em' }}>
                    PDF or DOCX · Max 10MB
                  </p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '11px', color: 'rgba(150,120,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                    File selected
                  </div>
                  <p style={{ fontSize: '16px', fontFamily: 'Syne', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.02em' }}>
                    {file.name}
                  </p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', marginTop: '8px' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Supported formats */}
          <div className="fade-up-2" style={{ display: 'flex', gap: '8px' }}>
            {['PDF', 'DOCX'].map((fmt) => (
              <div key={fmt} style={{
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '6px 12px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.08em',
                borderRadius: '2px',
              }}>
                {fmt}
              </div>
            ))}
          </div>

          {/* Upload button */}
          <div className="fade-up-3">
            <button
              className="upload-btn"
              type="submit"
              disabled={!file || loading}
            >
              {loading ? (
                <><span className="spinner" />Parsing resume...</>
              ) : (
                'Upload & Parse →'
              )}
            </button>
          </div>
        </form>

        {/* What happens next */}
        <div className="fade-up-3" style={{ marginTop: '56px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '24px' }}>
            — What happens next
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { num: '01', text: 'AI extracts all resume sections with LLM precision' },
              { num: '02', text: 'Skills, experience, projects and metrics are identified' },
              { num: '03', text: 'Resume is stored and ready for ATS generation' },
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
    </main>
  );
}
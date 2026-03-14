'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<any[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
  }, [user, isLoading]);

  useEffect(() => {
    if (user) {
      api.get('/api/resume/').then((res) => setResumes(res.data)).catch(() => {});
    }
  }, [user]);

  const cards = [
    { id: 0, title: 'Upload Resume', desc: 'Parse your existing resume with AI precision', route: '/upload', tag: 'Start here', num: '01' },
    { id: 1, title: 'Generate Resume', desc: 'RAG-powered ATS optimized resume generation', route: '/generate', tag: 'Popular', num: '02' },
    { id: 2, title: 'ATS Checker', desc: '8-dimension industry grade ATS scoring system', route: '/ats-check', tag: 'New', num: '03' },
    { id: 3, title: 'Skill Gap', desc: 'Discover exactly what skills you need to get hired', route: '/skill-gap', tag: null, num: '04' },
    { id: 4, title: 'Cover Letter', desc: 'AI-generated company-specific cover letters', route: '/cover-letter', tag: null, num: '05' },
  ];

  const firstName = user?.full_name?.split(' ')[0] || 'there';

  const avgATS = resumes.filter(r => r.ats_score).length > 0
    ? Math.round(resumes.filter(r => r.ats_score).reduce((a, r) => a + r.ats_score, 0) / resumes.filter(r => r.ats_score).length)
    : null;

  if (isLoading) {
    return (
      <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'Syne, sans-serif', color: 'rgba(255,255,255,0.2)', fontSize: '14px', letterSpacing: '0.1em' }}>
          LOADING...
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: '#050508', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.7s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.7s 0.1s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.7s 0.2s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.7s 0.3s ease forwards; opacity: 0; }

        .nav-item {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: color 0.2s;
          letter-spacing: 0.08em;
          background: none;
          border: none;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          text-transform: uppercase;
        }
        .nav-item:hover { color: rgba(255,255,255,0.8); }

        .glass-card {
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.055);
          padding: 36px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border-radius: 2px;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(150,120,255,0.06) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .glass-card::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(150,120,255,0.5), transparent);
          opacity: 0;
          transition: opacity 0.4s;
        }
        .glass-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(150,120,255,0.18);
          transform: translateY(-4px);
          box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(150,120,255,0.08);
        }
        .glass-card:hover::before { opacity: 1; }
        .glass-card:hover::after { opacity: 1; }

        .tag {
          font-size: 9px;
          padding: 3px 8px;
          border: 1px solid rgba(150,120,255,0.25);
          color: rgba(150,120,255,0.7);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-radius: 20px;
          background: rgba(150,120,255,0.05);
        }

        .resume-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s;
        }
        .resume-row:hover { padding-left: 8px; }
        .resume-row:last-child { border-bottom: none; }

        .logout-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.25);
          padding: 8px 16px;
          font-size: 11px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .logout-btn:hover {
          border-color: rgba(255,80,80,0.25);
          color: rgba(255,80,80,0.5);
        }

        .stat-box {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          padding: 24px 28px;
          border-radius: 2px;
          transition: all 0.3s;
        }
        .stat-box:hover {
          background: rgba(255,255,255,0.035);
          border-color: rgba(255,255,255,0.07);
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
        <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {[
            { label: 'Upload', route: '/upload' },
            { label: 'Generate', route: '/generate' },
            { label: 'ATS', route: '/ats-check' },
            { label: 'Skill Gap', route: '/skill-gap' },
            { label: 'Cover Letter', route: '/cover-letter' },
          ].map((item, i) => (
            <button key={i} className="nav-item" onClick={() => router.push(item.route)}>
              {item.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.02em' }}>
            {user?.email}
          </span>
          <button className="logout-btn" onClick={() => { logout(); router.push('/login'); }}>
            Sign out
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '72px 56px' }}>

        {/* Greeting */}
        <div className="fade-up" style={{ marginBottom: '72px' }}>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '20px' }}>
            — Dashboard
          </p>
          <h1 style={{ fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 0.9 }}>
            Good to see you,<br />
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>{firstName}.</span>
          </h1>
        </div>

        {/* Stats */}
        <div className="fade-up-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '72px' }}>
          {[
            { label: 'Resumes', value: resumes.length || '0' },
            { label: 'ATS Tools', value: '5' },
            { label: 'AI Powered', value: '100%' },
            { label: 'Avg ATS Score', value: avgATS ? `${avgATS}` : '—' },
          ].map((stat, i) => (
            <div key={i} className="stat-box">
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'Syne', letterSpacing: '-0.03em', color: 'rgba(255,255,255,0.85)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '6px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tools */}
        <div className="fade-up-3">
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>
            — Tools
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {cards.map((card) => (
              <div
                key={card.id}
                className="glass-card"
                onClick={() => router.push(card.route)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.12)', fontFamily: 'Syne', fontWeight: 700, letterSpacing: '0.1em' }}>
                    {card.num}
                  </span>
                  {card.tag && <span className="tag">{card.tag}</span>}
                </div>

                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  marginBottom: '10px',
                  color: hoveredCard === card.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)',
                  transition: 'color 0.3s',
                }}>
                  {card.title}
                </h3>

                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.25)', lineHeight: 1.7, fontWeight: 300 }}>
                  {card.desc}
                </p>

                <div style={{
                  marginTop: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  color: hoveredCard === card.id ? 'rgba(150,120,255,0.9)' : 'rgba(255,255,255,0.12)',
                  transition: 'all 0.3s',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}>
                  <span>Open</span>
                  <span style={{
                    transform: hoveredCard === card.id ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'transform 0.3s',
                    display: 'inline-block'
                  }}>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent resumes */}
        {resumes.length > 0 && (
          <div className="fade-up-4" style={{ marginTop: '72px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.18)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px' }}>
              — Recent Resumes
            </p>
            <div style={{ border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px', padding: '0 24px' }}>
              {resumes.slice(0, 5).map((resume, i) => (
                <div key={i} className="resume-row">
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{resume.title}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)', marginTop: '3px' }}>
                      {new Date(resume.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {resume.ats_score && (
                      <div>
                        <span style={{
                          fontSize: '16px',
                          fontFamily: 'Syne',
                          fontWeight: 800,
                          color: resume.ats_score >= 85 ? 'rgba(80,220,120,0.8)' : resume.ats_score >= 70 ? 'rgba(220,180,80,0.8)' : 'rgba(220,80,80,0.8)',
                        }}>
                          {resume.ats_score}
                        </span>
                        <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginLeft: '2px' }}>/100</span>
                      </div>
                    )}
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.1)' }}>→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.03)', padding: '24px 56px', display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
        <div
          style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '13px', color: 'rgba(255,255,255,0.07)', letterSpacing: '0.08em', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          RESUMAI
        </div>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.07)' }}>Hackathon 2026</span>
      </footer>
    </main>
  );
}
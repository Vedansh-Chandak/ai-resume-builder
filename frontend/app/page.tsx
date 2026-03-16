'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTA = () => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  return (
    <main style={{ background: '#0a0a0a', color: '#fff', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        h1,h2,h3,h4 { font-family: 'Syne', sans-serif; }
        ::selection { background: white; color: black; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s 0.2s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s 0.4s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.8s 0.6s ease forwards; opacity: 0; }
        .fade-in { animation: fadeIn 1s ease forwards; }

        .nav-link {
          color: #666;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .nav-link:hover { color: #fff; }

        .btn-primary {
          background: #fff;
          color: #000;
          border: none;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
          letter-spacing: 0.02em;
        }
        .btn-primary:hover { background: #e0e0e0; transform: translateY(-1px); }

        .btn-ghost {
          background: transparent;
          color: #666;
          border: 1px solid #222;
          padding: 12px 28px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: #666; color: #fff; }

        .feature-card {
          background: #111;
          border: 1px solid #1a1a1a;
          padding: 32px;
          transition: all 0.3s;
          cursor: default;
        }
        .feature-card:hover {
          border-color: #333;
          transform: translateY(-4px);
          background: #141414;
        }

        .marquee {
          display: flex;
          gap: 48px;
          animation: marquee 20s linear infinite;
          white-space: nowrap;
        }

        .glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>

      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1a1a1a' : 'none',
        transition: 'all 0.3s',
      }}>
        <div
          style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          RESUMAI
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#how">How it works</a>
          <a className="nav-link" href="#stats">Stats</a>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-ghost" onClick={() => router.push('/login')}>
            Sign in
          </button>
          <button className="btn-primary" onClick={handleCTA}>
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 48px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div className="glow" style={{ top: '10%', left: '20%' }} />
        <div className="glow" style={{ bottom: '10%', right: '20%' }} />

        <div className="fade-up" style={{
          display: 'inline-block',
          border: '1px solid #222',
          padding: '6px 16px',
          fontSize: '12px',
          color: '#666',
          letterSpacing: '0.1em',
          marginBottom: '32px',
          textTransform: 'uppercase',
        }}>
          AI-Powered Resume Builder
        </div>

        <h1 className="fade-up-2" style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          marginBottom: '24px',
          maxWidth: '900px',
        }}>
          Build resumes that<br />
          <span style={{ color: '#444' }}>get you hired.</span>
        </h1>

        <p className="fade-up-3" style={{
          fontSize: '18px',
          color: '#666',
          maxWidth: '480px',
          lineHeight: 1.6,
          marginBottom: '48px',
          fontWeight: 300,
        }}>
          RAG-powered resume generation with industry-grade ATS scoring, skill gap analysis, and tailored cover letters.
        </p>

        <div className="fade-up-4" style={{ display: 'flex', gap: '12px' }}>
          <button className="btn-primary" style={{ padding: '14px 36px', fontSize: '15px' }} onClick={handleCTA}>
            Start for free →
          </button>
          <button className="btn-ghost" style={{ padding: '14px 36px', fontSize: '15px' }} onClick={() => router.push('/login')}>
            Sign in
          </button>
        </div>

        <div className="fade-in" style={{
          marginTop: '80px',
          border: '1px solid #1a1a1a',
          background: '#111',
          padding: '24px 32px',
          display: 'inline-flex',
          gap: '48px',
          alignItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Syne' }}>80</div>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>ATS Score</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#1a1a1a' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Syne' }}>A</div>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Grade</div>
          </div>
          <div style={{ width: '1px', height: '40px', background: '#1a1a1a' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '36px', fontWeight: 800, fontFamily: 'Syne' }}>3s</div>
            <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Generate</div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', padding: '20px 0', overflow: 'hidden' }}>
        <div className="marquee">
          {['ATS Optimization', 'RAG Pipeline', 'Skill Gap Analysis', 'Cover Letters', 'Resume Parser', '8-Dimension Scoring', 'AI Generation', 'Industry Grade', 'ATS Optimization', 'RAG Pipeline', 'Skill Gap Analysis', 'Cover Letters', 'Resume Parser', '8-Dimension Scoring', 'AI Generation', 'Industry Grade'].map((item, i) => (
            <span key={i} style={{ fontSize: '13px', color: '#333', textTransform: 'uppercase', letterSpacing: '0.1em', flexShrink: 0 }}>
              {item} <span style={{ color: '#222', marginLeft: '48px' }}>✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '120px 48px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Features
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
              Everything you need<br />
              <span style={{ color: '#333' }}>to land the job.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#1a1a1a' }}>
            {[
              { title: 'RAG Resume Generator', desc: 'Learns from real hired resumes at your target company. Generates ATS-optimized content tailored to the job.' },
              { title: 'Industry ATS Checker', desc: '8-dimension scoring across keywords, skills, experience, format, achievements, and more. Grade from A+ to D.' },
              { title: 'Skill Gap Analyzer', desc: 'Know exactly what skills you\'re missing and get a personalized learning path with resources and timeline.' },
              { title: 'Cover Letter AI', desc: 'Company-specific cover letters in 3 tones — professional, conversational, or bold. Researches company culture.' },
              { title: 'Smart Resume Parser', desc: 'Upload any PDF or DOCX. Extracts all sections with LLM precision — experience, projects, skills, metrics.' },
              { title: 'Multi-Source Scraper', desc: 'Scrapes Reddit, GitHub, Google Docs, Common Crawl for real sample resumes with authenticity scoring.' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div style={{ fontSize: '11px', color: '#333', letterSpacing: '0.1em', marginBottom: '16px' }}>0{i + 1}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, fontWeight: 300 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '120px 48px', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', color: '#444', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              How it works
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Three steps to your<br />
              <span style={{ color: '#333' }}>dream job.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px' }}>
            {[
              { num: '01', title: 'Upload your resume', desc: 'Upload your existing PDF or DOCX. Our LLM parser extracts every detail with precision.' },
              { num: '02', title: 'Set your target', desc: 'Enter your target company, role, and paste the job description. Our RAG system does the rest.' },
              { num: '03', title: 'Get hired', desc: 'Download your ATS-optimized resume, check skill gaps, and send a tailored cover letter.' },
            ].map((step, i) => (
              <div key={i}>
                <div style={{ fontSize: '48px', fontWeight: 800, color: '#1a1a1a', fontFamily: 'Syne', marginBottom: '24px' }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-0.02em' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.7, fontWeight: 300 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" style={{ padding: '80px 48px', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { num: '80%', label: 'Average ATS Score' },
            { num: '8', label: 'Scoring Dimensions' },
            { num: '4', label: 'Resume Sources' },
            { num: '3', label: 'Cover Letter Tones' },
          ].map((stat, i) => (
            <div key={i} style={{ borderLeft: i > 0 ? '1px solid #1a1a1a' : 'none', paddingLeft: i > 0 ? '32px' : '0' }}>
              <div style={{ fontSize: '48px', fontWeight: 800, fontFamily: 'Syne', letterSpacing: '-0.03em' }}>{stat.num}</div>
              <div style={{ fontSize: '13px', color: '#555', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '120px 48px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '24px' }}>
            Ready to get<br />hired?
          </h2>
          <p style={{ color: '#555', fontSize: '16px', marginBottom: '40px', fontWeight: 300 }}>
            Join thousands of candidates using AI to land their dream jobs.
          </p>
          <button className="btn-primary" style={{ padding: '16px 48px', fontSize: '16px' }} onClick={handleCTA}>
            Start for free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #111', padding: '40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '16px', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          RESUMAI
        </div>
       
        <div style={{ display: 'flex', gap: '24px' }}>
          <a className="nav-link" href="#features">Features</a>
          <a className="nav-link" href="#how">How it works</a>
        </div>
      </footer>
    </main>
  );
}
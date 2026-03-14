'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', full_name: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2,
      opacity: Math.random() * 0.7 + 0.1,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));

    const planets = [
      { x: 0.12, y: 0.2, r: 40, color: '#1a1a3a', ring: true },
      { x: 0.9, y: 0.75, r: 28, color: '#0d1a0d', ring: false },
      { x: 0.08, y: 0.72, r: 15, color: '#1a0d0d', ring: false },
    ];

    const rockets = [
      { x: 0.85, speed: 0.22, offset: 0 },
      { x: 0.15, speed: 0.2, offset: 200 },
    ];

    let t = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const bg = ctx.createRadialGradient(
        canvas.width * 0.5, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.3, canvas.width
      );
      bg.addColorStop(0, '#0c0c1a');
      bg.addColorStop(0.5, '#07070f');
      bg.addColorStop(1, '#030305');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      [
        { x: 0.8, y: 0.2, r: 350, c: 'rgba(40,20,90,0.18)' },
        { x: 0.15, y: 0.65, r: 280, c: 'rgba(20,40,90,0.14)' },
        { x: 0.5, y: 0.5, r: 220, c: 'rgba(60,10,70,0.1)' },
      ].forEach(({ x, y, r, c }) => {
        const g = ctx.createRadialGradient(
          canvas.width * x, canvas.height * y, 0,
          canvas.width * x, canvas.height * y, r
        );
        g.addColorStop(0, c);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkle})`;
        ctx.fill();
      });

      planets.forEach((p) => {
        const px = canvas.width * p.x;
        const py = canvas.height * p.y;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.r * 3);
        glow.addColorStop(0, 'rgba(100,80,180,0.1)');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, p.r * 3, 0, Math.PI * 2);
        ctx.fill();

        const pg = ctx.createRadialGradient(px - p.r * 0.3, py - p.r * 0.3, 0, px, py, p.r);
        pg.addColorStop(0, p.color);
        pg.addColorStop(1, '#020204');
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = pg;
        ctx.fill();

        if (p.ring) {
          ctx.save();
          ctx.translate(px, py);
          ctx.scale(1, 0.25);
          ctx.beginPath();
          ctx.arc(0, 0, p.r * 1.9, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(120,100,180,0.25)';
          ctx.lineWidth = 8;
          ctx.stroke();
          ctx.restore();
        }
      });

      rockets.forEach((r, i) => {
        const rx = canvas.width * r.x;
        const ry = canvas.height - ((t * r.speed * 60 + r.offset) % (canvas.height + 200));
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.translate(rx, ry);
        ctx.rotate(-Math.PI / 4);
        ctx.font = `${20 + i * 6}px serif`;
        ctx.fillText('🚀', 0, 0);
        ctx.restore();
      });

      t += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/register', form);
      const res = await api.post('/api/auth/login', {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        h1,h2,h3 { font-family: 'Syne', sans-serif; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s 0.1s ease forwards; opacity: 0; }
        .fade-up-3 { animation: fadeUp 0.8s 0.2s ease forwards; opacity: 0; }
        .fade-up-4 { animation: fadeUp 0.8s 0.3s ease forwards; opacity: 0; }
        .fade-up-5 { animation: fadeUp 0.8s 0.4s ease forwards; opacity: 0; }
        .fade-up-6 { animation: fadeUp 0.8s 0.5s ease forwards; opacity: 0; }
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          color: #fff;
          padding: 14px 16px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: all 0.3s;
          border-radius: 2px;
          margin-top: 8px;
        }
        .input-field:focus {
          background: rgba(255,255,255,0.05);
          border-color: rgba(150,120,255,0.4);
        }
        .input-field::placeholder { color: rgba(255,255,255,0.12); }
        .btn-submit {
          width: 100%;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 14px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
        }
        .btn-submit:hover {
          background: rgba(150,120,255,0.1);
          border-color: rgba(150,120,255,0.3);
          color: rgba(180,160,255,1);
        }
        .btn-submit:disabled { opacity: 0.3; cursor: not-allowed; }
        .signin-btn {
          background: transparent;
          border: none;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 0.9;
          cursor: pointer;
          transition: opacity 0.2s;
          padding: 0;
          text-align: left;
        }
        .signin-btn:hover { opacity: 0.7; }
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div
          style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '16px', letterSpacing: '0.05em', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}
          onClick={() => router.push('/')}
        >
          RESUMAI
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 10, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div className="fade-up" style={{ marginBottom: '40px' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '16px' }}>
              — Create account
            </p>
            <h1 style={{ fontSize: '56px', fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.9, color: 'rgba(255,255,255,0.9)' }}>
              Join<br />
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>RESUMAI.</span>
            </h1>
          </div>

          {error && (
            <div style={{ borderLeft: '1px solid rgba(255,80,80,0.4)', paddingLeft: '12px', color: 'rgba(255,100,100,0.8)', fontSize: '13px', marginBottom: '24px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="fade-up-2">
              <h2 style={{ fontSize: '25px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, color: 'rgba(255,255,255,0.85)' }}>
                Full Name<span style={{ color: 'rgba(255,255,255,0.2)' }}>.</span>
              </h2>
              <input
                className="input-field"
                type="text"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Vedansh Chandak"
                required
              />
            </div>

            <div className="fade-up-3">
              <h2 style={{ fontSize: '25px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, color: 'rgba(255,255,255,0.85)' }}>
                Email<span style={{ color: 'rgba(255,255,255,0.2)' }}>.</span>
              </h2>
              <input
                className="input-field"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="fade-up-4">
              <h2 style={{ fontSize: '25px', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 0.9, color: 'rgba(255,255,255,0.85)' }}>
                Password<span style={{ color: 'rgba(255,255,255,0.2)' }}>.</span>
              </h2>
              <input
                className="input-field"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="fade-up-5">
              <button className="btn-submit" type="submit" disabled={loading}>
                {loading ? 'Launching...' : 'Create account →'}
              </button>
            </div>
          </form>

          <div className="fade-up-6" style={{ marginTop: '40px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>
              — Already have an account?
            </p>
            <button className="signin-btn" onClick={() => router.push('/login')}>
              <span style={{ fontSize: '36px', color: 'rgba(255,255,255,0.85)' }}>Sign</span><br />
              <span style={{ fontSize: '36px', color: 'rgba(255,255,255,0.2)' }}>in.</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', zIndex: 10 }}>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.07)' }}>© 2026 RESUMAI</span>
        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.07)' }}>Hackathon 2026</span>
      </div>
    </main>
  );
}
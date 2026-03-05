import { useState, useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  connections: number[];
}

function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

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

    // Initialize particles
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [],
    }));

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 15, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw connections
        particles.forEach((p2, j) => {
          if (i >= j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const alpha = (1 - dist / 150) * 0.4;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 170, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });

        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 200, 255, 0.8)';
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8);
        gradient.addColorStop(0, 'rgba(0, 200, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 200, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'linear-gradient(180deg, #05050f 0%, #0a0a1a 50%, #050510 100%)' }}
    />
  );
}

function PulsingOrb() {
  return (
    <div className="relative w-32 h-32 md:w-48 md:h-48 mx-auto mb-8">
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping" style={{ animationDuration: '2s' }} />
      <div className="absolute inset-4 rounded-full bg-cyan-500/30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
      <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_60px_rgba(0,200,255,0.5)]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl md:text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,200,255,0.8)]" style={{ fontFamily: 'Orbitron' }}>
          N
        </span>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  delay: number;
}

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`relative p-4 md:p-6 rounded-lg border border-cyan-500/30 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-sm transition-all duration-700 hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(0,200,255,0.15)] group ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-3xl md:text-4xl mb-3 md:mb-4">{icon}</div>
      <h3
        className="text-base md:text-lg font-bold text-cyan-300 mb-2"
        style={{ fontFamily: 'Orbitron' }}
      >
        {title}
      </h3>
      <p className="text-sm md:text-base text-slate-400 leading-relaxed" style={{ fontFamily: 'IBM Plex Mono' }}>
        {description}
      </p>
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
    </div>
  );
}

function DataStream() {
  const [streams, setStreams] = useState<{ id: number; text: string; left: number }[]>([]);

  useEffect(() => {
    const texts = [
      'analyzing trends...',
      'processing memes...',
      'scanning X feed...',
      'learning patterns...',
      'generating signals...',
      'detecting virality...',
      'mapping sentiment...',
      'predicting alpha...',
    ];

    const interval = setInterval(() => {
      const newStream = {
        id: Date.now(),
        text: texts[Math.floor(Math.random() * texts.length)],
        left: Math.random() * 80 + 10,
      };
      setStreams((prev) => [...prev.slice(-5), newStream]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {streams.map((stream) => (
        <div
          key={stream.id}
          className="absolute text-cyan-500/30 text-xs whitespace-nowrap animate-fall"
          style={{
            left: `${stream.left}%`,
            fontFamily: 'IBM Plex Mono',
            animation: 'fall 8s linear forwards',
          }}
        >
          {stream.text}
        </div>
      ))}
    </div>
  );
}

function App() {
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 300);
  }, []);

  const features = [
    {
      icon: '🎭',
      title: 'Meme Content',
      description: 'Auto-generates viral meme content by analyzing trending formats and cultural moments across the Base ecosystem.',
    },
    {
      icon: '📈',
      title: 'Trend Predictions',
      description: 'Machine learning models predict emerging trends before they go mainstream, giving holders alpha advantage.',
    },
    {
      icon: '🎮',
      title: 'Community Quests',
      description: 'AI-generated challenges and quests that reward community engagement and drive organic growth.',
    },
    {
      icon: '⚡',
      title: 'Trading Signals',
      description: 'Real-time sentiment analysis powers trading signals derived from social chatter and market dynamics.',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <NeuralBackground />
      <DataStream />

      <style>{`
        @keyframes fall {
          0% { top: -20px; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100vh; opacity: 0; }
        }
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      {/* Scanline effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div
          className="absolute w-full h-1 bg-cyan-400"
          style={{ animation: 'scanline 4s linear infinite' }}
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 px-4 md:px-8 py-8 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <header className="text-center mb-12 md:mb-20">
            <PulsingOrb />

            <div
              className={`transition-all duration-1000 ${
                titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <h1
                className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 tracking-wider"
                style={{ fontFamily: 'Orbitron' }}
              >
                <span className="text-white">$</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 drop-shadow-[0_0_30px_rgba(0,200,255,0.5)]">
                  NEURO
                </span>
              </h1>

              <p
                className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed px-4"
                style={{ fontFamily: 'IBM Plex Mono' }}
              >
                An AI-powered token that{' '}
                <span className="text-cyan-400">"learns"</span> from social trends,
                X engagement, Base ecosystem chatter, and meme virality
              </p>

              <div className="mt-6 md:mt-8 flex items-center justify-center gap-2 text-cyan-500/60 text-sm" style={{ fontFamily: 'IBM Plex Mono' }}>
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Actively learning...</span>
              </div>
            </div>
          </header>

          {/* Generated outputs label */}
          <div className="text-center mb-6 md:mb-8">
            <span
              className="inline-block px-4 py-2 rounded-full border border-cyan-500/30 text-cyan-400 text-xs md:text-sm uppercase tracking-widest"
              style={{ fontFamily: 'Orbitron' }}
            >
              Auto-Generates
            </span>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-20">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={800 + index * 200}
              />
            ))}
          </div>

          {/* Bottom decoration */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-4 md:px-6 py-3 rounded-full border border-cyan-500/20 bg-slate-900/50 backdrop-blur-sm">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 md:w-2 h-3 md:h-4 bg-cyan-400 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <span className="text-slate-400 text-xs md:text-sm" style={{ fontFamily: 'IBM Plex Mono' }}>
                Neural network processing Base ecosystem data
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-6 md:pb-8 pt-8 md:pt-12">
        <p
          className="text-center text-slate-600 text-xs"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          Requested by{' '}
          <a
            href="https://x.com/TheRealSlimG"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-500 transition-colors"
          >
            @TheRealSlimG
          </a>
          {' · '}
          Built by{' '}
          <a
            href="https://x.com/clonkbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-500 transition-colors"
          >
            @clonkbot
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;

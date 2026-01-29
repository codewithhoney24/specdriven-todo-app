'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  ShieldCheckIcon, 
  ZapIcon, 
  BarChart3Icon, 
  ArrowRightIcon,
  DatabaseIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ==========================================================
   ✅ ANIMATED BACKGROUND COMPONENT (Giant Bolls + Network + Bars)
   ========================================================== */
export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    const pinkColor = '#F06292';
    const whiteColor = '#FFFFFF';

    // --- Vertical Bars ---
    const barCount = Math.floor(width / 40);
    const bars = Array.from({ length: barCount }, (_, i) => ({
      x: i * 40,
      y: Math.random() * -height,
      speed: 0.3 + Math.random() * 1,
      height: 150 + Math.random() * 200
    }));

    // --- Giant Particles (The 'o' sized ones) ---
    const giantParticleCount = 15;
    const giantParticles = Array.from({ length: giantParticleCount }, () => {
      const isBig = Math.random() > 0.6;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isBig ? 0.1 : 0.4),
        vy: (Math.random() - 0.5) * (isBig ? 0.1 : 0.4),
        radius: isBig ? Math.random() * 200 + 200 : Math.random() * 30 + 30,
        color: Math.random() > 0.5 ? pinkColor : whiteColor,
        alpha: isBig ? 0.15 : 0.1
      };
    });

    // --- Network Particles ---
    const networkParticleCount = 80;
    const networkParticles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }[] = [];
    const colors = [pinkColor, whiteColor];

    for (let i = 0; i < networkParticleCount; i++) {
      networkParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    // --- Mouse Events ---
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // --- Draw Function ---
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1️⃣ Draw Vertical Bars
      bars.forEach(bar => {
        const gradient = ctx.createLinearGradient(0, bar.y, 0, bar.y + bar.height);
        gradient.addColorStop(0, pinkColor);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.03;
        ctx.fillRect(bar.x, bar.y, 3, bar.height);
        ctx.globalAlpha = 1.0;

        bar.y += bar.speed;
        if (bar.y > height) bar.y = -bar.height;
      });

      // 2️⃣ Draw Giant Particles
      giantParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x > width + p.radius) p.x = -p.radius;
        else if (p.x < -p.radius) p.x = width + p.radius;
        if (p.y > height + p.radius) p.y = -p.radius;
        else if (p.y < -p.radius) p.y = height + p.radius;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        radGrad.addColorStop(0, p.color === pinkColor ? `rgba(240, 98, 146, ${p.alpha})` : `rgba(255, 255, 255, ${p.alpha})`);
        radGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = radGrad;
        ctx.fill();
      });

      // 3️⃣ Network Lines
      for (let i = 0; i < networkParticleCount; i++) {
        for (let j = i + 1; j < networkParticleCount; j++) {
          const dx = networkParticles[i].x - networkParticles[j].x;
          const dy = networkParticles[i].y - networkParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = 'rgba(255,255,255,0.35)';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(networkParticles[i].x, networkParticles[i].y);
            ctx.lineTo(networkParticles[j].x, networkParticles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4️⃣ Network Particles
      networkParticles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x;
          const dy = mouseRef.current.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.vx += (dx / dist) * 0.6 * force;
            p.vy += (dy / dist) * 0.6 * force;
          }
        }

        p.x += p.vx * 0.98;
        p.y += p.vy * 0.98;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[#050505]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(240, 98, 146, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240, 98, 146, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px)',
          animation: 'grid-float 60s linear infinite'
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'auto' }}
      />
      {mounted && (
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        />
      )}
      <style jsx global>{`
        @keyframes grid-float {
          0% { background-position: 0 0; }
          100% { background-position: 0 1000px; }
        }
      `}</style>
    </div>
  );
};

/* ==========================================================
   ✅ TYPEWRITER COMPONENT
   ========================================================== */
function TypewriterText() {
  const words = ['Smart Planning', 'Better Focus', 'Daily Productivity'];
  const [text, setText] = React.useState('');
  const [wordIndex, setWordIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (charIndex < words[wordIndex].length) {
        setText(words[wordIndex].slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else {
        setTimeout(() => {
          setCharIndex(0);
          setWordIndex((wordIndex + 1) % words.length);
          setText('');
        }, 1200);
      }
    }, 90);

    return () => clearTimeout(timeout);
  }, [charIndex, wordIndex]);

  return <span>{text}<span className="animate-pulse">|</span></span>;
}

/* ==========================================================
   ✅ MAIN HOME PAGE
   ========================================================== */
export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden relative font-sans">
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 md:py-24 lg:py-36">
        <div className="text-center space-y-8 sm:space-y-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#F06292] to-[#FFFFFF] text-black text-xs sm:text-sm font-black uppercase tracking-widest mb-3 sm:mb-4">
              <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4" /> Task & Todo Web Platform
            </div>

            <motion.h1
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter italic leading-[0.9] cursor-pointer"
            >
              Elevate Tasks with
              <span className="block mt-1 sm:mt-2">
                <TypewriterText />
              </span>
            </motion.h1>

            <p className="text-lg sm:text-xl md:text-2xl text-[#F06292] max-w-xs sm:max-w-md md:max-w-xl mx-auto font-medium leading-relaxed">
              A smart Todo web application to organize tasks, set priorities, and stay productive every day.
              Simple, secure, and built for a smooth user experience.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-6"
          >
            <Link href="/signup">
              <Button className="w-full sm:w-auto h-12 sm:h-14 md:h-16 bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-black text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 rounded-xl sm:rounded-2xl transition-all active:scale-95 hover:from-[#F06292]/80 hover:to-[#FFFFFF]/100 btn-shine-effect">
                Get Started Free <ArrowRightIcon className="ml-1 sm:ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-14 md:h-16 bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-bold text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 rounded-xl sm:rounded-2xl transition-all hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect"
              >
                Secure Login
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pt-12 sm:pt-16 md:pt-24">
            <FeatureCard
              icon={<ZapIcon className="w-6 sm:w-7 h-6 sm:h-7 text-[#F06292]" />}
              title="Instant Task Sync"
              description="Your todos update instantly, so your tasks are always saved and up to date."
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-6 sm:w-7 h-6 sm:h-7 text-[#F06292]" />}
              title="Secure Access"
              description="Your tasks are protected with safe login and private user accounts."
            />
            <FeatureCard
              icon={<BarChart3Icon className="w-6 sm:w-7 h-6 sm:h-7 text-[#F06292]" />}
              title="Smart Analytics"
              description="Track Smart productivity with real-time sync across all devices."
            />
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 border-y border-zinc-900/50 bg-zinc-900/10 backdrop-blur-sm">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center items-center">
          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center gap-1 sm:gap-2 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer"
          >
            <DatabaseIcon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-[#F06292] mb-1 sm:mb-2" />
            <span className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-white hover:text-[#F06292] transition-colors duration-300">
              SecureCloud
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.15, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center gap-1 sm:gap-2 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer"
          >
            <BarChart3Icon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-[#F06292] mb-1 sm:mb-2" />
            <span className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-white hover:text-[#F06292] transition-colors duration-300">
              SmartPlanner
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center gap-1 sm:gap-2 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer"
          >
            <ShieldCheckIcon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-[#F06292] mb-1 sm:mb-2" />
            <span className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-white hover:text-[#F06292] transition-colors duration-300">
              SecureLogin
            </span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.15, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center gap-1 sm:gap-2 opacity-70 hover:opacity-100 transition-all duration-500 cursor-pointer"
          >
            <ZapIcon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-[#F06292] mb-1 sm:mb-2" />
            <span className="text-base sm:text-lg md:text-xl font-black uppercase tracking-tighter text-white hover:text-[#F06292] transition-colors duration-300">
              Account Protection
            </span>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 180 }}
          className="space-y-6 sm:space-y-8 bg-gradient-to-br from-[#F06292]/10 to-zinc-900/20 border border-pink-500/20 rounded-2xl sm:rounded-[3rem] p-8 sm:p-12 md:p-16 backdrop-blur-lg shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 cursor-pointer transition-all duration-500"
        >
          <h2 className="bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight hover:scale-105 transition-transform duration-500">
            Ready to Boost Your Productivity?
          </h2>
          <p className="text-[#F06292] text-lg sm:text-xl md:text-2xl font-medium max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto leading-relaxed">
            Organize tasks, track progress, and stay on top of your daily workflow. Todo Web makes it fast, secure, and effortless.
          </p>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '10px 8px 90px rgba(240,98,146,0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-black h-12 sm:h-14 md:h-16 px-8 sm:px-10 md:px-12 text-base sm:text-lg md:text-xl rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg hover:shadow-pink-400 transition-all duration-500"
            >
              Try Todo Web Now
            </motion.button>
          </Link>
        </motion.div>
      </div>

      <footer className="relative z-10 border-t border-zinc-800 py-8 sm:py-12 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#F06292] to-[#FFFFFF] italic hover:scale-105 transition-transform duration-500 cursor-pointer">
            Todo Web
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-[#F06292]/80 text-xs sm:text-sm md:text-base font-medium">
            <span>© 2026 Todo Web Production. All rights reserved.</span>
            <div className="flex gap-3 sm:gap-4">
              <a href="#" className="hover:text-[#FFFFFF] transition-colors duration-300">Privacy</a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors duration-300">Terms</a>
              <a href="#" className="hover:text-[#FFFFFF] transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-left transition-all duration-500 group hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/5"
    >
      <div className="mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-500">{icon}</div>
      <h3 className="bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent text-xl sm:text-2xl font-black mb-2 sm:mb-3">{title}</h3>
      <p className="text-[#F06292] text-sm sm:text-base font-medium leading-relaxed group-hover:text-[#F06292]/80 transition-colors">{description}</p>
    </motion.div>
  )
}
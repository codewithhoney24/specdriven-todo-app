'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    // --- Vertical Bars (Keeping this part) ---
    const barCount = Math.floor(width / 40);
    const bars = Array.from({ length: barCount }, (_, i) => ({
      x: i * 40,
      y: Math.random() * -height,
      speed: 0.3 + Math.random() * 1,
      height: 150 + Math.random() * 200
    }));

    // --- Draw Function ---
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1️⃣ Bars Only
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
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-zinc-950">
      {/* Base Dark Background */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Grid */}
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

      {/* Canvas for Bars */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />

      {/* Ambient overlay */}
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
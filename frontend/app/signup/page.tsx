'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SparklesIcon, UserIcon, MailIcon, LockIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient, useSession } from "@/lib/auth"; 

/* ==========================================================
   ✅ FORCE VISIBLE BACKGROUND (Matrix Bars + Giant Bolls + Networks)
   ========================================================== */
const IntegratedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    const pinkColor = '#F06292';
    const whiteColor = '#FFFFFF';

    // 1. Vertical Matrix Bars (High Visibility)
    const bars = Array.from({ length: 40 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      speed: 2 + Math.random() * 2,
      length: 150 + Math.random() * 200,
      width: 4,
      color: pinkColor
    }));

    // 2. Giant Ambient Bolls
    const giantBolls = Array.from({ length: 8 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 100 + 200,
      color: Math.random() > 0.5 ? pinkColor : whiteColor,
      alpha: 0.15 
    }));

    // 3. Network Particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: 4,
      color: Math.random() > 0.5 ? pinkColor : whiteColor,
    }));

    const draw = () => {
      ctx.fillStyle = '#09090b'; 
      ctx.fillRect(0, 0, width, height);

      giantBolls.forEach(g => {
        g.x += g.vx; g.y += g.vy;
        if (g.x < -g.radius) g.x = width + g.radius;
        if (g.x > width + g.radius) g.x = -g.radius;
        if (g.y < -g.radius) g.y = height + g.radius;
        if (g.y > height + g.radius) g.y = -g.radius;

        const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.radius);
        grad.addColorStop(0, g.color === pinkColor ? `rgba(240, 98, 146, ${g.alpha})` : `rgba(255, 255, 255, ${g.alpha})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(g.x, g.y, g.radius, 0, Math.PI * 2); ctx.fill();
      });

      bars.forEach(bar => {
        ctx.fillStyle = pinkColor;
        ctx.globalAlpha = 0.1; 
        ctx.fillRect(bar.x, bar.y, bar.width, bar.length);
        ctx.globalAlpha = 1.0;
        bar.y += bar.speed;
        if (bar.y > height) bar.y = -bar.length;
      });

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx; p1.y += p1.vy;
        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
          }
        }
        ctx.fillStyle = p1.color;
        ctx.globalAlpha = 0.5;
        ctx.beginPath(); ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1.0;
      }

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
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        background: '#09090b'
      }}
    />
  );
};

/* ==========================================================
   ✅ MAIN SIGNUP PAGE
   ========================================================== */
export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    setError('');

    // Step 1: Sirf Signup call karein
    const result = await authClient.signUp({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    if (result.error) {
      setError(result.error.message || "Signup failed. Please try again.");
      setLoading(false);
    } else {
      // Step 2: Auto-login remove kar diya
      // Ab ye user ko seedha login page par le jaye ga
      // Redirect to login instead of auto-dashboard to ensure proper authentication flow
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans">
      <IntegratedBackground /> 

      <div className="flex-1 flex items-center justify-center p-6 relative z-10 bg-transparent">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F06292] shadow-lg shadow-[#F06292]/20 mb-4">
              <SparklesIcon className="text-zinc-950 w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter italic bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">BetterTasks</h1>
            <p className="text-[#F06292] text-xs mt-2 font-bold tracking-widest uppercase italic">Persistent Storage</p>
          </div>

          <Card className="bg-zinc-900/60 backdrop-blur-3xl border-zinc-800/50 rounded-[2.5rem] shadow-2xl">
            <CardHeader className="space-y-1 pb-6 text-center">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">Create Account</CardTitle>
              <CardDescription className="text-[#F06292] font-medium">Join to sync tasks with Smart Productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] py-2 px-4 rounded-xl text-center font-black uppercase">
                    {error}
                  </div>
                )}
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="signupName" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</label>
                    <div className="relative group">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                      <Input
                        id="signupName"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        autoComplete="name"
                        className="bg-zinc-950/50 border-zinc-800/50 rounded-xl pl-12 h-12 text-white focus:border-[#F06292] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signupEmail" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                    <div className="relative group">
                      <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                      <Input
                        id="signupEmail"
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="bg-zinc-950/50 border-zinc-800/50 rounded-xl pl-12 h-12 text-white focus:border-[#F06292] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signupPassword" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Create Password</label>
                    <div className="relative group">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                      <Input
                        id="signupPassword"
                        name="password"
                        type="password"
                        placeholder="Create Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="bg-zinc-950/50 border-zinc-800/50 rounded-xl pl-12 h-12 text-white focus:border-[#F06292] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="signupConfirmPassword" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                      <Input
                        id="signupConfirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        autoComplete="new-password"
                        className="bg-zinc-950/50 border-zinc-800/50 rounded-xl pl-12 h-12 text-white focus:border-[#F06292] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black h-12 rounded-xl transition-all mt-4 font-bold"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">Get Started <ArrowRightIcon className="w-4 h-4" /></span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-zinc-400 text-xl font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-[#F06292] hover:underline font-bold transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
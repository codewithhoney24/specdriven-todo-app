'use client';

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { SparklesIcon, LockIcon, MailIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient, useSession } from "@/lib/auth"; // Better Auth Client

/* ==========================================================
   ✅ ANIMATED BACKGROUND (Matrix Vertical Bars Only)
   ========================================================== */
const MatrixBarsBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    const pinkColor = '#f789ae';
    const whiteColor = '#FFFFFF';

    // Image jaisi thick aur thin lines define karna
    const lines = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * -height,
      length: 100 + Math.random() * 250, // Lambi lines
      speed: 1.5 + Math.random() * 3,   // Scrolling speed
      width: 1 + Math.random() * 3,     // Thickness variety
      color: Math.random() > 0.5 ? pinkColor : whiteColor,
      opacity: 0.1 + Math.random() * 0.4
    }));

    const draw = () => {
      // Trail effect ke liye halka clear
      ctx.fillStyle = 'rgba(9, 9, 11, 0.2)'; 
      ctx.fillRect(0, 0, width, height);

      lines.forEach(line => {
        ctx.beginPath();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.globalAlpha = line.opacity;
        
        // Vertical Bar drawing
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x, line.y + line.length);
        ctx.stroke();

        // Movement logic
        line.y += line.speed;
        if (line.y > height) {
          line.y = -line.length;
          line.x = Math.random() * width;
        }
      });

      ctx.globalAlpha = 1.0;
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
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, background: '#09090b' }} 
    />
  );
};

/* ==========================================================
   ✅ MAIN LOGIN PAGE COMPONENT
   ========================================================== */
export default function LoginPage() {
  const router = useRouter();
  const { refetch } = useSession(); // Get the refetch function
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Custom Auth Login Flow
    const result = await authClient.signIn({
      email,
      password,
    });

    if (result.error) {
      setError(result.error.message || "Login failed. Check your credentials.");
      setLoading(false);
    } else {
      // Clear any old auth data before setting up new session
      localStorage.removeItem('auth-token');
      sessionStorage.clear();

      // Store the token in localStorage if not already stored by the auth API
      if (result.token) {
        localStorage.setItem('auth-token', result.token);
      }

      // Refetch the session to update the auth state
      await refetch();

      // Small delay to ensure auth state is updated before redirect
      await new Promise(resolve => setTimeout(resolve, 300));

      // Redirect to dashboard
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden font-sans">
      {/* 🔹 Matrix Lines Background Only (Bolls Removed) */}
      <MatrixBarsBackground /> 

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Logo Section */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#F06292] shadow-lg shadow-[#F06292]/20 mb-4">
              <SparklesIcon className="text-zinc-950 w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">BetterTasks</h1>
            <p className="text-[#F06292] text-sm mt-2 font-medium tracking-wide uppercase">Secure Web Access</p>
          </div>

          <Card className="bg-zinc-900/40 backdrop-blur-2xl border-zinc-800/50 rounded-[2.5rem] shadow-2xl shadow-black/50">
            <CardHeader className="space-y-1 pb-8 text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">Welcome Back</CardTitle>
              <CardDescription className="text-[#F06292] font-medium">Enter your credentials to sync with Tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-3 px-4 rounded-2xl text-center font-bold">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="loginEmail" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
                  <div className="relative group">
                    <MailIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                    <Input
                      id="loginEmail"
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="bg-zinc-950/50 border-zinc-800/50 rounded-2xl pl-12 h-14 text-white focus:border-[#F06292] transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="loginPassword" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Password</label>
                  <div className="relative group">
                    <LockIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                    <Input
                      id="loginPassword"
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="bg-zinc-950/50 border-zinc-800/50 rounded-2xl pl-12 h-14 text-white focus:border-[#F06292] transition-all outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black h-14 rounded-2xl transition-all text-lg font-bold hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : (
                    <span className="flex items-center justify-center gap-2">Sign In <ArrowRightIcon className="w-5 h-5" /></span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Helper Links */}
          <div className="mt-8 text-center space-y-4">
            <p className="text-zinc-300 text-xl font-medium">
              Don't have an account?{" "}
              <Link href="/signup" className="text-[#F06292] hover:underline font-bold transition-all">
                Create one now
              </Link>
            </p>
            <div className="pt-4 border-t border-zinc-900 flex justify-center gap-6">
              <span className="text-[20px] font-black uppercase tracking-widest text-zinc-400">Privacy</span>
              <span className="text-[20px] font-black uppercase tracking-widest text-zinc-400">Productivity</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
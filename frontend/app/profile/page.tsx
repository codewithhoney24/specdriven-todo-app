'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  User, Mail, Calendar, ShieldCheck,
  Save, Camera, BadgeCheck, Zap, ArrowRight, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext'; 
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { toast } from 'sonner';

export default function ProfilePage() {
  // ✅ useAuth se refetch le rahe hain taake dashboard update ho jaye
  const { user, isAuthenticated, refetch } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // ✅ Email state add ki
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state with user session data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || ''); // ✅ Initial email load
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
        toast.error("Name and Email cannot be empty");
        return;
    }

    setIsUpdating(true);

    try {
      // ✅ REAL API CALL: Backend endpoint ko PUT request bhej rahe hain
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth-token') || ''}`
        },
        // ✅ Name aur Email dono bhej rahe hain
        body: JSON.stringify({ 
            name: name,
            email: email 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Update failed: ${response.status}`);
      }

      // ✅ SAB SE IMPORTANT STEP:
      // refetch() call karne se AuthContext update ho jayega.
      // Dashboard aur Sidebar isi Context se email lete hain, toh wahan khud ba khud update ho jayega.
      await refetch();

      toast.success("Profile & Dashboard synced successfully!");
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.message || "Failed to update credentials.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-12 h-12 border-4 border-[#F06292] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12 relative overflow-hidden font-sans">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto relative z-10 space-y-10"
      >
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">
              Account <span className="text-[#F06292]">Security</span>
            </h1>
            <p className="text-[#F06292] mt-2 font-medium">Manage your persistent identity</p>
          </div>
          <Button asChild variant="outline" size="sm" className="border-[#F06292]/40 text-[#F06292] bg-[#F06292]/10 h-10 rounded-xl transition-all hover:bg-[#F06292]/20">
            <Link href="/dashboard" className="flex items-center gap-2">
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 1. Profile Identity Card */}
          <Card className="lg:col-span-1 bg-zinc-900/40 backdrop-blur-2xl border-zinc-800/50 rounded-[2.5rem] shadow-2xl">
            <CardHeader className="items-center pb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[2rem] bg-zinc-950 border-2 border-[#F06292]/20 flex items-center justify-center text-4xl font-black text-[#F06292] shadow-2xl shadow-[#F06292]/10 transition-transform group-hover:scale-105">
                  {name ? name.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
                </div>
                <Button size="icon" className="absolute -bottom-2 -right-2 rounded-xl bg-[#F06292] hover:bg-[#F06292]/80 text-zinc-950 shadow-xl active:scale-90 transition-all">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center mt-6 overflow-hidden w-full">
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent flex items-center justify-center gap-2">
                  {name || 'User'} <BadgeCheck className="w-5 h-5 text-[#F06292]" />
                </CardTitle>
                <CardDescription className="text-[#F06292] font-medium truncate px-4">{email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 flex items-center gap-3">
                <ShieldCheck className="text-[#F06292] w-5 h-5" />
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest">TODO Status</p>
                  <p className="text-xs font-bold text-zinc-300">Verified Session</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Edit Information Card */}
          <Card className="lg:col-span-2 bg-zinc-900/40 backdrop-blur-2xl border-zinc-800/50 rounded-[2.5rem] shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">Personal Credentials</CardTitle>
              <CardDescription className="text-[#F06292] font-medium">Update details synced with Todo Web</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                      <Input
                        id="fullName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-12 bg-zinc-950/50 border-zinc-800 rounded-2xl h-14 text-white focus:border-[#F06292] transition-all outline-none"
                        placeholder="Update Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</Label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-[#F06292] transition-colors" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 bg-zinc-950/50 border-zinc-800 rounded-2xl h-14 text-white focus:border-[#F06292] transition-all outline-none"
                        placeholder="Update Email"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">Member Since</Label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                    <Input
                      value={user ? new Date(user.createdAt || user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Not available'}
                      disabled
                      className="pl-12 bg-zinc-950/20 border-zinc-900 rounded-2xl h-14 text-zinc-400"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black h-16 rounded-[1.5rem] text-lg font-black transition-all hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect active:scale-95"
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Syncing Identity...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 italic">
                      <Save className="w-5 h-5" /> Sync Profile Changes
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Tech Specs Badge */}
        <div className="flex items-center justify-center gap-8 py-6 opacity-30">
          <div className="flex items-center gap-2"><Zap className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">FastAPI Backend</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> <span className="text-[10px] font-bold uppercase tracking-widest">Better Auth JWT</span></div>
        </div>
      </motion.div>
    </div>
  );
}
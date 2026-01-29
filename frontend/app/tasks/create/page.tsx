'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { useSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AddTaskForm from '@/components/AddTaskModal';
// Is line ko update karen ya add karen
import { CheckCircle2, LayoutDashboard, Eye, Plus, ShieldCheck, ArrowRight } from 'lucide-react';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateTaskPage() {
  const { data: session, isPending } = useSession();

  if (!session?.user && !isPending) {
    redirect('/login');
  }

  const [success, setSuccess] = useState(false);

  const handleTaskAdded = (newTask: Task) => {
    setSuccess(true);
    // Optionally redirect after a delay
    setTimeout(() => {
      // We could redirect here if needed
    }, 2000);

  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-[#F06292] p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F06292] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 max-w-md mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#F06292] shadow-lg shadow-[#F06292]/20 mb-6">
            <Plus className="text-zinc-950 w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent mb-4">
            BetterTasks
          </h1>
          <p className="text-[#F06292] text-lg mb-8">Please log in to create tasks</p>
          <Button asChild className="bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-black h-14 px-8 rounded-2xl hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect">
            <Link href="/login">Sign In</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#F06292]/5"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-zinc-900"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 max-w-2xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="bg-gradient-to-r from-[#F06292] to-white bg-clip-text text-transparent text-3xl sm:text-6xl tracking-tighter italic leading-[0.9]">
              Add New Task
            </h1>
            <p className="text-lg text-[#F06292] mt-2">
              Create a new task to stay organized
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="backdrop-blur-xl"
        >
         <Card className="relative overflow-hidden bg-zinc-900/40 backdrop-blur-2xl border-white/5 rounded-[2.5rem] shadow-2xl group transition-all duration-500 hover:border-[#F06292]/30">
  
  {/* Luminous Glow Effect */}
  <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F06292]/10 blur-[80px] rounded-full group-hover:bg-[#F06292]/20 transition-all" />
  
  <CardHeader className="relative z-10 pb-2">
    <CardTitle className="bg-gradient-to-r from-[#F06292] to-white bg-clip-text text-transparent text-4xl sm:text-5xl tracking-tighter italic leading-[0.9] font-medium py-2">
      {success ? "Task Completed!" : "New Task"}
    </CardTitle>
    <CardDescription className="text-[#F06292]/70 font-medium italic text-sm">
      {success 
        ? "Your data is now live on Neon PostgreSQL" 
        : "Initialize your next breakthrough with AI intelligence"
      }
    </CardDescription>
  </CardHeader>

  <CardContent className="relative z-10 mt-4">
    {success ? (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6 space-y-6">
        <div className="relative inline-flex mb-4">
          <div className="absolute inset-0 bg-[#F06292]/20 blur-xl rounded-full animate-pulse" />
          <div className="relative bg-zinc-950 border border-[#F06292]/30 w-16 h-16 rounded-full flex items-center justify-center">
            {/* Logic: Visual Success Confirmation */}
            <CheckCircle2 className="h-8 w-8 text-white" />
          </div>
        </div>

        <div className="flex flex-col gap-3 max-w-[280px] mx-auto">
          {/* UPDATED LINK: Ab yeh seedha Dashboard par le jaye ga */}
          <Button asChild className="bg-gradient-to-r from-[#F06292] to-white text-zinc-950 font-black h-14 rounded-2xl shadow-xl shadow-[#F06292]/20 hover:scale-[1.02] transition-transform">
            <Link href="/dashboard">
              <Eye className="w-4 h-4 mr-2" /> View All Tasks
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-[#F06292]/30 text-[#F06292] bg-[#F06292]/10 h-14 rounded-2xl">
            <Link href="/dashboard">
              <LayoutDashboard className="w-4 h-4 mr-2" /> Workspace Overview
            </Link>
          </Button>

          <button onClick={() => setSuccess(false)} className="text-[#F06292] text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">
            + Create Another
          </button>
        </div>
      </motion.div>
    ) : (
      <div className="space-y-4">
        <AddTaskForm onSuccess={handleTaskAdded} />
        <div className="pt-4">
          <Button asChild variant="outline" size="sm" className="border-[#F06292]/40 text-[#F06292] bg-[#F06292]/10 h-10 rounded-xl transition-all">
             <Link href="/dashboard" className="flex items-center gap-2">
              Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
             </Button>
        </div>
      </div>
    )}
  </CardContent>
</Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, SparklesIcon, UserIcon, LogOut,
  Search, Plus, CheckCircle2, Circle, Trash2,
  Calendar, Clock, ChevronRight, ShieldCheck, HomeIcon, MessageCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { tasks, loading: tasksLoading, toggleTaskCompletion, deleteTask, deletedCount, recentlyUpdatedTaskId: hookRecentlyUpdatedTaskId } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'updated' | 'deleted' | 'high' | 'medium' | 'low' | 'overdue'>('all');
  const [sortBy, setSortBy] = useState<'created' | 'title' | 'due_date' | 'priority'>('created');

  // Recently updated task logic
  const [recentlyUpdatedTaskId, setRecentlyUpdatedTaskId] = useState<string | number | null>(null);

  useEffect(() => {
    const storedTaskId = sessionStorage.getItem('recentlyUpdatedTaskId');
    if (storedTaskId) {
      setRecentlyUpdatedTaskId(storedTaskId);
      sessionStorage.removeItem('recentlyUpdatedTaskId');
    }
  }, []);

  useEffect(() => {
    if (hookRecentlyUpdatedTaskId) {
      setRecentlyUpdatedTaskId(hookRecentlyUpdatedTaskId);
    }
  }, [hookRecentlyUpdatedTaskId]);

  useEffect(() => {
    if (recentlyUpdatedTaskId) {
      const timer = setTimeout(() => {
        setRecentlyUpdatedTaskId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentlyUpdatedTaskId]);

  useEffect(() => {
    // Only redirect if we're not loading and user is definitely not authenticated
    // Wait for auth state to be fully loaded before checking
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, authLoading, router]);

  const processedTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'completed') return t.completed;
        if (statusFilter === 'pending') return !t.completed;
        if (statusFilter === 'overdue') {
          return !t.completed && t.due_date && new Date(t.due_date) < new Date();
        }
        if (statusFilter === 'updated') {
          return t.updated_at && t.created_at &&
                 new Date(t.updated_at).getTime() > new Date(t.created_at).getTime();
        }
        if (statusFilter === 'deleted') return false;
        if (statusFilter === 'high') return t.priority === 'high';
        if (statusFilter === 'medium') return t.priority === 'medium';
        if (statusFilter === 'low') return t.priority === 'low';
        return true;
      })
      .filter(t => {
        if (!searchQuery) return true; // If no search query, return all tasks

        const query = searchQuery.toLowerCase();
        const titleMatch = t.title.toLowerCase().includes(query);
        const descriptionMatch = t.description?.toLowerCase().includes(query) || false;
        const categoryMatch = t.category?.toLowerCase().includes(query) || false;
        const priorityMatch = t.priority.toLowerCase().includes(query);
        const dueDateMatch = t.due_date?.toLowerCase().includes(query) || false;

        return titleMatch || descriptionMatch || categoryMatch || priorityMatch || dueDateMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'due_date') return new Date(a.due_date || 0).getTime() - new Date(b.due_date || 0).getTime();
        if (sortBy === 'priority') {
          const pMap = { high: 3, medium: 2, low: 1 };
          return (pMap[b.priority as keyof typeof pMap] || 0) - (pMap[a.priority as keyof typeof pMap] || 0);
        }
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      });
  }, [tasks, statusFilter, searchQuery, sortBy]);

  const stats = useMemo(() => [
    { label: 'Total', value: tasks.length, color: 'text-[#F06292]' },
    { label: 'Pending', value: tasks.filter(t => !t.completed).length, color: 'text-[#F06292]' },
    { label: 'Completed', value: tasks.filter(t => t.completed).length, color: 'text-green-400' },
    { label: 'High Priority', value: tasks.filter(t => t.priority === 'high').length, color: 'text-red-400' },
    { label: 'Overdue', value: tasks.filter(t => !t.completed && t.due_date && new Date(t.due_date) < new Date()).length, color: 'text-orange-500' },
    { label: 'Updated', value: tasks.filter(t => t.updated_at && t.created_at &&
           new Date(t.updated_at).getTime() > new Date(t.created_at).getTime()).length, color: 'text-blue-400' },
    { label: 'Deleted', value: deletedCount, color: 'text-red-500' },
  ], [tasks, deletedCount]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-[#F06292]">
        <div className="w-12 h-12 border-4 border-[#F06292] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-[#F06292]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F06292] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#F06292]">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans relative">
      <AnimatedBackground />

      {/* Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <Button
          onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}
          className="bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-black rounded-xl px-4 hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <motion.aside
        id="mobile-menu"
        className="fixed inset-y-0 left-0 w-64 bg-zinc-900/90 backdrop-blur-3xl border-r border-zinc-800/50 p-6 flex flex-col z-40 transform -translate-x-full transition-transform duration-300 ease-in-out md:hidden"
      >
        <div className="mb-8">
          <h1 className="text-xl font-black bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent tracking-tighter italic uppercase">BetterTasks</h1>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active onClick={() => document.getElementById('mobile-menu')?.classList.add('hidden')} />
          <SidebarLink icon={SparklesIcon} label="AI Assistant" onClick={() => {router.push('/chat'); document.getElementById('mobile-menu')?.classList.add('hidden');}} />
          <SidebarLink icon={MessageCircleIcon} label="Chatbot" onClick={() => {router.push('/chat'); document.getElementById('mobile-menu')?.classList.add('hidden');}} />
          <SidebarLink icon={UserIcon} label="Profile" onClick={() => {router.push('/profile'); document.getElementById('mobile-menu')?.classList.add('hidden');}} />
          <SidebarLink icon={HomeIcon} label="Home" onClick={() => {router.push('/'); document.getElementById('mobile-menu')?.classList.add('hidden');}} />
          <div className="pt-6">
            <SidebarLink icon={LogOut} label="Logout" onClick={logout} />
          </div>
        </nav>
      </motion.aside>

      {/* Desktop Sidebar */}
      <motion.aside className="w-64 bg-zinc-900/40 backdrop-blur-3xl border-r border-zinc-800/50 p-6 flex flex-col z-30 hidden md:flex">
        <div className="mb-8 px-2">
          <h1 className="text-xl font-black bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent tracking-tighter italic uppercase">BetterTasks</h1>
        </div>
        <nav className="flex-1 space-y-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-2">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active />
          <SidebarLink icon={SparklesIcon} label="AI Assistant" onClick={() => router.push('/chat')} />
          <SidebarLink icon={MessageCircleIcon} label="Chatbot" onClick={() => router.push('/chat')} />
          <SidebarLink icon={UserIcon} label="Profile" onClick={() => router.push('/profile')} />
          <SidebarLink icon={HomeIcon} label="Home" onClick={() => router.push('/')} />
          <div className="pt-6">
            <SidebarLink icon={LogOut} label="Logout" onClick={logout} />
          </div>
        </nav>
      </motion.aside>

      <div className="flex-1 flex flex-col relative h-screen overflow-hidden md:ml-0">
        <header className="z-30 bg-zinc-950/40 backdrop-blur-xl border-b border-zinc-800/50 px-4 sm:px-6 py-3 sticky top-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#F06292]" />
            <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-100">Todo Task Organizer</span>
          </div>
          <Button onClick={() => router.push('/tasks/create')} className="bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-black rounded-lg sm:rounded-xl gap-1 sm:gap-2 px-4 sm:px-6 text-sm sm:text-base hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect transition-all active:scale-95">
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Create Task</span>
          </Button>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto z-20 relative no-scrollbar">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent tracking-tighter">
              Welcome, <span className="text-[#F06292] italic">{user?.name?.split(' ')[0] || 'Moosa'}!</span>
            </h1>
            <p className="text-[#F06292] mt-1 sm:mt-2 text-base sm:text-lg md:text-xl font-medium">Email: {user?.email || 'Not available'} | Your Tasks Are Now Current</p>
          </div>

          {/* Stats Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6 text-zinc-400">
            {stats.slice(0, 3).map((stat, i) => (
              <motion.div key={i} whileHover={{ y: -5, scale: 1.02 }} className="bg-zinc-900/40 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] backdrop-blur-lg border-2 border-t-[#F06292] border-l-[#F06292] border-r-white/10 border-b-white/10 transition-all duration-300 group shadow-2xl shadow-black/20">
                <p className="text-[#F06292] text-[10px] sm:text-[12px] font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black mt-1 sm:mt-2 transition-colors duration-300 ${stat.color} group-hover:text-white cursor-default`}>{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 text-zinc-400">
            {stats.slice(3).map((stat, i) => (
              <motion.div key={i + 3} whileHover={{ y: -5, scale: 1.02 }} className="bg-zinc-900/40 p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] backdrop-blur-lg border-2 border-t-[#F06292] border-l-[#F06292] border-r-white/10 border-b-white/10 transition-all duration-300 group shadow-2xl shadow-black/20">
                <p className="text-[#F06292] text-[10px] sm:text-[12px] font-black uppercase tracking-widest">{stat.label}</p>
                <h3 className={`text-2xl sm:text-3xl md:text-4xl font-black mt-1 sm:mt-2 transition-colors duration-300 ${stat.color} group-hover:text-white cursor-default`}>{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          {/* ✅ UPDATED CONTROLS SECTION */}
          <div className="flex flex-col items-center sm:items-stretch gap-4 sm:gap-6 mb-8 sm:mb-10">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-focus-within:text-[#F06292] transition-colors" />
              <input
                id="searchTasks"
                name="searchTasks"
                type="text"
                placeholder="Search Tasks..."
                className="w-full bg-zinc-900/50 border border-zinc-400/50 rounded-xl sm:rounded-2xl pl-12 pr-4 py-3 sm:py-5 text-zinc-200 focus:border-[#F06292] outline-none transition-all shadow-inner text-sm sm:text-base"
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center sm:justify-between gap-4 bg-zinc-900/10 p-3 rounded-xl sm:rounded-2xl border border-zinc-200/20 w-full">
              {/* Left Side Group: Sort & Priorities */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => setSortBy('due_date')}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                    sortBy === 'due_date' ? 'bg-[#F06292] text-zinc-950 shadow-lg shadow-[#F06292]/20' : 'bg-zinc-800/50 text-zinc-100 hover:text-[#F06292]'
                  }`}
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" /> Sort by Deadline
                </button>

                {/* ✅ Priority Buttons Moved Here (Next to Deadline) */}
                {(['high', 'medium', 'low'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setStatusFilter(p)}
                    className={`px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === p
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-300 text-black shadow-lg shadow-yellow-500/20'
                        : 'bg-zinc-800/50 text-zinc-100 hover:text-yellow-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="w-full sm:w-px h-px sm:h-6 bg-zinc-400 my-2" />

              {/* Right Side Group: Status Filters */}
              <div className="flex flex-wrap gap-1 justify-center">
                {(['all', 'pending', 'completed'] as const).map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-gradient-to-r from-[#F06292] to-[#FFFFFF] text-black shadow-lg shadow-[#F06292]/20' : 'text-zinc-100 hover:text-zinc-200 hover:bg-zinc-800/30'}`}>
                    {s}
                  </button>
                ))}
                <button
                  onClick={() => setStatusFilter('overdue')}
                  className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === 'overdue'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-300 text-black shadow-lg shadow-orange-500/20'
                      : 'text-zinc-100 hover:text-orange-300 hover:bg-zinc-800/30'
                  }`}
                >
                  Overdue
                </button>
                <button
                  onClick={() => setStatusFilter('updated')}
                  className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === 'updated'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-300 text-black shadow-lg shadow-blue-500/20'
                      : 'text-zinc-100 hover:text-blue-300 hover:bg-zinc-800/30'
                  }`}
                >
                  Updated
                </button>
                <button
                  onClick={() => setStatusFilter('deleted')}
                  className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === 'deleted'
                      ? 'bg-gradient-to-r from-red-500 to-red-300 text-black shadow-lg shadow-red-500/20'
                      : 'text-zinc-100 hover:text-red-300 hover:bg-zinc-800/30'
                  }`}
                >
                  Deleted
                </button>
              </div>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pb-20">
            {statusFilter === 'deleted' ? (
              <div className="col-span-full text-center py-16 sm:py-20">
                <div className="text-3xl sm:text-4xl mb-3">🗑️</div>
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent mb-2">No Deleted Tasks Shown</h3>
                <p className="text-zinc-400 max-w-xs sm:max-w-md mx-auto">Deleted tasks are removed. Counter shows {deletedCount} total.</p>
              </div>
            ) : processedTasks.length === 0 ? (
              <div className="col-span-full text-center py-16 sm:py-20">
                <div className="text-3xl sm:text-4xl mb-3">📋</div>
                <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">No Tasks Found</h3>
                <p className="text-zinc-400">Try changing your search or filter criteria.</p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {processedTasks.map((task) => (
                  <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <Card className={`bg-zinc-900/40 border border-zinc-500/50 rounded-2xl sm:rounded-[3rem] p-4 sm:p-6 hover:border-[#F06292]/40 transition-all group shadow-2xl relative overflow-hidden transition-all duration-500 ease-out hover:border-[#F06292]/70 hover:shadow-[0_0_40px_rgba(240,98,146,0.25)] hover:-translate-y-2 hover:scale-[1.02] ${recentlyUpdatedTaskId !== null && String(task.id) === String(recentlyUpdatedTaskId) ? 'ring-4 ring-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.8)] scale-[1.05] bg-blue-500/10 animate-pulse' : ''}`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {recentlyUpdatedTaskId !== null && String(task.id) === String(recentlyUpdatedTaskId) && <span className="text-blue-400 animate-pulse text-xl sm:text-2xl">★</span>}
                            <h3 className={`text-lg sm:text-xl font-bold truncate ${task.completed ? 'line-through text-zinc-600 italic font-medium' : 'bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent'}`}>{task.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                            <span className="flex items-center gap-1 text-[10px] sm:text-[12px] font-black text-white uppercase bg-zinc-950/40 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-white/5"><Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-[#F06292]" /> {new Date(task.created_at).toLocaleDateString()}</span>
                            {task.due_date && <span className={`flex items-center gap-1 text-[10px] sm:text-[12px] font-black uppercase bg-zinc-950/40 px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg border border-white/5 ${new Date(task.due_date) < new Date() ? 'text-red-400 animate-pulse' : 'text-white'}`}><Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" /> Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                          <button onClick={() => toggleTaskCompletion(task.id)} className={`p-2 rounded-lg transition-all ${task.completed ? 'bg-green-500/20 text-green-500 shadow-inner' : 'bg-zinc-950/50 text-zinc-100 hover:text-[#F06292]'}`}>{task.completed ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" /> : <Circle className="w-4 h-4 sm:w-5 sm:h-5" />}</button>
                          <button onClick={() => deleteTask(task.id)} className="p-2 bg-zinc-950/50 rounded-lg text-white hover:text-red-500 transition-all hover:bg-red-500/10 active:scale-90"><Trash2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" /></button>
                        </div>
                      </div>
                      <p className="text-white text-sm h-10 sm:h-12 line-clamp-2 mt-3 sm:mt-4 mb-4 sm:mb-6 font-medium leading-relaxed opacity-80">{task.description || 'Secure task synchronization enabled.'}</p>
                      <div className="flex flex-col sm:flex-row justify-between items-center pt-3 sm:pt-5 border-t border-zinc-800/50 gap-2 sm:gap-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className={`text-[7px] sm:text-[9px] font-black px-2 sm:px-4 py-1.5 sm:py-2 rounded-full border tracking-[0.1em] sm:tracking-[0.2em] uppercase ${task.priority === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/30' : task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}`}>{task.priority || 'Normal'}</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/tasks/edit/${task.id}`)} className="text-white hover:text-[#F06292] p-0 h-auto flex items-center gap-1 sm:gap-2 text-[12px] sm:text-[15px] font-black uppercase tracking-widest transition-all">Edit Task <ChevronRight className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#F06292]" /></Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-5 px-6 py-5 rounded-[2.5rem] transition-all group ${active ? 'bg-gradient-to-r from-[#F06292] to-[#FFFFFF] text-black shadow-2xl shadow-[#F06292]/20 font-black' : 'text-zinc-100 hover:text-[#F06292] hover:bg-zinc-800/90 font-bold'}`}>
      <Icon className={`w-6 h-6 ${active ? 'text-black' : 'text-[#F06292] group-hover:scale-110 transition-transform'}`} />
      <span className={`text-sm tracking-tight ${active ? 'text-black' : ''}`}>{label}</span>
    </button>
  );
}
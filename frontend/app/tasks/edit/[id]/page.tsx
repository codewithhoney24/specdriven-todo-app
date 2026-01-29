'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/types/task';
import { apiService } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle, Plus, LayoutDashboard, ArrowLeft, ArrowRight,  } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import AddTaskForm from '@/components/AddTaskModal';

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { updateTask, refetch } = useTasks();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id || !user?.id) return;

    const fetchTask = async () => {
      try {
        const response = await apiService.tasks.getById(Number(id), user.id);
        setTask(response.data);
      } catch (error) {
        console.error('Error fetching task:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, user?.id]);

  const handleTaskUpdate = async (updatedTask: Task) => {
    if (!id || !user?.id) return;

    try {
      setSuccess(true);

      // Store the updated task ID in sessionStorage to show the blue star on the dashboard
      sessionStorage.setItem('recentlyUpdatedTaskId', Number(id).toString());

      // Refetch to update the task in the local state
      await refetch();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-[#F06292] p-4">
        <div className="w-12 h-12 border-4 border-[#F06292] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="text-center py-10 max-w-md mx-auto">
          <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent mb-4">
            Task Not Found
          </h1>
          <p className="text-[#F06292] text-lg mb-8">The task you're looking for doesn't exist</p>
          <Button asChild className="bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-black h-14 px-8 rounded-2xl hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
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
            animate={{ x: 0, opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="bg-gradient-to-r from-[#F06292] to-white bg-clip-text text-transparent text-3xl sm:text-6xl tracking-tighter italic leading-[0.9]">
              {success ? "Update Successful!" : "Edit Task"}
            </h1>
            <p className="text-lg text-[#F06292] mt-2">
              {success
                ? "Your task has been updated in the database"
                : "Modify your existing task details"}
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
            {/* Logic: Luminous Gradient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#F06292]/10 blur-[80px] rounded-full group-hover:bg-[#F06292]/20 transition-all" />

            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950/50 border border-white/5">
                  <ShieldCheck className="w-3 h-3 text-[#F06292]" />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">JWT Secure Sync</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <CardTitle className="bg-gradient-to-r from-[#F06292] to-white bg-clip-text text-transparent text-4xl sm:text-5xl tracking-tighter italic leading-[0.9] font-medium py-2">
                  {success ? "Update Successful!" : "Editing Task"}
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="text-[#F06292] hover:text-white hover:bg-white/5 p-0 h-auto flex items-center gap-1 text-[10px] font-black uppercase">
                  <Link href="/dashboard">
                    <ArrowRight className="w-3 h-3 mr-1" /> Back to Dashboard
                  </Link>
                </Button>
              </div>

              <CardDescription className="text-[#F06292]/70 font-medium italic text-sm">
                {success
                  ? "Task has been successfully updated in Neon DB"
                  : "Make changes to your task and save to database"
                }
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 mt-4">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-10 space-y-8"
                >
                  {/* Animated Success Icon with Rose Glow */}
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-[#F06292]/20 blur-xl rounded-full animate-pulse" />
                    <div className="relative bg-zinc-950 border border-[#F06292]/30 w-20 h-20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-zinc-400 text-sm font-medium max-w-[250px] mx-auto leading-relaxed">
                      Your task has been successfully updated in your personal workspace.
                    </p>

                    <div className="flex flex-col gap-3">
                      <Button asChild className="bg-gradient-to-r from-[#F06292] to-white text-zinc-950 font-black h-14 rounded-2xl shadow-xl shadow-[#F06292]/20 hover:scale-[1.02] transition-transform">
                        <Link href="/dashboard">
                          <LayoutDashboard className="w-4 h-4 mr-2" /> Return to Dashboard
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => router.push('/tasks')} // Go back to tasks page
                        className="text-[#F06292] hover:text-white hover:bg-white/5 font-bold italic tracking-tight"
                      >
                        <Plus className="w-4 h-4 mr-2" /> View All Tasks
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Task Form Component with initial values */}
                  <AddTaskForm
                    onSuccess={handleTaskUpdate}
                    userId={user?.id}
                    updateTask={updateTask} // Pass the updateTask function from the hook
                    initialValues={{
                      id: task.id,
                      title: task.title,
                      description: task.description || '',
                      priority: task.priority as 'low' | 'medium' | 'high',
                      due_date: task.due_date || '',
                      category: task.category || 'General',
                      completed: task.completed
                    }}
                  />
                </motion.div>
              )}
            </CardContent>

            {/* Design Detail: Bottom Aesthetic Border */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#F06292]/40 to-transparent" />
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Task } from '@/types/task';
import { apiService as api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { redirect } from 'next/navigation';

import { TaskList } from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskModal';
import { motion } from 'framer-motion';
import { Plus, ListTodo, LayoutDashboard, ArrowRight } from 'lucide-react';

export default function TasksPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { tasks, loading, refetch, fetchTaskSubtasks } = useTasks();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      redirect('/login');
    }
  }, [isAuthenticated, authLoading]);

  const handleTaskAdded = async (newTask: Task) => {
    try {
      // Call the API to create the task
      const response = await api.tasks.create({
        title: newTask.title,
        description: newTask.description
      }, user?.id);

      if (response.data) {
        // Refresh the tasks list to include the new task
        refetch();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleTaskUpdated = async (updatedTask: Task) => {
    try {
      // Call the API to update the task
      const response = await api.tasks.update(updatedTask.id, {
        title: updatedTask.title,
        description: updatedTask.description,
        completed: updatedTask.completed
      }, user?.id);

      if (response.data) {
        // Refresh the tasks list to reflect the updated task
        refetch();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDeleted = async (deletedTaskId: number) => {
    try {
      // Call the API to delete the task
      await api
      .tasks.delete(deletedTaskId, user?.id);

      // Refresh the tasks list to reflect the deletion
      refetch();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-[#F06292] p-4">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F06292] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-10 max-w-md mx-auto"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-[#F06292] shadow-lg shadow-[#F06292]/20 mb-6">
            <ListTodo className="text-zinc-950 w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent mb-4">
            BetterTasks
          </h1>
          <p className="text-[#F06292] text-lg mb-8">Please log in to access your tasks</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-[#F06292]/70 to-[#FFFFFF]/90 text-black font-black h-14 px-8 rounded-2xl hover:from-[#F06292] hover:to-white hover:opacity-90 btn-shine-effect"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#F06292]/5"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-zinc-900"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8 max-w-6xl mx-auto relative z-10"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">
              View Tasks
            </h1>
            <p className="text-base sm:text-lg text-[#F06292] mt-1 sm:mt-2">
              Manage your tasks efficiently
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          <div>
            <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 rounded-2xl sm:rounded-[2.5rem] shadow-2xl">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">All Tasks</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <CardDescription className="text-[#F06292]">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </CardDescription>
                    <Button asChild variant="outline" size="sm" className="border-[#F06292]/40 text-[#F06292] bg-[#F06292]/10 h-10 rounded-xl transition-all">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        Dashboard <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TaskList
                  tasks={tasks}
                  onUpdateTask={handleTaskUpdated}
                  onDeleteTask={handleTaskDeleted}
                  fetchTaskSubtasks={fetchTaskSubtasks}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 rounded-2xl sm:rounded-[2.5rem] shadow-2xl">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent">Create Task</CardTitle>
                <CardDescription className="text-[#F06292]">
                  Add a new task to your list
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AddTaskForm
                  userId={user.id}
                  onSuccess={handleTaskAdded}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
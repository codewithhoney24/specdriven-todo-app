'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Task } from '@/types/task';
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  AlertCircle, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  fetchTaskSubtasks: (taskId: number) => void;
  loading: boolean;
}

export const TaskList = ({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  fetchTaskSubtasks, 
  loading 
}: TaskListProps) => {
  const router = useRouter();
  
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-10 h-10 border-4 border-[#F06292] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="mx-auto w-16 h-16 bg-[#F06292]/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-[#F06292]" />
        </div>
        <h3 className="text-lg font-medium text-zinc-300">No tasks found</h3>
        <p className="text-[#F06292] mt-1">Get started by creating a new task</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 hover:border-[#F06292]/40 transition-all group shadow-lg relative overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-3 sm:gap-4">
                <div className="flex-1 pr-4">
                  <h3 className={`text-base sm:text-lg font-bold truncate ${task.completed ? 'line-through text-zinc-600 italic font-medium' : 'bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent'}`}>
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="flex items-center gap-1 text-[7px] sm:text-[8px] font-black text-white uppercase bg-zinc-950/40 px-2 py-1 rounded">
                      <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F06292]" />
                      {new Date(task.created_at).toLocaleDateString()}
                    </span>
                    {task.due_date && (
                      <span className={`flex items-center gap-1 text-[7px] sm:text-[8px] font-black uppercase bg-zinc-950/40 px-2 py-1 rounded ${
                        new Date(task.due_date) < new Date() ? 'text-red-400 animate-pulse' : 'text-white'
                      }`}>
                        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        Due: {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2">
                  <button
                    onClick={() => onUpdateTask({...task, completed: !task.completed})}
                    className={`p-2 rounded-lg transition-all ${
                      task.completed
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-zinc-950/50 text-zinc-500 hover:text-[#F06292]'
                    }`}
                  >
                    {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 bg-zinc-950/50 rounded-lg text-white hover:text-red-500 transition-all hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              <p className="text-white text-sm h-10 line-clamp-2 mt-3 sm:mt-4 mb-4 sm:mb-6 font-medium leading-relaxed">
                {task.description || 'Task description not provided.'}
              </p>

              <div className="flex flex-col sm:flex-row justify-between items-center pt-3 sm:pt-4 border-t border-zinc-800/50 gap-2 sm:gap-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[7px] sm:text-[8px] font-black px-2 py-1 rounded-full border uppercase ${
                    task.priority === 'high'
                      ? 'bg-red-500/10 text-red-500 border-red-500/30'
                      : 'bg-[#F06292]/10 text-[#F06292] border-[#F06292]/30'
                  }`}>
                    {task.priority || 'Normal'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/tasks/edit/${task.id}`)}
                  className="text-white hover:text-[#F06292] p-0 h-auto flex items-center gap-1 text-[8px] sm:text-[9px] font-black uppercase transition-all"
                >
                  Edit <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F06292]" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
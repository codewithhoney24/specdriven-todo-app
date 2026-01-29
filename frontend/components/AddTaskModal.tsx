'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Task } from '@/types/task';
import { apiService as api } from '@/lib/api'; //
import { useAuth } from '@/context/AuthContext'; 
import { Plus, Sparkles, Calendar, Tag, Link, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AddTaskForm({ onSuccess, userId, initialValues, updateTask }: { onSuccess: (task: Task) => void, userId?: string, initialValues?: Partial<Task>, updateTask?: (taskId: number | string, data: Partial<Task>) => Promise<void> }) {
  const { user } = useAuth();
  const userIdToUse = userId || user?.id;
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(initialValues?.priority as 'low' | 'medium' | 'high' || 'medium');
  const [dueDate, setDueDate] = useState(initialValues?.due_date || '');
  const [category, setCategory] = useState(initialValues?.category || 'General'); // Default category
  const [loading, setLoading] = useState(false);

  // Predefined Categories
  const categoryOptions = [
    "Work", "Personal", "Education", "Health", "Shopping", "Finance", "General"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields before submitting
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }

    setLoading(true);

    try {
      if (initialValues?.id) {
        // Update existing task using the updateTask function from the hook if provided
        if (updateTask) {
          await updateTask(initialValues.id, {
            title,
            description,
            priority,
            due_date: dueDate || undefined, // Send undefined if empty string to match backend expectations
            category,
            completed: initialValues.completed  // Keep the original completed status
          });
          // Call onSuccess after updateTask completes
          onSuccess({
            id: initialValues.id,
            title,
            description,
            priority,
            due_date: dueDate || undefined,
            category,
            completed: initialValues.completed || false,
            created_at: initialValues.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user_id: userIdToUse || ''
          });
        } else {
          // Ensure due_date is properly formatted if it exists
          let formattedDueDate = undefined;
          if (dueDate) {
            try {
              // Try to parse the date to ensure it's valid
              const dateObj = new Date(dueDate);
              if (!isNaN(dateObj.getTime())) {
                formattedDueDate = dateObj.toISOString();
              }
            } catch (e) {
              console.error('Invalid date format:', dueDate);
            }
          }

          // Fallback to direct API call if updateTask is not provided
          const response = await api.tasks.update(initialValues.id, {
            title,
            description,
            priority,
            due_date: formattedDueDate,
            category,
            completed: initialValues.completed  // Keep the original completed status
          }, userIdToUse);

          if (response.data) {
            onSuccess(response.data);
          }
        }
      } else {
        // Create new task
        // Ensure due_date is properly formatted if it exists
        let formattedDueDate = undefined;
        if (dueDate) {
          try {
            // Try to parse the date to ensure it's valid
            const dateObj = new Date(dueDate);
            if (!isNaN(dateObj.getTime())) {
              formattedDueDate = dateObj.toISOString();
            }
          } catch (e) {
            console.error('Invalid date format:', dueDate);
          }
        }

        const response = await api.tasks.create({
          title,
          description,
          priority,
          due_date: formattedDueDate,
          category,
          completed: false
        }, userIdToUse);

        if (response.data) {
          onSuccess(response.data);
          // Form Reset only for new tasks
          setTitle('');
          setDescription('');
          setDueDate('');
          setCategory('General');
        }
      }

      // Only call onSuccess with the updated task data if it's a new task (not an update)
      // For updates, the updateTask function from the hook handles the success callback
      if (!initialValues?.id) {
        onSuccess({
          id: 0, // This will be updated with the actual response in the calling component
          title,
          description,
          priority,
          due_date: dueDate || undefined,
          category,
          completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: userIdToUse || ''
        });
      }

      toast.success(initialValues?.id ? "Task updated and synced!" : "Task saved and synced!");
    } catch (err) {
      toast.error("Database sync failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group">
      {/* Rose-to-Purple Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#F06292] to-[#7212ae] rounded-2xl sm:rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition-opacity"></div>

      <form onSubmit={handleSubmit} className="relative bg-zinc-900/80 backdrop-blur-2xl rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 space-y-6 border border-white/5 shadow-2xl">

        <header className="space-y-2">
          <div className="flex items-center gap-2 sm:gap-3">
             <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-[#F06292]" />
             <h3 className="text-2xl sm:text-4xl tracking-tighter italic bg-gradient-to-r from-[#F06292] to-white bg-clip-text text-transparent leading-none">
               Create Task
             </h3>
          </div>

          <p className="text-zinc-500 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Secure Persistent Storage</p>
        </header>

        <div className="space-y-4">
          {/* 1. Title Input (White Text) */}
          <div className="space-y-1">
            <label htmlFor="taskTitle" className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#F06292]/80 ml-1">Task Title *</label>
            <Input
              id="taskTitle"
              name="taskTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be achieved?"
              required
              className="bg-zinc-950/90 border-zinc-800 rounded-lg sm:rounded-xl h-10 sm:h-12 text-white placeholder:text-zinc-600 focus:border-[#F06292] transition-all px-3 sm:px-4 text-sm"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 2. Priority Select */}
            <div className="space-y-1">
              <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#F06292]/80 ml-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg sm:rounded-xl h-10 sm:h-12 px-2 sm:px-3 text-xs sm:text-sm text-white focus:border-[#F06292] outline-none cursor-pointer"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            {/* 3. Due Date Calendar Input */}
            <div className="space-y-1">
              <label htmlFor="dueDate" className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#F06292]/80 ml-1 flex items-center gap-1">
                <Calendar className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> Due Date
              </label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-zinc-950/90 border-zinc-800 rounded-lg sm:rounded-xl h-10 sm:h-12 text-white focus:border-[#F06292] uppercase text-[8px] sm:text-[10px] cursor-pointer"
                autoComplete="off"
              />
            </div>
          </div>

          {/* 4. Category Select Option */}
          <div className="space-y-1">
            <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#F06292]/80 ml-1 flex items-center gap-1">
              <Tag className="w-2.5 sm:w-3 h-2.5 sm:h-3" /> Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-zinc-950/90 border border-zinc-800 rounded-lg sm:rounded-xl h-10 sm:h-12 px-2 sm:px-3 text-xs sm:text-sm text-white focus:border-[#F06292] outline-none cursor-pointer"
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-zinc-900">{opt}</option>
              ))}
            </select>
          </div>

          {/* 5. Description Textarea */}
          <div className="space-y-1">
            <label className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#F06292]/80 ml-1">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add some context..."
              className="bg-zinc-950/90 border-zinc-800 rounded-lg sm:rounded-xl h-24 sm:h-28 text-white placeholder:text-zinc-600 focus:border-[#F06292] resize-none px-3 sm:px-4 py-3 text-sm"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#F06292] to-white text-zinc-950 font-black h-12 sm:h-14 rounded-xl sm:rounded-2xl shadow-xl shadow-[#F06292]/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 text-base sm:text-lg italic tracking-tighter"
        >
          {loading ? (
            <div className="w-4 sm:w-5 h-4 sm:h-5 border-4 border-zinc-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-4 sm:w-5 h-4 sm:h-5" /> Create Task
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
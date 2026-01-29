'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TaskList } from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskModal';
import { Task } from '@/types/task';

export default function ResponsiveTestPage() {
  // Mock tasks for demonstration
  const mockTasks: Task[] = [
    {
      id: 1,
      title: 'Sample Task 1',
      description: 'This is a sample task to test responsiveness',
      completed: false,
      priority: 'high',
      due_date: '2026-12-31',
      category: 'Work',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      user_id: '1'
    },
    {
      id: 2,
      title: 'Sample Task 2',
      description: 'Another sample task to test responsiveness',
      completed: true,
      priority: 'medium',
      due_date: '2026-11-30',
      category: 'Personal',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      user_id: '1'
    },
    {
      id: 3,
      title: 'Sample Task 3',
      description: 'Yet another sample task to test responsiveness',
      completed: false,
      priority: 'low',
      due_date: '2026-10-31',
      category: 'Education',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      user_id: '1'
    }
  ];

  const handleTaskUpdate = (task: Task) => {
    console.log('Updating task:', task);
  };

  const handleTaskDelete = (taskId: number) => {
    console.log('Deleting task:', taskId);
  };

  const handleTaskAdded = (task: Task) => {
    console.log('Adding task:', task);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent mb-8 text-center">
          Responsive Design Test Page
        </h1>
        
        <p className="text-[#F06292] text-center mb-12">
          This page demonstrates the responsive design across different screen sizes
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* UI Components Test */}
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent mb-6">
              UI Components
            </h2>
            
            <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 rounded-2xl sm:rounded-[2.5rem] p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-4 mb-6">
                <Button>Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Inputs</h3>
              <div className="space-y-4 mb-6">
                <Input placeholder="Regular input" />
                <Textarea placeholder="Textarea input" rows={3} />
              </div>
            </Card>
          </div>

          {/* Task Components Test */}
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent mb-6">
              Task Components
            </h2>
            
            <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 rounded-2xl sm:rounded-[2.5rem] p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Task List</h3>
              <TaskList
                tasks={mockTasks}
                onUpdateTask={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
                fetchTaskSubtasks={() => {}}
                loading={false}
              />
            </Card>
            
            <Card className="bg-zinc-900/40 backdrop-blur-sm border-zinc-800/50 rounded-2xl sm:rounded-[2.5rem] p-6">
              <h3 className="text-lg font-semibold mb-4">Add Task Form</h3>
              <AddTaskForm onSuccess={handleTaskAdded} />
            </Card>
          </div>
        </div>

        <div className="text-center py-12">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#F06292] to-[#FFFFFF] bg-clip-text text-transparent mb-4">
            Responsive Design Elements
          </h2>
          <p className="text-[#F06292] max-w-2xl mx-auto">
            This website is fully responsive and adapts to all screen sizes from mobile to desktop.
            The layout adjusts dynamically based on the viewport size, ensuring optimal viewing experience
            on all devices.
          </p>
        </div>
      </div>
    </div>
  );
}
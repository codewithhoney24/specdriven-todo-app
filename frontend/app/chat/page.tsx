'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Send, Sparkles, Bot, ArrowRight, LayoutDashboard, Loader2, Trash2, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { apiService as api } from '@/lib/api';
import { useTasks } from '@/hooks/useTasks'; 
import { Task } from '@/types/task';
import { toast } from 'sonner';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const { user } = useAuth();
  const { deletedCount } = useTasks(); 
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTasks, setIsFetchingTasks] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const CHAT_HISTORY_KEY = `chat_history_${user?.id || 'guest'}`;

  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const messagesWithDates = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (err) {
        console.error('Failed to load chat history', err);
      }
    }
  }, [user?.id, CHAT_HISTORY_KEY]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages, CHAT_HISTORY_KEY]);

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        if (user?.id) {
          setIsFetchingTasks(true);
          const response = await api.tasks.getAll(user.id);
          if (response.data) {
            setTasks(response.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        toast.error("Could not load tasks from database");
      } finally {
        setIsFetchingTasks(false);
      }
    };
    fetchRealData();
  }, [user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const clearHistory = () => {
    if (confirm('Clear all chat history? This cannot be undone.')) {
      setMessages([]);
      localStorage.removeItem(CHAT_HISTORY_KEY);
      toast.success('Chat history cleared');
    }
  };

  // ✅ UPDATED: Context-aware query processing with "Beautiful General Responses"
  const processQuery = (query: string, conversationContext: Message[]): string => {
    const q = query.toLowerCase().trim();

    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks: Task[] = tasks.filter(t => t.completed);
    const highPriorityTasks: Task[] = tasks.filter(t => t.priority === 'high' && !t.completed);
    const mediumPriorityTasks: Task[] = tasks.filter(t => t.priority === 'medium' && !t.completed);
    const lowPriorityTasks: Task[] = tasks.filter(t => t.priority === 'low' && !t.completed);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const overdueTasks: Task[] = tasks.filter(t =>
      t.due_date && new Date(t.due_date) < today && !t.completed
    );

    const todayTasks: Task[] = tasks.filter(t =>
      t.due_date &&
      new Date(t.due_date).getDate() === today.getDate() &&
      new Date(t.due_date).getMonth() === today.getMonth() &&
      new Date(t.due_date).getFullYear() === today.getFullYear() &&
      !t.completed
    );

    const upcomingTasks: Task[] = tasks.filter(t =>
      t.due_date &&
      new Date(t.due_date) >= today &&
      new Date(t.due_date) <= nextWeek &&
      !t.completed
    );

    const currentDeletedCount = deletedCount;

    // 1. Check for General/Random Topics (Science, Urdu, Math, etc.)
    const generalTopics: Record<string, string> = {
      science: "Science is the key to understanding the universe! 🌌 While I manage your tasks, I'd love to help you clear your schedule so you can explore more scientific wonders.",
      urdu: "Urdu ek bohot hi pyari aur meethi zaban hai! ✨ Aap apni task list mein Urdu poetry likhna chahen toh zaroor bataiye ga.",
      math: "Numbers and logic are my favorite! 🔢 I'm calculating your task efficiency right now. How can I help you solve your daily routine?",
      history: "History teaches us how to better manage our future! 🏛️ Let's make history by completing all your pending tasks today.",
      computer: "Computers are my home! 💻 I'm running on Neon DB and FastAPI to keep your tasks safe and lightning fast.",
      english: "English is a great global language! 🌍 I can communicate with you in English, Urdu, or whatever you prefer.",
      art: "Creativity makes life beautiful! 🎨 Maybe add a 'Creative Hour' to your task list today?",
    };

    if (generalTopics[q]) return generalTopics[q];

    // Enhanced Natural Language Processing for Task Queries
    // Check for overdue tasks
    if (q.includes('overdue') || q.includes('past due') || q.includes('late')) {
      if (overdueTasks.length === 0) {
        return "✅ **No Overdue Tasks!**\n\nGreat job staying on top of your tasks! You have no overdue items.";
      }
      const list = overdueTasks.slice(0, 5).map((t, i) => `${i + 1}. ⚠️ ${t.title} (${t.due_date})`).join('\n');
      return `⚠️ **Overdue Tasks (${overdueTasks.length}):**\n\n${list}${overdueTasks.length > 5 ? '\n...and more' : ''}`;
    }

    // Check for tasks due today
    if (q.includes('today') || q.includes('for today') || q.includes('what needs to be done today')) {
      if (todayTasks.length === 0) {
        return "✅ **No Tasks Due Today!**\n\nYou're all caught up! No tasks are due today.";
      }
      const list = todayTasks.slice(0, 5).map((t, i) => `${i + 1}. 📅 ${t.title}`).join('\n');
      return `📅 **Tasks Due Today (${todayTasks.length}):**\n\n${list}${todayTasks.length > 5 ? '\n...and more' : ''}`;
    }

    // Check for upcoming tasks (next 7 days)
    if (q.includes('upcoming') || q.includes('next 7 days') || q.includes('this week') || q.includes('week') || q.includes('7 days')) {
      if (upcomingTasks.length === 0) {
        return "📋 **No Upcoming Tasks**\n\nYou don't have any tasks scheduled for the next 7 days.";
      }
      const list = upcomingTasks.slice(0, 5).map((t, i) => `${i + 1}. 📅 ${t.title} (${t.due_date})`).join('\n');
      return `📅 **Upcoming Tasks (${upcomingTasks.length}):**\n\n${list}${upcomingTasks.length > 5 ? '\n...and more' : ''}`;
    }

    // Check for priority-based queries
    if (q.includes('high priority') || q.includes('high prio') || q.includes('urgent') || q.includes('important')) {
      if (highPriorityTasks.length === 0) {
        return "✅ **No High Priority Tasks**\n\nYou don't have any high priority tasks at the moment.";
      }
      const list = highPriorityTasks.slice(0, 5).map((t, i) => `${i + 1}. 🔴 ${t.title}`).join('\n');
      return `🔴 **High Priority Tasks (${highPriorityTasks.length}):**\n\n${list}${highPriorityTasks.length > 5 ? '\n...and more' : ''}`;
    }

    if (q.includes('medium priority') || q.includes('medium prio')) {
      if (mediumPriorityTasks.length === 0) {
        return "✅ **No Medium Priority Tasks**\n\nYou don't have any medium priority tasks at the moment.";
      }
      const list = mediumPriorityTasks.slice(0, 5).map((t, i) => `${i + 1}. 🟡 ${t.title}`).join('\n');
      return `🟡 **Medium Priority Tasks (${mediumPriorityTasks.length}):**\n\n${list}${mediumPriorityTasks.length > 5 ? '\n...and more' : ''}`;
    }

    if (q.includes('low priority') || q.includes('low prio')) {
      if (lowPriorityTasks.length === 0) {
        return "✅ **No Low Priority Tasks**\n\nYou don't have any low priority tasks at the moment.";
      }
      const list = lowPriorityTasks.slice(0, 5).map((t, i) => `${i + 1}. 🟢 ${t.title}`).join('\n');
      return `🟢 **Low Priority Tasks (${lowPriorityTasks.length}):**\n\n${list}${lowPriorityTasks.length > 5 ? '\n...and more' : ''}`;
    }

    // Check for general priority tasks query
    if (q.includes('priority tasks') || (q.includes('priority') && q.includes('list'))) {
      const allPriorityTasks = [...highPriorityTasks, ...mediumPriorityTasks, ...lowPriorityTasks];
      if (allPriorityTasks.length === 0) {
        return "✅ **No Priority Tasks**\n\nYou don't have any priority tasks at the moment.";
      }

      const highList = highPriorityTasks.length > 0
        ? `🔴 High Priority (${highPriorityTasks.length}):\n${highPriorityTasks.slice(0, 3).map((t, i) => `  ${i + 1}. ${t.title}`).join('\n')}${highPriorityTasks.length > 3 ? '\n  ...and more' : ''}\n`
        : '';

      const mediumList = mediumPriorityTasks.length > 0
        ? `🟡 Medium Priority (${mediumPriorityTasks.length}):\n${mediumPriorityTasks.slice(0, 3).map((t, i) => `  ${i + 1}. ${t.title}`).join('\n')}${mediumPriorityTasks.length > 3 ? '\n  ...and more' : ''}\n`
        : '';

      const lowList = lowPriorityTasks.length > 0
        ? `🟢 Low Priority (${lowPriorityTasks.length}):\n${lowPriorityTasks.slice(0, 3).map((t, i) => `  ${i + 1}. ${t.title}`).join('\n')}${lowPriorityTasks.length > 3 ? '\n  ...and more' : ''}\n`
        : '';

      return `📊 **Priority Tasks Summary:**\n\n${highList}${mediumList}${lowList}`;
    }

    // Check for work-related tasks (assuming tasks with certain keywords are work-related)
    if (q.includes('work') && (q.includes('medium') || q.includes('priority'))) {
      const workMediumPriorityTasks = tasks.filter(t =>
        !t.completed &&
        t.priority === 'medium' &&
        (t.title.toLowerCase().includes('work') ||
         t.description?.toLowerCase().includes('work') ||
         t.category?.toLowerCase().includes('work'))
      );

      if (workMediumPriorityTasks.length === 0) {
        return "✅ **No Medium Priority Work Tasks**\n\nYou don't have any medium priority work tasks at the moment.";
      }
      const list = workMediumPriorityTasks.slice(0, 5).map((t, i) => `${i + 1}. 🟡 ${t.title}`).join('\n');
      return `🟡 **Medium Priority Work Tasks (${workMediumPriorityTasks.length}):**\n\n${list}${workMediumPriorityTasks.length > 5 ? '\n...and more' : ''}`;
    }

    // Check for shopping list
    if (q.includes('shopping') || q.includes('grocery') || q.includes('buy')) {
      const shoppingTasks = tasks.filter(t =>
        t.category?.toLowerCase().includes('shopping') ||
        t.title.toLowerCase().includes('shop') ||
        t.description?.toLowerCase().includes('shop')
      );

      if (shoppingTasks.length === 0) {
        return "🛒 **No Shopping Items**\n\nYou don't have any shopping-related tasks in your list.";
      }
      const list = shoppingTasks.slice(0, 5).map((t, i) => `${i + 1}. 🛒 ${t.title}`).join('\n');
      return `🛒 **Shopping List (${shoppingTasks.length}):**\n\n${list}${shoppingTasks.length > 5 ? '\n...and more' : ''}`;
    }

    // Check for updated tasks
    if (q.includes('updated') || q.includes('recently updated') || q.includes('modified')) {
      const updatedTasks = tasks.filter(t =>
        t.updated_at && t.created_at &&
        new Date(t.updated_at).getTime() > new Date(t.created_at).getTime()
      );

      if (updatedTasks.length === 0) {
        return "✅ **No Recently Updated Tasks**\n\nYou don't have any tasks that have been recently updated.";
      }

      const list = updatedTasks.slice(0, 5).map((t, i) => `${i + 1}. 🔄 ${t.title}`).join('\n');
      return `🔄 **Recently Updated Tasks (${updatedTasks.length}):**\n\n${list}${updatedTasks.length > 5 ? '\n...and more' : ''}`;
    }

    // Check for common greetings and simple queries
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'hello!' || q === 'hi!' || q === 'hey!') {
      return `👋 Hello! I'm your Task Assistant. Ask about your tasks, status, or anything else!`;
    }

    // Check for previous conversation queries
    if (q.includes('previous conversation') || q.includes('conversation history') || q.includes('past chat') || q.includes('earlier chat')) {
      // Get recent conversation history from the current session
      const recentMessages = messages.filter(msg => msg.role === 'assistant' && msg.content !== '').slice(-5); // Get last 5 assistant messages

      if (recentMessages.length === 0) {
        return `📚 **Conversation History**\n\nNo recent conversation history available in this session. Your chat history is stored locally in this browser tab and will persist until you clear it or close the tab.`;
      }

      const historyText = recentMessages.map((msg, idx) =>
        `${idx + 1}. ${msg.content.substring(0, 100)}${msg.content.length > 100 ? '...' : ''}`
      ).join('\n\n');

      return `📚 **Recent Conversation History**\n\n${historyText}\n\nYour full chat history is stored locally in this browser tab and will persist until you clear it or close the tab.`;
    }

    // Check for deleted tasks
    if (q.includes('deleted') || q.includes('deletion')) {
      return `🗑️ **Deleted Tasks:**\n\nYou have deleted ${currentDeletedCount} tasks so far.`;
    }

    // Status/Overview queries - THIS WAS MISSING!
    if (q.match(/status|overview|summary|total|how many/i)) {
      if (totalTasks === 0) return `📊 **Current Status:**\n\n• Total Tasks: 0\n• Deleted: ${deletedCount}\n\nYou don't have any active tasks.`;
      const updatedTasks = tasks.filter(t => t.updated_at && t.created_at && new Date(t.updated_at).getTime() > new Date(t.created_at).getTime());
      return `📊 **Task Summary:**\n\n• Total: ${totalTasks}\n• Pending: ${pendingTasks.length}\n• Completed: ${completedTasks.length}\n• Deleted: ${deletedCount}\n• Overdue: ${overdueTasks.length}\n\n🔴 High Priority: ${highPriorityTasks.length} | 🟡 Medium: ${mediumPriorityTasks.length}`;
    }

    // Task Search Logic (fallback for any remaining queries)
    const searchMatches: Task[] = tasks.filter(t =>
      t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
    );

    if (searchMatches.length > 0) {
      const list = searchMatches.slice(0, 5).map((t, i) => `${i + 1}. ${t.completed ? '✅' : '⏳'} ${t.title}`).join('\n');
      return `🔍 **Matches for "${query}":**\n\n${list}${searchMatches.length > 5 ? '\n...and more' : ''}`;
    }

    // 2. Final Fallback: A "Khubsurat" random response for anything else
    const randomGreetings = ["Interesting thought!", "That's a unique query!", "Nice topic!", "I like the way you think!"];
    const randomGreet = randomGreetings[Math.floor(Math.random() * randomGreetings.length)];

    return `✨ **${randomGreet}**\n\nI'm primarily your Task Assistant, but I'm always happy to chat! I couldn't find a task matching "${query}", but I can help you organize your time to focus on it. \n\nTry asking for your **"status"** or **"pending tasks"**!`;
  };

  const handleSend = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const query = inputValue;
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const response = processQuery(query, [...messages, userMsg]);
      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickActions = [
    { label: 'Status', query: 'What is my task status?' },
    { label: 'Overdue', query: 'How many tasks are overdue?' },
    { label: 'Today', query: 'What tasks are due today?' },
    { label: 'History', query: 'Show conversation history' },
    { label: 'Priority', query: 'List my priority tasks' },
    
  ];

  if (isFetchingTasks) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#F06292] animate-spin mx-auto" />
          <p className="text-zinc-400">Syncing with Neon DB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto flex flex-col h-[90vh]">
        
        <header className="mb-6 flex flex-col md:flex-row justify-between items-center bg-zinc-900/50 p-6 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="p-3 rounded-2xl bg-[#F06292]/10 border border-[#F06292]/20">
              <Sparkles className="w-8 h-8 text-[#F06292]" />
            </div>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#F06292] to-white bg-clip-text text-transparent italic">AI Assistant</h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                ✓ Neon DB • {tasks.length} Tasks • <History className="w-3 h-3" /> {messages.length} Messages
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {messages.length > 0 && (
              <Button onClick={clearHistory} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                <Trash2 className="w-4 h-4 mr-2" /> Clear History
              </Button>
            )}
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-[#F06292] to-white text-zinc-950 font-black px-6 h-12 rounded-xl shadow-lg hover:scale-105 transition-all gap-2">
                <LayoutDashboard className="w-5 h-5" /> Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </header>

        {messages.length === 0 && (
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            {quickActions.map((action) => (
              <Button key={action.label} onClick={() => setInputValue(action.query)} variant="outline" className="bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800 text-xs">
                {action.label}
              </Button>
            ))}
          </div>
        )}

        <Card className="flex-1 bg-zinc-900/40 backdrop-blur-xl border-white/5 rounded-3xl overflow-hidden flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col min-h-0">
            
            {/* Scrollable Container with Pink Scrollbar */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-zinc-900/50
                [&::-webkit-scrollbar-thumb]:bg-[#F06292]/30
                [&::-webkit-scrollbar-thumb]:rounded-full
                hover:[&::-webkit-scrollbar-thumb]:bg-[#F06292]/50">
              
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                  <Bot className="w-24 h-24 text-[#F06292] animate-pulse" />
                  <div className="text-center space-y-2">
                    <p className="text-xl font-bold text-[#F06292]">AI Assistant Ready! 🤖</p>
                    <p className="text-zinc-500">{tasks.length} tasks loaded • Ready to chat</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((m) => (
                    <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] ${m.role === 'user' ? 'bg-gradient-to-r from-[#F06292] to-pink-400 text-zinc-950 font-bold' : 'bg-zinc-800/80 text-white border border-white/5'} p-4 rounded-2xl shadow-lg`}>
                        <p className="whitespace-pre-wrap font-medium">{m.content}</p>
                        <p className="text-[10px] opacity-60 mt-2">{m.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-800/80 p-4 rounded-2xl flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#F06292]" />
                        <span className="text-sm text-zinc-400 italic">Thinking...</span>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-zinc-950/50 border-t border-white/5">
              <div className="flex gap-3">
                <Input
                  id="chatInput"
                  name="chatInput"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type anything (Tasks)..."
                  disabled={isLoading}
                  className="bg-zinc-900 border-zinc-800 h-14 rounded-xl text-white focus:border-[#F06292]"
                />
                <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()} className="h-14 w-14 rounded-xl bg-gradient-to-r from-[#F06292] to-pink-400 hover:opacity-90">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
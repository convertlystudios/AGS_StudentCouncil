"use client";
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Bell, 
  Building2, 
  Users, 
  Plus, 
  Calendar,
  Search,
  MoreVertical,
  CheckCircle2,
  Clock,
  MapPin,
  Trash2,
  ChevronRight
} from 'lucide-react';

// Mock Data for new features
const INITIAL_MEETING_NOTES = [
  { id: '1', title: 'Monthly General Assembly', date: '2024-05-15', author: 'Alex Chen', content: 'Discussed budget for the upcoming Sports Fest...' },
  { id: '2', title: 'Budget Allocation Review', date: '2024-05-10', author: 'Sarah Smith', content: 'Allocation for Science Club approved with conditions.' }
];

const INITIAL_ROOMS = [
  { id: 'r1', name: 'Conference Room A', status: 'Occupied', user: 'Media Division', event: 'Video Editing Workshop' },
  { id: 'r2', name: 'Student Lounge', status: 'Available', user: null, event: null },
  { id: 'r3', name: 'Main Auditorium', status: 'Reserved', user: 'School Admin', event: 'Graduation Prep' }
];

export default function CouncilDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [me, setMe] = useState<any | null>(null);
  
  // New Feature States
  const [notes, setNotes] = useState(INITIAL_MEETING_NOTES);
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New task assigned by Sarah", time: "2m ago", unread: true },
    { id: 2, text: "Room A booking confirmed", time: "1h ago", unread: false }
  ]);

  useEffect(() => {
    fetchMe();
    fetchTasks();
  }, []);

  async function fetchMe() {
    try {
      const token = localStorage.getItem('token') || '';
      if (!token) return;
      const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setMe(data.user || null);
    } catch (e) { console.error(e); }
  }

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  type SidebarItemProps = {
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
    label: string;
    id: string;
  };

  const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, id }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      activeTab === id 
        ? 'bg-white text-[#2563eb]' 
        : 'text-blue-50 hover:bg-white/10 hover:text-white'
    }`}
  >
    <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
    <span className={`font-bold ${activeTab === id ? 'opacity-100' : 'opacity-90'}`}>
      {label}
    </span>
    {activeTab === id && <ChevronRight size={14} className="ml-auto opacity-50" />}
  </button>
);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* BRIGHT BLUE SIDEBAR */}
      <aside className="w-[380px] bg-blue-600 p-8 flex flex-col gap-0 hidden md:flex z-20">
        <div className="flex items-left gap-3 px-2">
          <div className="flex items-center gap-0 mb-6">
                        <Image
                                  src="/logo.png"
                                  alt="AGS Student Council Logo"
                                  width={40}
                                  height={40}
                                  className="mr-3"
                                />
                        <span className="text-xl text-white font-bold tracking-tight">AGS Student Council</span>
                      </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <SidebarItem icon={LayoutDashboard} label="Overview" id="overview" />
          <SidebarItem icon={CheckSquare} label="Task Board" id="tasks" />
          <SidebarItem icon={FileText} label="Meeting Notes" id="notes" />
          <SidebarItem icon={Building2} label="Room Usage" id="rooms" />
        </nav>

        <div className="mt-auto p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center text-[#2563eb] font-bold shadow-sm">
            {me?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="overflow-hidden text-ellipsis text-left">
            <p className="text-sm font-bold text-white truncate">{me?.username || 'admin'}</p>
            <p className="text-[10px] text-blue-100 uppercase font-black tracking-widest opacity-70">{me?.role || 'Council'}</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-800 capitalize">{activeTab}</h1>
            <p className="text-slate-500 text-sm font-medium">Official portal for the AGS Student Council</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="p-2.5 text-slate-400 bg-white border border-slate-200 hover:text-[#2563eb] hover:border-blue-200 rounded-xl transition-all shadow-sm">
                <Bell size={20} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                )}
              </button>
            </div>
            <button className="bg-[#2563eb] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all text-sm font-bold shadow-lg shadow-blue-600/20">
              <Plus size={18} /> New Entry
            </button>
          </div>
        </header>

        {/* TAB VIEWS */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Pending Tasks" value={tasks.filter(t => !t.completed).length} color="blue" />
              <StatCard label="Next Briefing" value="14:00 Today" color="indigo" />
              <StatCard label="Reserved Slots" value={rooms.filter(r => r.status !== 'Available').length} color="emerald" />
              
              <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <Clock size={18} className="text-[#2563eb]" /> Live Council Feed
                </h3>
                <div className="space-y-4">
                  {notifications.map(n => (
                    <div key={n.id} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 group cursor-default">
                      <div className="h-9 w-9 rounded-xl bg-blue-50 flex-shrink-0 flex items-center justify-center text-[#2563eb] group-hover:bg-[#2563eb] group-hover:text-white transition-all">
                        <Users size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{n.text}</p>
                        <p className="text-xs text-slate-400">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
                <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-500" /> Member Online
                </h3>
                <div className="space-y-4">
                  {['Sarah (Admin)', 'John (Media)', 'Alex (Finance)'].map(name => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-sm font-bold text-slate-600">{name}</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input placeholder="Search council tasks..." className="pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm w-full border border-transparent focus:border-blue-100 focus:bg-white outline-none transition-all" />
                </div>
                <button className="text-[#2563eb] text-sm font-black hover:text-blue-800 transition-colors uppercase tracking-wider">+ Create Category</button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <TaskColumn title="Backlog" count={tasks.length} color="bg-slate-400" />
                  <TaskColumn title="In Progress" count={0} color="bg-[#2563eb]" />
                  <TaskColumn title="Completed" count={0} color="bg-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {/* MEETING NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center p-10 text-slate-300 hover:border-[#2563eb] hover:bg-blue-50/30 hover:text-[#2563eb] transition-all cursor-pointer bg-white group">
                <Plus size={40} className="group-hover:rotate-90 transition-transform duration-300" />
                <p className="font-black mt-4 text-xs uppercase tracking-widest">New Minutes</p>
              </div>
              {notes.map(note => (
                <div key={note.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 hover:shadow-xl hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-[#2563eb] px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">Archive</div>
                    <MoreVertical size={16} className="text-slate-300 hover:text-slate-600 cursor-pointer" />
                  </div>
                  <h4 className="font-black text-slate-800 text-lg mb-1 group-hover:text-[#2563eb] transition-colors leading-tight">{note.title}</h4>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-4 font-bold uppercase tracking-tighter">
                    <Calendar size={12} /> {note.date} • {note.author}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{note.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* ROOMS TAB */}
          {activeTab === 'rooms' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Room / Location</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Status</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Assigned</th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Utility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map(room => (
                    <tr key={room.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-3 rounded-2xl text-slate-400 shadow-sm border border-slate-200/50 group-hover:text-[#2563eb] transition-colors">
                            <MapPin size={20} />
                          </div>
                          <span className="font-black text-slate-800 tracking-tight">{room.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          room.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                          room.status === 'Occupied' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {room.status}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        {room.user ? (
                          <div className="text-sm">
                            <p className="font-black text-slate-800 tracking-tight">{room.user}</p>
                            <p className="text-slate-400 text-xs font-bold">{room.event}</p>
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-[13px] font-medium tracking-tight">Open for Council Members</span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <button className={`text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all ${
                          room.status === 'Available' 
                            ? 'bg-[#2563eb] text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20' 
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        }`}>
                          {room.status === 'Available' ? 'Reserve' : 'Reserved'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  color?: 'blue' | 'indigo' | 'emerald';
};

function StatCard({ label, value, color = 'blue' }: StatCardProps) {
  const colors = {
    blue: 'border-blue-100 text-[#2563eb] bg-white shadow-blue-600/5',
    indigo: 'border-indigo-100 text-indigo-600 bg-white shadow-indigo-600/5',
    emerald: 'border-emerald-100 text-emerald-600 bg-white shadow-emerald-600/5'
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} shadow-xl transition-transform hover:-translate-y-1 duration-300`}>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-3">{label}</p>
      <p className="text-4xl font-black tracking-tighter">{value}</p>
    </div>
  );
}

type TaskColumnProps = {
  title: string;
  count: number;
  color: string;
};

function TaskColumn({ title, count, color }: TaskColumnProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={`h-3 w-3 rounded-full ${color} shadow-lg`}></div>
          <h5 className="font-black text-[11px] text-slate-800 uppercase tracking-widest">{title}</h5>
        </div>
        <span className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full font-black">{count}</span>
      </div>
      <div className="min-h-[280px] border-2 border-dashed border-slate-200/80 rounded-3xl p-4 bg-slate-50/50 flex flex-col items-center justify-center">
        {count === 0 && (
          <div className="text-center">
            <div className="bg-white p-4 rounded-2xl inline-block mb-3 shadow-sm border border-slate-100">
              <CheckSquare size={24} className="text-slate-200" />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Clear Schedule</p>
          </div>
        )}
      </div>
    </div>
  );
}
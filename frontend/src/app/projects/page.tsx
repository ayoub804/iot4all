"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Circle, Plus, Loader2 } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    'In Progress': 'text-accent',
    'Completed': 'text-green-400',
    'Planning': 'text-blue-400',
    'On Hold': 'text-yellow-400'
};

interface Task { _id: string; text: string; completed: boolean; }
interface Project { _id: string; title: string; description: string; status: string; progress: number; tags: string[]; tasks: Task[]; team: { _id: string; name: string; avatar: string }[]; }

export default function ProjectsPage() {
    const { isAdmin, isSupervisor, user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newProject, setNewProject] = useState({ title: "", description: "", status: "Planning", tags: "" });
    const [creating, setCreating] = useState(false);

    const load = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data.projects);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to load");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const toggleTask = async (pid: string, tid: string) => {
        try {
            const data = await api.toggleTask(pid, tid);
            setProjects(prev => prev.map(p => p._id === pid ? data.project : p));
        } catch { }
    };

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api.createProject({ ...newProject, tags: newProject.tags.split(',').map(t => t.trim()) });
            setShowForm(false);
            setNewProject({ title: "", description: "", status: "Planning", tags: "" });
            await load();
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Failed to create");
        } finally {
            setCreating(false);
        }
    };

    const inputStyle = { background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' };
    const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm font-body text-primary outline-none border focus:border-accent transition-colors";

    if (loading) return <main className="flex-1 flex items-center justify-center"><Loader2 className="text-accent animate-spin" size={32} /></main>;

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 w-full">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="font-display font-bold text-3xl md:text-4xl text-primary">
                        Projects <span className="glow-text">Dashboard</span>
                    </h1>
                    <p className="text-secondary mt-2">{projects.length} active projects</p>
                </div>
                {(isAdmin || isSupervisor) && (
                    <button onClick={() => setShowForm(p => !p)} className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold font-display text-sm hover:bg-accent hover:text-dark-900 transition-all" style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}>
                        <Plus size={16} /> New Project
                    </button>
                )}
            </div>

            {error && <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}

            {showForm && (
                <form onSubmit={createProject} className="glass-panel rounded-2xl p-6 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input required value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} placeholder="Project Title" className={inputClass} style={inputStyle} />
                    <select value={newProject.status} onChange={e => setNewProject(p => ({ ...p, status: e.target.value }))} className={inputClass} style={inputStyle}>
                        {['Planning', 'In Progress', 'Completed', 'On Hold'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <textarea value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="Description..." rows={2} className={`${inputClass} col-span-full resize-none`} style={inputStyle} />
                    <input value={newProject.tags} onChange={e => setNewProject(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma separated)" className={`${inputClass} col-span-full md:col-span-1`} style={inputStyle} />
                    <div className="col-span-full flex gap-3">
                        <button type="submit" disabled={creating} className="px-5 py-2 rounded-full font-bold text-sm bg-accent text-dark-900 hover:opacity-90 transition-opacity">
                            {creating ? <Loader2 size={16} className="animate-spin" /> : "Create"}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-full font-bold text-sm text-secondary glass-panel">Cancel</button>
                    </div>
                </form>
            )}

            {projects.length === 0 && (
                <div className="text-center py-20 text-muted">No projects yet. {(isAdmin || isSupervisor) ? "Create one above!" : "Check back soon."}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map(p => (
                    <div key={p._id} className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                        <div className="flex items-start justify-between gap-2">
                            <h3 className="font-display font-bold text-lg text-primary">{p.title}</h3>
                            <span className={`text-xs font-bold font-body uppercase tracking-wider px-2 py-0.5 rounded bg-accent/10 ${STATUS_COLORS[p.status] || 'text-muted'}`}>{p.status}</span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed">{p.description}</p>

                        {/* Progress */}
                        <div>
                            <div className="flex justify-between text-xs text-muted mb-1">
                                <span>Progress</span><span>{p.progress}%</span>
                            </div>
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                                <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${p.progress}%` }} />
                            </div>
                        </div>

                        {/* Tasks */}
                        {p.tasks.length > 0 && (
                            <ul className="flex flex-col gap-2">
                                {p.tasks.map(t => (
                                    <li key={t._id} className="flex items-center gap-2 text-sm cursor-pointer group" onClick={() => user && toggleTask(p._id, t._id)}>
                                        {t.completed
                                            ? <CheckCircle size={16} className="text-accent flex-shrink-0" />
                                            : <Circle size={16} className="text-muted group-hover:text-accent flex-shrink-0 transition-colors" />}
                                        <span className={t.completed ? 'line-through text-muted' : 'text-secondary'}>{t.text}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Tags */}
                        {p.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-auto">
                                {p.tags.map(tag => (
                                    <span key={tag} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{tag}</span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </main>
    );
}

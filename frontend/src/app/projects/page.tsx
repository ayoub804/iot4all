"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle, Circle, Plus, Loader2, Image, X } from "lucide-react";

const Github = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const ExternalLink = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);

const STATUS_COLORS: Record<string, string> = {
    'In Progress': 'text-accent',
    'Completed': 'text-green-400',
    'Planning': 'text-blue-400',
    'On Hold': 'text-yellow-400'
};

interface Task { _id: string; text: string; completed: boolean; }
interface Project { _id: string; title: string; description: string; status: string; progress: number; tags: string[]; tasks: Task[]; team: { _id: string; name: string; avatar: string }[]; githubLink?: string; images?: string[]; }

export default function ProjectsPage() {
    const { isAdmin, isSupervisor, user } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [newProject, setNewProject] = useState({ title: "", description: "", status: "Planning", tags: "", githubLink: "" });
    const [projectImages, setProjectImages] = useState<string[]>([]);
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const promises = Array.from(files).map(file => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        });

        const base64s = await Promise.all(promises);
        setProjectImages(prev => [...prev, ...base64s]);
    };

    const createProject = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        try {
            await api.createProject({ 
                ...newProject, 
                tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean),
                images: projectImages
            });
            setShowForm(false);
            setNewProject({ title: "", description: "", status: "Planning", tags: "", githubLink: "" });
            setProjectImages([]);
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
                        {['Planning', 'In Progress', 'Completed', 'On Hold'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <textarea value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="Description..." rows={2} className={`${inputClass} col-span-full resize-none`} style={inputStyle} />
                    <input value={newProject.tags} onChange={e => setNewProject(p => ({ ...p, tags: e.target.value }))} placeholder="Tags (comma separated)" className={inputClass} style={inputStyle} />
                    <input value={newProject.githubLink} onChange={e => setNewProject(p => ({ ...p, githubLink: e.target.value }))} placeholder="GitHub Repo Link (optional)" className={inputClass} style={inputStyle} />
                    
                    <div className="col-span-full">
                        <label className="block text-xs font-body font-medium text-muted uppercase tracking-widest mb-2">Project Images</label>
                        <div className="flex flex-wrap gap-3">
                            {projectImages.map((img, i) => (
                                <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                                    <img src={img} className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => setProjectImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-red-500/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            <label className="w-20 h-20 rounded-xl border-2 border-dashed border-accent/30 flex flex-col items-center justify-center text-accent/50 hover:text-accent hover:border-accent transition-all cursor-pointer">
                                <Image size={24} />
                                <span className="text-[10px] mt-1">Add</span>
                                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div className="col-span-full flex gap-3 pt-2">
                        <button type="submit" disabled={creating} className="px-5 py-2 rounded-full font-bold text-sm bg-accent text-dark-900 hover:opacity-90 transition-opacity">
                            {creating ? <Loader2 size={16} className="animate-spin" /> : "Create Project"}
                        </button>
                        <button type="button" onClick={() => { setShowForm(false); setProjectImages([]); }} className="px-5 py-2 rounded-full font-bold text-sm text-secondary glass-panel">Cancel</button>
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
                            <h3 className="font-display font-bold text-lg text-primary line-clamp-1">{p.title}</h3>
                            <span className={`text-[10px] font-bold font-body uppercase tracking-wider px-2 py-0.5 rounded flex-shrink-0 bg-accent/10 ${STATUS_COLORS[p.status] || 'text-muted'}`}>{p.status}</span>
                        </div>
                        
                        {/* Project Images */}
                        {p.images && p.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {p.images.map((img, i) => (
                                    <div key={i} className="w-full h-32 rounded-xl overflow-hidden flex-shrink-0 bg-accent/5 border border-accent/10">
                                        <img src={img} className="w-full h-full object-cover" alt={`Project Image ${i}`} />
                                    </div>
                                ))}
                            </div>
                        )}
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

                        {/* Tags & Links */}
                        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                            {p.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {p.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                {p.githubLink && (
                                    <a href={p.githubLink} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg glass-panel text-accent hover:bg-accent hover:text-dark-900 transition-all" title="View GitHub Repo">
                                        <Github size={14} />
                                    </a>
                                )}
                                <Link href={`/projects/${p._id}`} className="p-2 rounded-lg glass-panel text-secondary hover:text-primary transition-colors" title="View Details">
                                    <ExternalLink size={14} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}

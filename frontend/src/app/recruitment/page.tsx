"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Search, Loader2, CheckCircle, XCircle, Clock, Send, X } from "lucide-react";

interface App { _id: string; name: string; email: string; field: string; motivation: string; skills: string[]; status: string; createdAt: string; }

const STATUS_STYLES: Record<string, string> = {
    Pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
    Accepted: 'bg-green-400/10 text-green-400 border-green-400/30',
    Rejected: 'bg-red-400/10 text-red-400 border-red-400/30',
};

export default function RecruitmentPage() {
    const { isSupervisor, user, isMember, loading: authLoading } = useAuth();
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [updating, setUpdating] = useState<string | null>(null);
    const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
    const [userApp, setUserApp] = useState<App | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        field: '',
        motivation: '',
        skills: [] as string[]
    });
    const [skillInput, setSkillInput] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const loadAdminData = async () => {
        try {
            const [appsData, statsData] = await Promise.all([api.getApplications(), api.getRecruitStats()]);
            setApps(appsData.apps);
            setStats(statsData);
        } catch { } finally { setLoading(false); }
    };

    const loadUserApp = async () => {
        try {
            const data = await api.getMyApplication();
            setUserApp(data.app);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: prev.name || user.name || '',
                email: prev.email || user.email || '',
            }));
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        if (isSupervisor) {
            loadAdminData();
        } else {
            loadUserApp();
        }
    }, [isSupervisor, user]);

    const updateStatus = async (id: string, status: string) => {
        setUpdating(id);
        try {
            await api.updateAppStatus(id, status);
            await loadAdminData();
        } catch { } finally { setUpdating(null); }
    };

    const handleAddSkill = () => {
        const skill = skillInput.trim();
        if (skill && !formData.skills.includes(skill)) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const submitApplication = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Submitting application with data:', formData);

        if (!formData.name.trim() || !formData.email.trim() || !formData.field.trim()) {
            alert('Please fill in all required fields');
            return;
        }

        setSubmitting(true);
        try {
            await api.apply(formData);
            await loadUserApp();
        } catch (err: any) {
            console.error('Submit error:', err);
            alert(err.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading) return (
        <main className="flex-1 flex items-center justify-center">
            <Loader2 className="text-accent animate-spin" size={40} />
        </main>
    );

    if (!user) return (
        <main className="flex-1 flex items-center justify-center text-center px-6">
            <div className="glass-panel p-10 rounded-2xl max-w-md">
                <h2 className="font-display font-bold text-xl text-primary mb-2">Sign In Required</h2>
                <p className="text-secondary text-sm">Please sign in to apply or manage applications.</p>
            </div>
        </main>
    );

    if (isSupervisor) {
        if (loading) return <main className="flex-1 flex items-center justify-center"><Loader2 className="text-accent animate-spin" size={32} /></main>;

        const filtered = apps.filter(a => {
            const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
            const matchFilter = filter === "All" || a.status === filter;
            return matchSearch && matchFilter;
        });

        return (
            <main className="max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="mb-10">
                    <h1 className="font-display font-bold text-3xl md:text-4xl text-primary">
                        Recruitment <span className="glow-text">Pipeline</span>
                    </h1>
                    <p className="text-secondary mt-2">Manage incoming applications</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total', value: stats.total, icon: Clock, color: 'text-accent' },
                        { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-400' },
                        { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'text-green-400' },
                        { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'text-red-400' },
                    ].map(s => (
                        <div key={s.label} className="glass-panel rounded-xl p-4 flex flex-col gap-1">
                            <s.icon className={s.color} size={20} />
                            <span className="font-display font-bold text-2xl text-primary">{s.value}</span>
                            <span className="text-xs text-muted uppercase tracking-wider">{s.label}</span>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm font-body text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} />
                    </div>
                    <div className="flex gap-2">
                        {['All', 'Pending', 'Accepted', 'Rejected'].map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === f ? 'bg-accent text-dark-900' : 'glass-panel text-secondary'}`}>{f}</button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {filtered.length === 0 && <div className="text-center py-16 text-muted">No applications found.</div>}
                    {filtered.map(a => (
                        <div key={a._id} className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-display font-bold text-lg text-primary">{a.name}</h3>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${STATUS_STYLES[a.status]}`}>{a.status}</span>
                                </div>
                                <p className="text-muted text-xs mb-2">{a.email} · {a.field} · {new Date(a.createdAt).toLocaleDateString()}</p>
                                {a.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {a.skills.map(s => <span key={s} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{s}</span>)}
                                    </div>
                                )}
                                {a.motivation && <p className="text-sm text-secondary line-clamp-2">{a.motivation}</p>}
                            </div>
                            {a.status === 'Pending' && (
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => updateStatus(a._id, 'Accepted')} disabled={updating === a._id} className="px-4 py-2 rounded-full text-sm font-bold bg-green-400/10 text-green-400 border border-green-400/30 hover:bg-green-400 hover:text-dark-900 transition-all">
                                        {updating === a._id ? <Loader2 size={14} className="animate-spin" /> : 'Accept'}
                                    </button>
                                    <button onClick={() => updateStatus(a._id, 'Rejected')} disabled={updating === a._id} className="px-4 py-2 rounded-full text-sm font-bold bg-red-400/10 text-red-400 border border-red-400/30 hover:bg-red-400 hover:text-dark-900 transition-all">
                                        {updating === a._id ? <Loader2 size={14} className="animate-spin" /> : 'Reject'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        );
    }

    if (isMember) {
        return (
            <main className="max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="mb-10">
                    <h1 className="font-display font-bold text-3xl md:text-4xl text-primary">
                        Welcome <span className="glow-text">Member</span>
                    </h1>
                    <p className="text-secondary mt-2">You have full access to all platform features</p>
                </div>
            </main>
        );
    }

    if (loading) return <main className="flex-1 flex items-center justify-center"><Loader2 className="text-accent animate-spin" size={32} /></main>;

    return (
        <main className="max-w-2xl mx-auto px-6 py-12 w-full">
            <div className="mb-10">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-primary">
                    Join <span className="glow-text">IoT4ALL</span>
                </h1>
                <p className="text-secondary mt-2">Apply to become a member and gain access to exclusive features</p>
            </div>

            {userApp ? (
                <div className="glass-panel rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`text-lg font-bold px-3 py-1 rounded-full border ${STATUS_STYLES[userApp.status]}`}>
                            {userApp.status === 'Pending' && <Clock className="inline mr-1" size={16} />}
                            {userApp.status === 'Accepted' && <CheckCircle className="inline mr-1" size={16} />}
                            {userApp.status === 'Rejected' && <XCircle className="inline mr-1" size={16} />}
                            {userApp.status}
                        </div>
                    </div>
                    <h2 className="font-display font-bold text-xl text-primary mb-2">Application Submitted</h2>
                    <p className="text-secondary mb-4">
                        {userApp.status === 'Pending' && 'Your application is under review. We will get back to you soon.'}
                        {userApp.status === 'Accepted' && 'Congratulations! You have been accepted. You now have full access to all platform features.'}
                        {userApp.status === 'Rejected' && 'Unfortunately, your application was not accepted at this time. Feel free to reach out for feedback.'}
                    </p>
                    <p className="text-xs text-muted">Submitted on {new Date(userApp.createdAt).toLocaleDateString()}</p>
                </div>
            ) : (
                <form onSubmit={submitApplication} className="glass-panel rounded-2xl p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                            className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Field / Specialization *</label>
                        <input type="text" value={formData.field} onChange={e => setFormData(prev => ({ ...prev, field: e.target.value }))} placeholder="e.g., IoT Development" className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Motivation</label>
                        <textarea value={formData.motivation} onChange={e => setFormData(prev => ({ ...prev, motivation: e.target.value }))} rows={4} placeholder="Why do you want to join?" className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors resize-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Skills</label>
                        <div className="flex gap-2 mb-3">
                            <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} placeholder="Add a skill..." className="flex-1 px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} />
                            <button type="button" onClick={handleAddSkill} className="px-4 py-2.5 rounded-xl font-medium text-sm text-dark-900 bg-accent hover:shadow-[0_0_15px_rgba(200,241,53,0.5)] transition-all">Add</button>
                        </div>
                        {formData.skills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map(skill => (
                                    <div key={skill} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30">
                                        <span className="text-sm text-accent">{skill}</span>
                                        <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-accent hover:text-red-400 transition-colors"><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit" disabled={submitting || !formData.name.trim() || !formData.email.trim() || !formData.field.trim()} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-dark-900 bg-accent hover:shadow-[0_0_20px_rgba(200,241,53,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {submitting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Submit Application
                            </>
                        )}
                    </button>
                </form>
            )}
        </main>
    );
}

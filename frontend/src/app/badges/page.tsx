"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Search, Loader2, Plus, Trash2, Award } from "lucide-react";

interface Badge { _id: string; name: string; description: string; icon: string; color: string; generation: string; }
interface Member { _id: string; name: string; email: string; role: string; badges: Array<{ _id: string; name: string; icon: string; color: string }>; avatar?: string; }

export default function BadgesPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMember, setSelectedMember] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [updating, setUpdating] = useState<string | null>(null);

    const load = async () => {
        try {
            const [badgesData, membersData] = await Promise.all([
                api.getBadges(),
                api.getMembers()
            ]);
            setBadges(badgesData.badges);
            setMembers(membersData.members);
        } catch { } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const addBadge = async (memberId: string, badgeId: string) => {
        setUpdating(`${memberId}-${badgeId}`);
        try {
            await api.addBadgeToUser(memberId, badgeId);
            await load();
        } catch { } finally { setUpdating(null); }
    };

    const removeBadge = async (memberId: string, badgeId: string) => {
        setUpdating(`${memberId}-${badgeId}`);
        try {
            await api.removeBadgeFromUser(memberId, badgeId);
            await load();
        } catch { } finally { setUpdating(null); }
    };

    const handleInit = async () => {
        setLoading(true);
        try {
            await api.initBadges();
            await load();
        } catch (err: any) {
            alert(err.message || "Failed to initialize badges");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return (
        <main className="flex-1 flex items-center justify-center">
            <Loader2 className="text-accent animate-spin" size={40} />
        </main>
    );

    if (!isAdmin) return (
        <main className="flex-1 flex items-center justify-center text-center px-6">
            <div className="glass-panel p-10 rounded-2xl max-w-md">
                <Award className="text-accent mx-auto mb-3" size={32} />
                <h2 className="font-display font-bold text-xl text-primary mb-2">Access Restricted</h2>
                <p className="text-secondary text-sm">Only admins can manage badges.</p>
            </div>
        </main>
    );

    if (loading) return <main className="flex-1 flex items-center justify-center"><Loader2 className="text-accent animate-spin" size={32} /></main>;

    const filtered = members.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 w-full">
            <div className="mb-10">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-primary">
                    Badge <span className="glow-text">Manager</span>
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                    <p className="text-secondary">Assign and manage member badges</p>
                </div>
            </div>

            {badges.length === 0 && (
                <div className="glass-panel rounded-2xl p-10 mb-8 border-2 border-accent/20 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                        <Award size={32} />
                    </div>
                    <div>
                        <h2 className="font-display font-bold text-xl text-primary">No Badges Found</h2>
                        <p className="text-secondary mt-1 max-w-sm">Initialize the default badge set to get started with member rewards and ranking.</p>
                    </div>
                    <button
                        onClick={handleInit}
                        className="px-8 py-3 rounded-xl font-bold text-dark-900 bg-accent hover:shadow-[0_0_20px_rgba(200,241,53,0.6)] transition-all flex items-center gap-2"
                    >
                        <Plus size={20} /> Initialize Default Badges
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <div className="glass-panel rounded-2xl p-6 space-y-6">
                        <div>
                            <h3 className="font-display font-bold text-lg text-primary mb-4 flex items-center gap-2">
                                <Award size={20} className="text-accent" /> First Generation (Founder)
                                <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold">LIMITED</span>
                            </h3>
                            {badges.filter(b => b.generation === "Founder").length === 0 ? (
                                <p className="text-muted text-sm">No founder badges created yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {badges.filter(b => b.generation === "Founder").map(b => (
                                        <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl border-2" style={{ background: `${b.color}10`, borderColor: `${b.color}30` }}>
                                            <span className="text-2xl">{b.icon}</span>
                                            <div>
                                                <p className="font-display font-bold text-sm text-primary">{b.name}</p>
                                                <p className="text-xs text-muted">{b.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="h-px w-full" style={{ background: 'var(--surface-border)' }} />

                        <div>
                            <h3 className="font-display font-bold text-lg text-primary mb-4 flex items-center gap-2">
                                <Award size={20} className="text-blue-400" /> Regular Members
                            </h3>
                            {badges.filter(b => b.generation === "Regular").length === 0 ? (
                                <p className="text-muted text-sm">No regular badges created yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {badges.filter(b => b.generation === "Regular").map(b => (
                                        <div key={b._id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${b.color}10` }}>
                                            <span className="text-2xl">{b.icon}</span>
                                            <div>
                                                <p className="font-display font-bold text-sm text-primary">{b.name}</p>
                                                <p className="text-xs text-muted">{b.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filtered.length === 0 && <p className="text-center py-8 text-muted">No members found.</p>}
                            {filtered.map(member => (
                                <div key={member._id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--surface-border)' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full border-2 border-accent/20 overflow-hidden flex items-center justify-center text-lg font-display font-bold text-accent" style={{ background: 'var(--bg-secondary)' }}>
                                                {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : member.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-display font-bold text-primary">{member.name}</p>
                                                <p className="text-xs text-muted">{member.email}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setSelectedMember(selectedMember === member._id ? null : member._id)} className="px-4 py-2 rounded-full text-xs font-bold glass-panel text-secondary hover:text-accent transition-colors">
                                            {selectedMember === member._id ? 'Close' : 'Manage Badges'}
                                        </button>
                                    </div>

                                    {selectedMember === member._id && (
                                        <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--surface-border)' }}>
                                            <p className="text-xs text-muted uppercase tracking-widest mb-3">Current Badges</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {member.badges && member.badges.length > 0 ? (
                                                    member.badges.map(b => (
                                                        <div key={b._id} className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${b.color}20` }}>
                                                            <span>{b.icon}</span>
                                                            <span className="text-xs font-bold text-primary">{b.name}</span>
                                                            <button onClick={() => removeBadge(member._id, b._id)} disabled={updating === `${member._id}-${b._id}`} className="ml-1 text-muted hover:text-red-400 transition-colors">
                                                                {updating === `${member._id}-${b._id}` ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-muted">No badges yet</p>
                                                )}
                                            </div>

                                            <p className="text-xs text-muted uppercase tracking-widest mb-3">Available Badges</p>
                                            <div className="flex flex-wrap gap-2">
                                                {badges.filter(b => !member.badges?.some(mb => mb._id === b._id)).map(b => (
                                                    <button key={b._id} onClick={() => addBadge(member._id, b._id)} disabled={updating === `${member._id}-${b._id}`} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel hover:border-accent/30 transition-all">
                                                        {updating === `${member._id}-${b._id}` ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} className="text-accent" />}
                                                        <span>{b.icon}</span>
                                                        <span className="text-xs font-bold text-secondary">{b.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

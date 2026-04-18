"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, Loader2 } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
    'Founder Supervisor': 'text-accent bg-accent/10',
    'Founder Member': 'text-green-400 bg-green-400/10',
    'Supervisor': 'text-blue-400 bg-blue-400/10',
    'Admin': 'text-red-400 bg-red-400/10',
    'Member': 'text-muted bg-light-200/5',
};

interface Member { _id: string; name: string; email: string; role: string; field: string; skills: string[]; status: string; avatar: string; bio: string; badges: Array<{ _id: string; name: string; icon: string; color: string; generation: string }>; }

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        api.getMembers()
            .then(d => setMembers(d.members))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <main className="flex-1 flex items-center justify-center"><Loader2 className="text-accent animate-spin" size={32} /></main>;

    const roles = ["All", ...Array.from(new Set(members.map(m => m.role)))];
    const filtered = members.filter(m => {
        const s = search.toLowerCase();
        return (filter === "All" || m.role === filter) &&
            (m.name.toLowerCase().includes(s) || m.field?.toLowerCase().includes(s) || m.skills?.some(sk => sk.toLowerCase().includes(s)));
    });

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 w-full">
            <div className="mb-10">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-primary">
                    Member <span className="glow-text">Directory</span>
                </h1>
                <p className="text-secondary mt-2">{members.length} active members</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, field, or skill..." className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} />
                </div>
                <div className="flex flex-wrap gap-2">
                    {roles.map(r => (
                        <button key={r} onClick={() => setFilter(r)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${filter === r ? 'bg-accent text-dark-900' : 'glass-panel text-secondary'}`}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 && <p className="text-center py-16 text-muted">No members found.</p>}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map(m => (
                    <div key={m._id} className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center gap-3 group hover:border-accent/30 transition-all">
                        <div className="w-20 h-20 rounded-full border-2 border-accent/20 group-hover:border-accent overflow-hidden relative transition-colors flex items-center justify-center text-2xl font-display font-bold text-accent" style={{ background: 'var(--bg-secondary)' }}>
                            {m.avatar ? <img src={m.avatar} alt={m.name} className="w-full h-full object-cover" /> : m.name[0]}
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-base text-primary group-hover:text-accent transition-colors">{m.name}</h3>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${ROLE_COLORS[m.role] || ROLE_COLORS.Member}`}>{m.role}</span>
                        </div>
                        {m.badges && m.badges.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1.5 w-full py-2">
                                {m.badges.map(b => (
                                    <div key={b._id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: `${b.color}20`, color: b.color }}>
                                        {b.icon}
                                        {b.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {m.field && <p className="text-xs text-muted">{m.field}</p>}
                        {m.skills?.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-1">
                                {m.skills.slice(0, 3).map(s => <span key={s} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">{s}</span>)}
                                {m.skills.length > 3 && <span className="text-xs text-muted">+{m.skills.length - 3}</span>}
                            </div>
                        )}
                        <div className={`w-2 h-2 rounded-full mt-auto ${m.status === 'Active' ? 'bg-green-400' : 'bg-yellow-400'}`} title={m.status} />
                    </div>
                ))}
            </div>
        </main>
    );
}

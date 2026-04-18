"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Cpu, Loader2 } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", field: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(p => ({ ...p, [k]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setError("Please fill in all fields");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            await api.register({
                name: form.name,
                email: form.email,
                password: form.password,
                field: form.field
            });
            // Redirect to home on success
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-3 rounded-xl text-sm font-body text-primary outline-none border focus:border-accent transition-colors";
    const inputStyle = { background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' };

    return (
        <main className="flex-1 flex items-center justify-center px-4 py-20">
            <div className="glass-panel rounded-2xl p-10 w-full max-w-md flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2 mb-2">
                    <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <Cpu className="text-accent" size={28} />
                    </div>
                    <h1 className="font-display font-bold text-2xl text-primary">Create Account</h1>
                    <p className="text-secondary text-sm text-center">Join IoT4ALL as a member. You'll need to apply to gain full access.</p>
                </div>

                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-body font-medium text-muted uppercase tracking-widest">Full Name</label>
                        <input required type="text" value={form.name} onChange={set('name')} placeholder="Your full name" className={inputClass} style={inputStyle} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-body font-medium text-muted uppercase tracking-widest">Email</label>
                        <input required type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" className={inputClass} style={inputStyle} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-body font-medium text-muted uppercase tracking-widest">Password</label>
                        <input required type="password" value={form.password} onChange={set('password')} placeholder="••••••••" className={inputClass} style={inputStyle} />
                        <p className="text-xs text-muted">Minimum 6 characters</p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-body font-medium text-muted uppercase tracking-widest">Field (Optional)</label>
                        <input type="text" value={form.field} onChange={set('field')} placeholder="e.g., IoT Development" className={inputClass} style={inputStyle} />
                    </div>

                    <button type="submit" disabled={loading} className="w-full mt-4 px-6 py-3 rounded-full font-bold font-display text-sm text-dark-900 bg-accent hover:shadow-[0_0_15px_rgba(200,241,53,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="relative h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

                <p className="text-center text-sm text-secondary">
                    Already have an account?{" "}
                    <Link href="/login" className="text-accent font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </main>
    );
}

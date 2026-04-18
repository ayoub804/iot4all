"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Cpu, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(form.email, form.password, rememberMe);
            router.push("/");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center px-4 py-20">
            <div className="glass-panel rounded-2xl p-10 w-full max-w-md flex flex-col gap-6">
                {/* Logo */}
                <div className="flex flex-col items-center gap-2 mb-2">
                    <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
                        <Cpu className="text-accent" size={28} />
                    </div>
                    <h1 className="font-display font-bold text-2xl text-primary">Welcome back</h1>
                    <p className="text-secondary text-sm">Sign in to your IoT4ALL account</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-body font-medium text-muted uppercase tracking-widest">Email</label>
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="you@issatm.tn"
                            className="w-full px-4 py-3 rounded-xl text-sm font-body text-primary outline-none border focus:border-accent transition-colors"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-body font-medium text-muted uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <input
                                type={showPw ? "text" : "password"}
                                required
                                value={form.password}
                                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-12 rounded-xl text-sm font-body text-primary outline-none border focus:border-accent transition-colors"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                            />
                            <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted">
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 px-1">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-accent/30 text-accent bg-transparent focus:ring-accent accent-accent cursor-pointer"
                        />
                        <label htmlFor="rememberMe" className="text-sm font-body text-secondary cursor-pointer select-none hover:text-primary transition-colors">
                            Keep me signed in
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2 hover:bg-accent hover:text-dark-900 transition-all mt-2"
                        style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-sm text-muted">
                    No account yet?{" "}
                    <Link href="/register" className="text-accent font-medium hover:underline">Apply to Join</Link>
                </p>
            </div>
        </main>
    );
}

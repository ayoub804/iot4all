"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Cpu, Menu, X, LogOut, User, Settings, Award } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Members", href: "/members" },
    { name: "Projects", href: "/projects" },
    { name: "Meeting Room", href: "/meeting" },
    { name: "Recruitment", href: "/recruitment" },
    { name: "Support", href: "/support" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, isAdmin } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:neon-border transition-all">
                        <Cpu className="text-accent group-hover:text-accent transition-colors animate-pulse-dot" size={20} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-display font-bold text-lg tracking-tight text-primary glow-text">IoT4ALL</span>
                        <span className="font-body font-medium text-[10px] text-accent/80 uppercase tracking-widest">Issatm</span>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`font-body text-sm font-medium transition-colors relative nav-link ${isActive ? "text-accent" : "text-secondary hover:text-primary"
                                    }`}
                            >
                                {link.name}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent rounded-full shadow-[0_0_8px_rgba(200,241,53,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                    {isAdmin && (
                        <Link
                            href="/badges"
                            className={`font-body text-sm font-medium transition-colors relative nav-link ${pathname === "/badges" ? "text-accent" : "text-secondary hover:text-primary"
                                }`}
                        >
                            Badges
                            {pathname === "/badges" && (
                                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-accent rounded-full shadow-[0_0_8px_rgba(200,241,53,0.8)]" />
                            )}
                        </Link>
                    )}
                </div>

                {/* Auth area */}
                <div className="hidden md:flex items-center gap-3">
                    <ThemeToggle />
                    <div className="w-px h-6 mx-1" style={{ backgroundColor: 'var(--surface-border)' }} />

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-bold text-accent">
                                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt={user.name} /> : <User size={14} />}
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-xs font-bold text-primary">{user.name}</span>
                                    <span className="text-[10px] text-accent/70 uppercase tracking-wider">{user.role}</span>
                                </div>
                            </div>
                            <Link href="/settings" title="Settings" className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-secondary hover:text-accent transition-colors">
                                <Settings size={14} />
                            </Link>
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-muted hover:text-red-400 transition-colors"
                            >
                                <LogOut size={14} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="text-sm font-bold px-5 py-2 rounded-full hover:bg-accent hover:text-dark-900 hover:shadow-[0_0_15px_rgba(200,241,53,0.5)] transition-all"
                                style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}
                            >
                                Create Account
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-primary p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="absolute top-[80px] left-4 right-4 glass-panel rounded-2xl p-6 flex flex-col gap-4 md:hidden animate-fade-up">
                    {NAV_LINKS.map((link) => (
                        <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="font-display text-lg font-medium text-secondary hover:text-accent">
                            {link.name}
                        </Link>
                    ))}
                    {isAdmin && (
                        <Link href="/badges" onClick={() => setIsOpen(false)} className="font-display text-lg font-medium text-secondary hover:text-accent flex items-center gap-2">
                            <Award size={18} /> Badges
                        </Link>
                    )}
                    <div className="h-px w-full" style={{ backgroundColor: 'var(--surface-border)' }} />
                    {user ? (
                        <>
                            <Link href="/settings" onClick={() => setIsOpen(false)} className="font-display text-lg font-medium text-secondary hover:text-accent flex items-center gap-2">
                                <Settings size={18} /> Settings
                            </Link>
                            <button onClick={handleLogout} className="font-display text-lg font-medium text-red-400 flex items-center gap-2">
                                <LogOut size={18} /> Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setIsOpen(false)} className="font-display text-lg font-medium text-secondary">Sign In</Link>
                            <Link href="/register" onClick={() => setIsOpen(false)} className="font-display text-lg font-medium text-accent">Create Account</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}

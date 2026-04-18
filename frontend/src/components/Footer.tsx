"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Mail, Globe, Terminal, Facebook } from "lucide-react";

export default function Footer() {
    const pathname = usePathname();
    
    // Hide footer on meeting room page
    if (pathname === '/meeting') {
        return null;
    }

    return (
        <footer className="w-full mt-24 py-12 border-t backdrop-blur-md relative z-10 transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}>
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Brand */}
                <div className="col-span-1 md:col-span-2 flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <Cpu className="text-accent animate-pulse-dot" size={24} />
                        <span className="font-display font-bold text-xl text-primary glow-text">IoT4ALL ISSATM</span>
                    </Link>
                    <p className="text-sm font-body text-secondary max-w-sm">
                        Empowering students through innovative Internet of Things projects and deep tech collaboration.
                        Join the future of embedded systems and AI.
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        {[
                            { Icon: Globe, href: "#" },
                            { Icon: Mail, href: "#" },
                            { Icon: Terminal, href: "#" },
                            { Icon: Facebook, href: "https://www.facebook.com/ClubIoT4ALLISSATM" }
                        ].map((item, i) => (
                            <a key={i} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center hover:text-accent hover:border-accent/30 transition-all text-secondary">
                                <item.Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-display font-semibold text-primary uppercase text-sm tracking-widest mb-2">Platform</h4>
                    <Link href="/projects" className="text-sm font-body text-secondary hover:text-accent transition-colors">Projects Dashboard</Link>
                    <Link href="/members" className="text-sm font-body text-secondary hover:text-accent transition-colors">Member Directory</Link>
                    <Link href="/meeting" className="text-sm font-body text-secondary hover:text-accent transition-colors">Meeting Room</Link>
                </div>

                {/* Club Info */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-display font-semibold text-primary uppercase text-sm tracking-widest mb-2">Join Us</h4>
                    <Link href="/recruitment" className="text-sm font-body text-secondary hover:text-accent transition-colors">Apply Now</Link>
                    <Link href="/about" className="text-sm font-body text-secondary hover:text-accent transition-colors">About Us</Link>
                    <p className="text-sm font-body text-muted mt-4">
                        © {new Date().getFullYear()} IoT4ALL ISSATM. All rights reserved.
                    </p>
                </div>

            </div>
        </footer>
    );
}

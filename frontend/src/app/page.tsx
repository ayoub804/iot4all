"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Cpu, Network, Zap, ShieldCheck, Microscope, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

interface Member { _id: string; name: string; email: string; role: string; field: string; skills: string[]; status: string; avatar: string; badges: Array<{ name: string; icon: string; color: string }>; }

export default function HomePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMembers()
      .then(d => setMembers(d.members))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col items-center w-full">
      {/* HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center hero-bg overflow-hidden pt-20">
        <div className="absolute inset-0 flex justify-center items-center opacity-20 pointer-events-none">
          <div className="w-[800px] h-[800px] border border-accent rounded-full absolute" style={{ animation: 'spin 60s linear infinite' }} />
          <div className="w-[600px] h-[600px] border border-accent rounded-full absolute border-dashed" style={{ animation: 'spin 40s linear infinite reverse' }} />
        </div>

        <div className="z-10 text-center max-w-4xl px-6 flex flex-col items-center gap-6">
          <div className="glass-panel px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="text-xs font-body tracking-wider text-muted">NEW RECRUITMENT SEASON OPEN</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary leading-tight animate-fade-up">
            Connect the <span className="glow-text">Future.</span> <br />
            Build with <span className="glow-text-green">IoT4ALL.</span>
          </h1>

          <p className="text-lg text-secondary font-body max-w-2xl mt-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            The premier university club for Internet of Things, Embedded Systems, and AI. Join interdisciplinary teams to build real-world solutions.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link
              href="/projects"
              className="px-8 py-4 rounded-full font-bold font-display hover:bg-accent hover:shadow-[0_0_20px_rgba(200,241,53,0.5)] transition-all flex items-center gap-2"
              style={{ background: 'var(--text-primary)', color: 'var(--bg)' }}
            >
              View Projects <ArrowRight size={18} />
            </Link>
            <Link href="/recruitment" className="px-8 py-4 rounded-full glass-panel border-accent/30 text-accent font-bold font-display hover:bg-accent/10 transition-all flex items-center gap-2">
              Apply to Join
            </Link>
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">Latest <span className="glow-text">Innovations</span></h2>
          <p className="text-secondary font-body max-w-xl mx-auto">Explore the cutting edge projects built by our members across AI, Robotics, and Smart Infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Smart City Grid", desc: "Using LoRaWAN sensors to monitor city air quality map.", icon: Network, color: "text-accent", border: "hover:border-accent border-accent/10" },
            { title: "AI Drone Surveillance", desc: "Computer vision and embedded systems on custom drones.", icon: Zap, color: "text-accent", border: "hover:border-accent border-accent/10" },
            { title: "Bio-metric Security", desc: "Advanced access control via RFID and facial recognition.", icon: ShieldCheck, color: "text-blue-400", border: "hover:border-blue-400 border-blue-400/10" }
          ].map((project, idx) => (
            <div key={idx} className={`glass-panel p-8 rounded-2xl flex flex-col gap-4 border transition-all duration-300 group ${project.border}`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: 'var(--bg-secondary)' }}>
                <project.icon className={project.color} size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-primary">{project.title}</h3>
              <p className="text-secondary font-body text-sm leading-relaxed mb-4">{project.desc}</p>
              <div className="mt-auto">
                <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                  <div className={`h-full bg-current ${project.color}`} style={{ width: '80%' }} />
                </div>
                <div className="flex justify-between text-xs mt-2 text-muted">
                  <span>Development</span>
                  <span>80%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/projects" className="text-accent hover:opacity-70 font-display font-bold text-sm tracking-widest uppercase transition-opacity">
            View All Projects
          </Link>
        </div>
      </section>

      {/* ABOUT THE CLUB SECTION */}
      <section className="w-full py-24 relative overflow-hidden border-y" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative z-10">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 text-accent font-display font-bold text-sm uppercase tracking-widest">
              <Microscope size={16} /> Our Vision
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary">
              Pioneering Multidisciplinary <span className="glow-text-green">Collaboration.</span>
            </h2>
            <p className="text-secondary font-body text-lg leading-relaxed">
              IoT4ALL isn't just about the Internet of Things. We are a nexus for Computer Science, Embedded Systems, Networking, and AI to converge. Our members collaborate across departments to simulate a genuine startup engineering ecosystem.
            </p>
            <ul className="space-y-4 pt-4">
              {['Hardware Engineering & Prototyping', 'Cloud Architecture & Web Platforms', 'Machine Learning Integration'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-secondary font-body">
                  <Cpu className="text-accent" size={20} /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 relative w-full aspect-square md:aspect-video lg:aspect-square max-w-lg">
            <div className="absolute inset-0 glass-panel rounded-full overflow-hidden flex items-center justify-center animate-float">
              <div className="w-32 h-32 rounded-full bg-accent/20 blur-2xl absolute" />
              <div className="w-24 h-24 rounded-full bg-accent/20 blur-2xl absolute" />
              <div className="relative text-center">
                <span className="font-display font-bold text-4xl text-primary glow-text block">IoT</span>
                <span className="font-body text-accent tracking-[0.3em] text-xs font-bold">4ALL</span>
              </div>
            </div>
            <div className="absolute inset-4 border border-accent/20 rounded-full" style={{ animation: 'spin 20s linear infinite' }} />
            <div className="absolute inset-8 border border-accent/20 rounded-full" style={{ animation: 'spin 30s linear infinite reverse' }} />
          </div>
        </div>
      </section>

      {/* MEMBER HIGHLIGHTS */}
      <section className="w-full max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-primary mb-4">Core <span className="glow-text">Architects</span></h2>
          <p className="text-secondary font-body max-w-xl mx-auto">Meet the top contributors and founders leading the revolution at IoT4ALL.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-accent animate-spin" size={32} />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted">No members yet. Be the first to join!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.slice(0, 8).map((member) => (
              <Link key={member._id} href="/members" className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center group cursor-pointer transition-colors">
                <div className="w-20 h-20 rounded-full border-2 border-accent/30 mb-4 overflow-hidden relative group-hover:border-accent transition-colors flex items-center justify-center text-2xl font-display font-bold text-accent" style={{ background: 'var(--bg-secondary)' }}>
                  {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : member.name[0]}
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-accent/20" />
                </div>
                <h4 className="font-display font-bold text-lg text-primary group-hover:text-accent transition-colors">{member.name}</h4>
                <div className="text-xs font-bold font-body tracking-wider uppercase text-accent/80 mt-1 mb-3 bg-accent/10 px-2 py-0.5 rounded">
                  {member.role}
                </div>
                {member.badges && member.badges.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 mb-2">
                    {member.badges.slice(0, 2).map(badge => (
                      <span key={badge.name} className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${badge.color}20`, color: badge.color }}>
                        {badge.icon} {badge.name}
                      </span>
                    ))}
                  </div>
                )}
                {member.field && <p className="text-sm font-body text-muted">{member.field}</p>}
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link
            href="/members"
            className="px-6 py-3 rounded-full font-display font-bold transition-all hover:bg-accent hover:text-dark-900 hover:border-accent"
            style={{ border: '1px solid var(--surface-border)', color: 'var(--text-secondary)' }}
          >
            See All Members
          </Link>
        </div>
      </section>

    </main>
  );
}

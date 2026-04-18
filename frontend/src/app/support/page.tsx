"use client";

import { useState } from "react";
import { Send, Mail, MessageSquare, HelpCircle, Info, CheckCircle } from "lucide-react";

const SUPPORT_EMAIL = "mraihiayoub123@gmail.com";

export default function SupportPage() {
    const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const subject = encodeURIComponent(formData.subject || "IoT4ALL Support Request");
        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
        );
        
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
        
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSuccess(false), 5000);
    };

    const faqItems = [
        { q: "How do I join IoT4ALL?", a: "Go to the Recruitment page and submit an application. Our team will review it and get back to you soon!" },
        { q: "Who can see my profile?", a: "Only supervisors and admins can see full member profiles. Regular members see basic information." },
        { q: "How do I get a badge?", a: "Badges are awarded by supervisors and admins. Contact a supervisor for more information." },
        { q: "Can I change my profile information?", a: "Yes! Go to Settings to update your profile, skills, and bio." }
    ];

    return (
        <main className="max-w-4xl mx-auto px-6 py-12 w-full">
            <div className="text-center mb-10">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-primary mb-2">
                    Need <span className="glow-text">Help?</span>
                </h1>
                <p className="text-secondary">We're here to assist you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {[
                    { icon: Mail, title: "Email Us", desc: "Direct email support", color: "text-accent" },
                    { icon: MessageSquare, title: "Quick Response", desc: "We reply within 24-48 hours", color: "text-blue-400" },
                    { icon: HelpCircle, title: "FAQ", desc: "Check common questions below", color: "text-purple-400" }
                ].map((item, i) => (
                    <div key={i} className="glass-panel rounded-2xl p-6 text-center">
                        <item.icon className={item.color + " mx-auto mb-3"} size={28} />
                        <h3 className="font-display font-bold text-lg text-primary">{item.title}</h3>
                        <p className="text-xs text-muted mt-1">{item.desc}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-panel rounded-2xl p-8">
                    <h2 className="font-display font-bold text-xl text-primary mb-6 flex items-center gap-2">
                        <Send size={20} className="text-accent" /> Send a Message
                    </h2>
                    
                    {success ? (
                        <div className="text-center py-10">
                            <CheckCircle className="text-green-400 mx-auto mb-4" size={48} />
                            <h3 className="font-display font-bold text-xl text-primary mb-2">Message Ready!</h3>
                            <p className="text-secondary text-sm">Your email client should open automatically. If not, click the button below.</p>
                            <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-block mt-6 px-6 py-3 rounded-xl font-bold text-dark-900 bg-accent hover:shadow-[0_0_20px_rgba(200,241,53,0.6)] transition-all">
                                Open Email Client
                            </a>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Your Name</label>
                                <input required value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} placeholder="Your full name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Your Email</label>
                                <input type="email" required value={formData.email} onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Subject</label>
                                <input value={formData.subject} onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} placeholder="How can we help?" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-2">Message</label>
                                <textarea required rows={5} value={formData.message} onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors resize-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }} placeholder="Describe your issue or question..." />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-dark-900 bg-accent hover:shadow-[0_0_20px_rgba(200,241,53,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                {submitting ? (
                                    <>Sending...</>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-5">
                    <div className="glass-panel rounded-2xl p-8">
                        <h2 className="font-display font-bold text-xl text-primary mb-6 flex items-center gap-2">
                            <HelpCircle size={20} className="text-purple-400" /> Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                            {faqItems.map((faq, i) => (
                                <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                                    <h3 className="font-display font-bold text-sm text-primary mb-2">{faq.q}</h3>
                                    <p className="text-xs text-secondary">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel rounded-2xl p-6">
                        <h3 className="font-display font-bold text-primary mb-3 flex items-center gap-2">
                            <Info size={16} className="text-blue-400" /> Direct Contact
                        </h3>
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-accent font-medium text-sm hover:underline">
                            {SUPPORT_EMAIL}
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

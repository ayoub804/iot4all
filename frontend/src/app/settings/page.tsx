"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Save, Loader2, X } from "lucide-react";

interface FormData {
    name: string;
    bio: string;
    field: string;
    skills: string[];
    avatar: string;
}

interface FormErrors {
    [key: string]: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        name: "",
        bio: "",
        field: "",
        skills: [],
        avatar: "",
    });
    const [skillInput, setSkillInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [successMsg, setSuccessMsg] = useState("");

    // Fetch current user data
    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login");
                return;
            }
            api.getMe()
                .then(({ user: userData }) => {
                    setFormData({
                        name: userData.name || "",
                        bio: userData.bio || "",
                        field: userData.field || "",
                        skills: userData.skills || [],
                        avatar: userData.avatar || "",
                    });
                })
                .catch((err) => {
                    setErrors({ general: err.message });
                })
                .finally(() => setLoading(false));
        }
    }, [authLoading, user, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleAddSkill = () => {
        const skill = skillInput.trim();
        if (!skill) {
            setErrors((prev) => ({ ...prev, skillInput: "Skill cannot be empty" }));
            return;
        }
        if (formData.skills.includes(skill)) {
            setErrors((prev) => ({ ...prev, skillInput: "Skill already added" }));
            return;
        }
        if (formData.skills.length >= 10) {
            setErrors((prev) => ({ ...prev, skillInput: "Maximum 10 skills allowed" }));
            return;
        }
        setFormData((prev) => ({
            ...prev,
            skills: [...prev.skills, skill],
        }));
        setSkillInput("");
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.skillInput;
            return newErrors;
        });
    };

    const handleRemoveSkill = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index),
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Convert to base64
            const reader = new FileReader();
            reader.onload = (event) => {
                setFormData((prev) => ({
                    ...prev,
                    avatar: event.target?.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        setSuccessMsg("");

        try {
            // Basic validation
            if (!formData.name.trim()) {
                setErrors({ name: "Name is required" });
                setSaving(false);
                return;
            }

            const updateData = {
                name: formData.name,
                bio: formData.bio,
                field: formData.field,
                skills: formData.skills,
                ...(formData.avatar && { avatar: formData.avatar }),
            };

            await api.updateMe(updateData);
            setSuccessMsg("Profile updated successfully!");
            setTimeout(() => {
                router.refresh();
            }, 1500);
        } catch (err: any) {
            setErrors({ general: err.message || "Failed to update profile" });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
            try {
                await api.deleteMe();
                localStorage.removeItem('iot4all_token');
                window.location.href = '/';
            } catch (err: any) {
                setErrors({ general: err.message || "Failed to delete account" });
            }
        }
    };

    if (authLoading || loading) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <Loader2 className="text-accent animate-spin" size={32} />
            </main>
        );
    }

    return (
        <main className="max-w-3xl mx-auto px-6 py-12 w-full">
            {/* Header */}
            <div className="mb-12">
                <h1 className="font-display font-bold text-3xl md:text-4xl text-primary">
                    Account <span className="glow-text">Settings</span>
                </h1>
                <p className="text-secondary mt-2">Update your profile information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Profile Picture */}
                <div className="glass-panel rounded-2xl p-8 space-y-6">
                    <div>
                        <h2 className="font-display font-bold text-xl text-primary mb-4">Profile Picture</h2>
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                            <div
                                className="w-24 h-24 rounded-full border-2 border-accent/20 flex items-center justify-center text-3xl font-display font-bold text-accent overflow-hidden"
                                style={{ background: 'var(--bg-secondary)' }}
                            >
                                {formData.avatar ? (
                                    <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                                ) : (
                                    formData.name[0]?.toUpperCase() || "U"
                                )}
                            </div>
                            <label className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                                <span className="inline-block px-6 py-2.5 rounded-xl font-medium text-sm text-dark-900 bg-accent cursor-pointer hover:shadow-[0_0_15px_rgba(200,241,53,0.5)] transition-all">
                                    Choose Image
                                </span>
                                <p className="text-xs text-muted mt-2">JPG, PNG or GIF (Max 5MB)</p>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="glass-panel rounded-2xl p-8 space-y-6">
                    <h2 className="font-display font-bold text-xl text-primary">Basic Information</h2>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                            placeholder="John Doe"
                        />
                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    {/* Field */}
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Field / Specialization</label>
                        <input
                            type="text"
                            name="field"
                            value={formData.field}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                            placeholder="e.g., IoT Development, Embedded Systems"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">Bio</label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors resize-none"
                            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                            placeholder="Tell us about yourself..."
                        />
                        <p className="text-xs text-muted mt-1">{formData.bio.length}/500 characters</p>
                    </div>
                </div>

                {/* Skills */}
                <div className="glass-panel rounded-2xl p-8 space-y-6">
                    <h2 className="font-display font-bold text-xl text-primary">Skills</h2>

                    <div>
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-primary outline-none border focus:border-accent transition-colors"
                                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--surface-border)' }}
                                placeholder="Add a skill and press Enter"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-6 py-2.5 rounded-xl font-medium text-sm text-dark-900 bg-accent hover:shadow-[0_0_15px_rgba(200,241,53,0.5)] transition-all"
                            >
                                Add
                            </button>
                        </div>
                        {errors.skillInput && <p className="text-xs text-red-400">{errors.skillInput}</p>}
                    </div>

                    {/* Skills List */}
                    <div>
                        {formData.skills.length === 0 ? (
                            <p className="text-sm text-muted">No skills added yet</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-accent/10 border border-accent/30"
                                    >
                                        <span className="text-sm text-accent">{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(idx)}
                                            className="text-accent hover:text-red-400 transition-colors"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Error & Success Messages */}
                {errors.general && (
                    <div className="p-4 rounded-xl bg-red-400/10 border border-red-400/30 text-red-400 text-sm">
                        {errors.general}
                    </div>
                )}

                {successMsg && (
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/30 text-accent text-sm">
                        {successMsg}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-dark-900 bg-accent hover:shadow-[0_0_20px_rgba(200,241,53,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {saving ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />
                            Save Changes
                        </>
                    )}
                </button>
            </form>

            {/* Danger Zone */}
            <div className="glass-panel border-red-500/30 rounded-2xl p-8 space-y-6 mt-12 bg-red-500/5">
                <h2 className="font-display font-bold text-xl text-red-400">Danger Zone</h2>
                <p className="text-secondary text-sm">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2"
                >
                    Delete My Account
                </button>
            </div>
        </main>
    );
}

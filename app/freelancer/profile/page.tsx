"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { User, Mail, Phone, Shield, Camera, Edit3, Save, Globe, Github, Twitter, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function FreelancerProfilePage() {
    const user = useAuthStore((state) => state.user);
    const [isEditing, setIsEditing] = useState(false);

    const profileData = {
        name: user?.email.split('@')[0].toUpperCase(),
        role: "Senior Full Stack Alchemist",
        bio: "Specializing in crafting premium digital experiences with a focus on anti-gravity design and neural interface aesthetics.",
        skills: ["React", "Three.js", "Framer Motion", "Next.js 15", "Neural Networks"],
        location: "Orbit Station 7, LEO",
        website: "https://antigravity.pro",
        github: "github.com/astropioneer",
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl border border-border/50"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />

                <div className="relative flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                        <div className="h-40 w-40 rounded-3xl bg-gradient-to-br from-primary to-blue-600 p-1">
                            <div className="h-full w-full rounded-[1.4rem] bg-background flex items-center justify-center overflow-hidden">
                                <span className="text-6xl font-black text-primary/20">{user?.email[0].toUpperCase()}</span>
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-3 bg-primary text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="space-y-1">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <h1 className="text-4xl font-black tracking-tighter uppercase">{profileData.name}</h1>
                                <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-green-500" />
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Verified Expert</span>
                                </div>
                            </div>
                            <p className="text-primary font-bold text-lg">{profileData.role}</p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground font-medium">
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {profileData.location}</div>
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> {user?.email}</div>
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 XXXX XXX 000</div>
                        </div>

                        <div className="pt-4 flex justify-center md:justify-start gap-3">
                            <button className="btn-primary py-3 px-8 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/20">
                                <Edit3 className="w-4 h-4" /> Edit Profile
                            </button>
                            <button className="glass py-3 px-6 rounded-2xl border border-border/50 hover:bg-white/10 transition-colors">
                                View Public Link
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-8"
                >
                    <div className="glass rounded-[2rem] p-8 border border-border/50 space-y-6 shadow-xl">
                        <h3 className="text-xl font-black uppercase tracking-tighter border-b border-border/30 pb-4">Professional Brief</h3>
                        <p className="text-muted-foreground leading-relaxed font-medium">
                            {profileData.bio}
                        </p>

                        <div className="space-y-4">
                            <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Core Transmissions</h4>
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 bg-muted/50 border border-border/30 rounded-xl text-xs font-bold hover:border-primary/50 transition-colors cursor-default">
                                        {skill.toUpperCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[2rem] p-8 border border-border/50 shadow-xl">
                        <h3 className="text-xl font-black uppercase tracking-tighter mb-6">Experience Orbit</h3>
                        <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/30">
                            {[1, 2].map((i) => (
                                <div key={i} className="relative pl-8 space-y-2">
                                    <div className="absolute left-0 top-1.5 w-4 h-4 bg-primary rounded-full ring-4 ring-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-black text-lg uppercase tracking-tighter">Command Lead</h4>
                                        <span className="text-[10px] font-black text-muted-foreground uppercase bg-muted/50 px-2 py-1 rounded-md">202{3 - i} — Present</span>
                                    </div>
                                    <p className="text-primary font-bold text-sm">Nexus Digital Forge</p>
                                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                        Architecting scalable interfaces for multi-planetary deployment systems.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Sidebar Stats */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="glass rounded-[2rem] p-8 border border-border/50 shadow-xl space-y-6">
                        <h3 className="text-lg font-black uppercase tracking-tighter">Uplink Status</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 text-center">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Success Rate</p>
                                <p className="text-2xl font-black text-primary">99%</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/10 text-center">
                                <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Signal Health</p>
                                <p className="text-2xl font-black text-green-500">EXC</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between text-xs font-bold border-b border-border/30 pb-3">
                                <span className="flex items-center gap-2"><Github className="w-4 h-4" /> GITHUB</span>
                                <span className="text-muted-foreground">CONNECTED</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold border-b border-border/30 pb-3">
                                <span className="flex items-center gap-2"><Globe className="w-4 h-4" /> WEBSITE</span>
                                <span className="text-primary">SECURED</span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                                <span className="flex items-center gap-2"><Twitter className="w-4 h-4" /> TRANSMIT</span>
                                <span className="text-muted-foreground">PENDING</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-[2rem] p-8 border border-border/50 shadow-xl bg-primary/5">
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-4">Identity Matrix</h3>
                        <div className="space-y-4">
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <div className="h-full w-[85%] bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            </div>
                            <p className="text-[10px] font-black uppercase text-muted-foreground flex justify-between">
                                <span>Profile Integrity</span>
                                <span>85% COMPLETED</span>
                            </p>
                            <button className="btn-primary w-full py-4 rounded-2xl text-xs uppercase tracking-widest font-black shadow-lg shadow-primary/20">
                                Verify Biometrics
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

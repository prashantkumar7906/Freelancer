"use client";

import { useEffect, useState } from "react";
import { Check, X, ShieldCheck, Mail, Phone, Users, Clock, AlertCircle, Briefcase } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface User {
    id: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
    emailVerified: boolean;
    phoneVerified: boolean;
}

interface Project {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    createdAt: string;
    buyer: { email: string };
}

export default function ApprovalsPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<"USERS" | "PROJECTS">("USERS");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const [usersRes, projectsRes] = await Promise.all([
                fetch("/api/admin/pending-users"),
                fetch("/api/projects?status=PENDING"),
            ]);
            
            const usersData = await usersRes.json();
            const projectsData = await projectsRes.json();
            
            setUsers(usersData);
            setProjects(Array.isArray(projectsData) ? projectsData : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
        try {
            const res = await fetch(`/api/admin/approve-user/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action }),
            });
            if (res.ok) {
                setUsers(users.filter((u) => u.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleProjectAction = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setProjects(projects.filter((p) => p.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        Access Control
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
                        Identity Verification Portal
                    </p>
                </motion.div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setTab("USERS")}
                        className={cn(
                            "glass px-6 py-4 rounded-2xl border flex flex-col items-center min-w-[120px] transition-all",
                            tab === "USERS" ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/50 opacity-60"
                        )}
                    >
                        <Users className="w-5 h-5 mb-2 text-primary" />
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none">Identities</p>
                        <p className="text-2xl font-black mt-1 tracking-tighter">{users.length}</p>
                    </button>
                    <button 
                        onClick={() => setTab("PROJECTS")}
                        className={cn(
                            "glass px-6 py-4 rounded-2xl border flex flex-col items-center min-w-[120px] transition-all",
                            tab === "PROJECTS" ? "border-primary bg-primary/10 shadow-lg shadow-primary/20" : "border-border/50 opacity-60"
                        )}
                    >
                        <Briefcase className="w-5 h-5 mb-2 text-purple-500" />
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none">Missions</p>
                        <p className="text-2xl font-black mt-1 tracking-tighter text-purple-500">{projects.length}</p>
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="glass rounded-[2.5rem] p-8 border border-border/50 shadow-2xl relative overflow-hidden min-h-[400px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

                <div className="space-y-4">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Scanning signal frequencies...</p>
                        </div>
                    ) : tab === "USERS" ? (
                        users.length === 0 ? (
                            <div className="p-20 text-center opacity-40 flex flex-col items-center group">
                                <div className="p-6 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <ShieldCheck className="w-12 h-12 text-green-500" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">All identities verified. Queue empty.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {users.map((user, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={user.id}
                                        className="group p-6 glass bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
                                    >
                                        <div className="flex-1 space-y-2 w-full">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary font-black text-xl border border-white/10 shadow-inner">
                                                    {user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-black tracking-tighter text-foreground">{user.email}</h3>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                                                            user.role === 'FREELANCER' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                                        )}>
                                                            {user.role}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                                                            <Clock className="w-3 h-3" /> {formatDate(user.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                                            <div className="space-y-1">
                                                <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", user.emailVerified ? "text-green-500" : "text-destructive")}>
                                                    {user.emailVerified ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Email Signal
                                                </div>
                                                <div className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", user.phoneVerified ? "text-green-500" : "text-destructive")}>
                                                    {user.phoneVerified ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} Phone Link
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAction(user.id, "REJECT")}
                                                    className="p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-lg hover:shadow-destructive/20 group/reject"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5 group-hover/reject:scale-110 transition-transform" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user.id, "APPROVE")}
                                                    className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/20 group/approve"
                                                    title="Approve"
                                                >
                                                    <Check className="w-5 h-5 group-hover/approve:scale-110 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )
                    ) : (
                        projects.length === 0 ? (
                            <div className="p-20 text-center opacity-40 flex flex-col items-center group">
                                <div className="p-6 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <Briefcase className="w-12 h-12 text-purple-500" />
                                </div>
                                <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">All missions approved. Deployment grid stable.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {projects.map((project, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={project.id}
                                        className="group p-6 glass bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 transition-all rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6"
                                    >
                                        <div className="flex-1 space-y-2 w-full">
                                            <h3 className="text-lg font-black tracking-tighter text-foreground uppercase">{project.title}</h3>
                                            <p className="text-[10px] font-medium text-muted-foreground line-clamp-1 opacity-70">{project.description}</p>
                                            <div className="flex items-center gap-4 mt-2">
                                                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-primary">
                                                    {project.category}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 uppercase tracking-widest">
                                                    {project.buyer?.email}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Budget</p>
                                                <p className="text-xl font-black text-foreground tracking-tighter tabular-nums text-shadow-glow-blue">{formatCurrency(project.budget)}</p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleProjectAction(project.id, "REJECTED")}
                                                    className="p-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-lg"
                                                    title="Reject"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleProjectAction(project.id, "OPEN")}
                                                    className="p-3 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg"
                                                    title="Approve"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

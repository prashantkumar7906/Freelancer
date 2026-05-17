"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, Users, ArrowRight, Plus, Search, Filter, Clock, MoreVertical, Edit2, Trash2, Rocket, Signal, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BuyerProjectsPage() {
    const user = useAuthStore((state) => state.user);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (user?.id) fetchMyProjects();
    }, [user]);

    const fetchMyProjects = async () => {
        try {
            const res = await fetch(`/api/projects?buyerId=${user?.id}`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        Mission Control
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">
                        Project Deployment Oversight
                    </p>
                </motion.div>

                <Link href="/buyer/post-project">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary py-4 px-8 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:shadow-primary/40 group"
                    >
                        <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        Launch Mission
                    </motion.button>
                </Link>
            </div>

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Deployments", value: projects.filter(p => p.status === 'OPEN').length, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                    { label: "Neural Signals", value: projects.reduce((acc, curr) => acc + (curr._count?.bids || 0), 0), icon: Signal, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
                    { label: "Awarded Nodes", value: projects.filter(p => p.status === 'AWARDED').length, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className={cn("glass p-6 rounded-[2rem] border relative overflow-hidden group shadow-xl", stat.border)}
                    >
                        <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform opacity-50", stat.bg)} />
                        <div className="relative flex justify-between items-start">
                            <div>
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{stat.label}</p>
                                <p className="text-4xl font-black tracking-tighter tabular-nums">{stat.value}</p>
                            </div>
                            <div className={cn("p-4 rounded-2xl shadow-inner bg-black/20 backdrop-blur-md", stat.color)}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Filter & Search */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 items-center bg-white/5 p-2 pr-4 rounded-[1.5rem] border border-border/30 backdrop-blur-md"
            >
                <div className="relative flex-1 group w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search deployment channels..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none h-14 pl-14 pr-4 text-sm font-bold focus:outline-none focus:bg-white/5 rounded-2xl transition-all placeholder:font-normal"
                    />
                </div>
                <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />
                <button className="glass px-6 py-3 rounded-xl border border-white/10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:border-primary/30 transition-all whitespace-nowrap w-full sm:w-auto justify-center">
                    <Filter className="w-4 h-4" /> Filter Status
                </button>
            </motion.div>

            {/* Project List */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden overflow-x-hidden min-h-[400px]"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-32 flex flex-col items-center justify-center space-y-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
                                <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Scanning Signal Grid...</p>
                        </div>
                    ) : filteredProjects.length === 0 ? (
                        <div className="p-32 text-center opacity-40 flex flex-col items-center group">
                            <div className="p-6 bg-white/5 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Briefcase className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">No active missions detected.</p>
                            <Link href="/buyer/post-project" className="text-primary hover:text-primary/80 font-black text-[10px] mt-6 tracking-widest uppercase border-b border-primary/30 pb-1 hover:border-primary transition-all">
                                Initiate First Deployment
                            </Link>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredProjects.map((project, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={project.id}
                                    className="group p-8 hover:bg-white/5 transition-all flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden cursor-pointer"
                                >
                                    <div className="flex-1 space-y-4 w-full relative z-10">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[9px] font-black text-primary uppercase tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                                {project.category || "TECHNOLOGY"}
                                            </span>
                                            <div className={cn(
                                                "w-2 h-2 rounded-full shadow-[0_0_10px_currentColor]",
                                                project.status === 'OPEN' ? "bg-green-500 text-green-500 animate-pulse" : "bg-blue-500 text-blue-500"
                                            )} />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{project.status}</span>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-black tracking-tighter uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary transition-all duration-300">
                                                {project.title}
                                            </h3>
                                            <div className="flex items-center gap-6 mt-3 text-xs font-bold text-muted-foreground opacity-60">
                                                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Launched {formatDate(project.createdAt)}</span>
                                                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> {project._count?.bids || 0} Total Signals</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-12 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-12">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Mission Bounty</p>
                                            <p className="text-3xl font-black tracking-tighter tabular-nums text-foreground">{formatCurrency(project.budget)}</p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    const newTitle = prompt("Enter new title:", project.title);
                                                    const newDesc = prompt("Enter new description:", project.description);
                                                    const newBudget = prompt("Enter new budget:", project.budget.toString());
                                                    if (newTitle && newDesc && newBudget) {
                                                        fetch(`/api/projects/${project.id}`, {
                                                            method: "PATCH",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                title: newTitle,
                                                                description: newDesc,
                                                                budget: newBudget
                                                            })
                                                        }).then(() => fetchMyProjects());
                                                    }
                                                }}
                                                className="p-4 glass bg-white/5 border-white/10 hover:bg-white/10 rounded-2xl transition-all text-muted-foreground hover:text-primary z-20"
                                                title="Edit Project"
                                            >
                                                <Edit2 className="w-6 h-6" />
                                            </button>
                                            <Link href={`/buyer/projects/${project.id}`} className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all group/btn z-20">
                                                <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Hover Effect Background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, ShieldAlert, CheckCircle2, XCircle, Search, Filter, ArrowUpRight, Globe, Layers, Eye, Edit2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        fetchGlobalProjects();
    }, []);

    const fetchGlobalProjects = async () => {
        try {
            const res = await fetch(`/api/projects`);
            const data = await res.json();
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleModifyProject = async (project: any) => {
        const title = prompt("Enter new title:", project.title);
        if (title === null) return;
        const description = prompt("Enter new description:", project.description);
        if (description === null) return;
        const budget = prompt("Enter new budget:", project.budget.toString());
        if (budget === null) return;

        try {
            const res = await fetch(`/api/projects/${project.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description, budget: parseFloat(budget) }),
            });
            if (res.ok) {
                fetchGlobalProjects();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredProjects = projects.filter(p => filter === "ALL" || p.status === filter);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Admin HUD */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-primary/5 p-10 rounded-[3rem] border border-primary/20 relative overflow-hidden backdrop-blur-xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] -mr-40 -mt-40" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="p-6 bg-primary rounded-[2rem] shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                        <Globe className="w-12 h-12 text-white animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">System Oversight</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Global Project Registry & Audit</p>
                    </div>
                </div>

                <div className="flex gap-4 relative z-10">
                    <div className="glass px-8 py-5 rounded-2xl border border-border/50 text-center min-w-[150px]">
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Total Loaded</p>
                        <p className="text-3xl font-black tabular-nums">{projects.length}</p>
                    </div>
                    <div className="glass px-8 py-5 rounded-2xl border border-border/50 text-center min-w-[150px]">
                        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">Active Nodes</p>
                        <p className="text-3xl font-black tabular-nums text-green-500">{projects.filter(p => p.status === 'OPEN').length}</p>
                    </div>
                </div>
            </div>

            {/* Global Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center bg-white/5 p-4 rounded-[1.5rem] border border-border/30">
                <div className="relative flex-1 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Scan project registry..."
                        className="w-full bg-transparent border-none h-14 pl-16 pr-6 text-sm font-bold focus:ring-1 ring-primary/30 rounded-2xl transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {["ALL", "PENDING", "OPEN", "AWARDED", "COMPLETED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "btn-primary shadow-lg shadow-primary/20" : "glass hover:bg-white/10"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Registry Table */}
            <div className="glass rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden relative">
                <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-primary/5 uppercase text-[10px] font-black tracking-[0.3em] text-muted-foreground">
                                <th className="px-10 py-6">Project Metadata</th>
                                <th className="px-10 py-6">Mission Status</th>
                                <th className="px-10 py-6">Neural Signals</th>
                                <th className="px-10 py-6 text-right">Budget Allocation</th>
                                <th className="px-10 py-6 text-center">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center">
                                        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Polling Global Database...</p>
                                    </td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center opacity-30">
                                        <Layers className="w-16 h-16 mx-auto mb-6 opacity-40" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No matching records found in registry.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={project.id}
                                        className="group hover:bg-primary/5 transition-colors"
                                    >
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-black uppercase tracking-tighter leading-none mb-2">{project.title}</p>
                                                    <div className="flex items-center gap-3 text-[10px] font-black text-muted-foreground opacity-60 uppercase tracking-widest">
                                                        <span>{project.id.slice(0, 8)}</span>
                                                        <div className="w-1 h-1 bg-border rounded-full" />
                                                        <span>{formatDate(project.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={cn(
                                                "w-fit px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                project.status === 'PENDING' ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]" :
                                                project.status === 'OPEN' ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]" :
                                                    "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                            )}>
                                                {project.status}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${Math.min((project._count?.bids || 0) * 10, 100)}%` }} />
                                                </div>
                                                <span className="text-[10px] font-black tabular-nums">{project._count?.bids || 0} SGNLS</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <p className="text-xl font-black tracking-tighter tabular-nums">{formatCurrency(project.budget)}</p>
                                            <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.2em] mt-1">Allocated</p>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <div className="flex items-center justify-center gap-2 transition-opacity">
                                                {project.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(project.id, "OPEN")}
                                                            className="p-3 bg-green-500/10 text-green-500 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-lg hover:shadow-green-500/20"
                                                            title="Approve Mission"
                                                        >
                                                            <CheckCircle2 className="w-5 h-5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleStatusUpdate(project.id, "REJECTED")}
                                                            className="p-3 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive hover:text-white transition-all shadow-lg hover:shadow-destructive/20"
                                                            title="Reject Mission"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                                <button 
                                                    onClick={() => handleModifyProject(project)}
                                                    className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                                                    title="Modify Project"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button className="p-3 bg-muted rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors">
                                                    <ShieldAlert className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

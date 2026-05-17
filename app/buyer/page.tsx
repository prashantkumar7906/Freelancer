"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Briefcase, Users, ArrowRight, Plus, Rocket, Sparkles, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/stat-card";

export default function BuyerDashboard() {
    const user = useAuthStore((state) => state.user);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) fetchRecentProjects();
    }, [user]);

    const fetchRecentProjects = async () => {
        try {
            const res = await fetch(`/api/projects?buyerId=${user?.id}`);
            const data = await res.json();
            setProjects(data.slice(0, 5));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            label: "Total Projects",
            value: projects.length.toString(),
            icon: Briefcase,
            color: "bg-electric-purple",
            trend: "neutral" as const
        },
        {
            label: "Total Bids",
            value: projects.reduce((acc, curr) => acc + (curr._count?.bids || 0), 0).toString(),
            icon: Users,
            color: "bg-cyan-500",
            trend: "up" as const,
            trendValue: "New"
        },
        {
            label: "Active Projects",
            value: projects.filter(p => p.status === 'AWARDED').length.toString(),
            icon: Rocket,
            color: "bg-hot-pink",
            trend: "neutral" as const
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                        Mission Control: {user?.email.split('@')[0]}
                    </h1>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                        Sector: Buyer • Authorization: Level 1
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Link href="/buyer/post-project" className="btn-primary flex items-center px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 group">
                        <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                        Initiate Project
                    </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard
                        key={i}
                        title={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        trend={stat.trend}
                        trendValue={stat.trendValue}
                        delay={i * 0.1}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-3xl border border-white/10 shadow-xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> Recent Deployments
                    </h3>
                    <Link href="/buyer/projects" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center group">
                        View Repository <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving project data...</div>
                    ) : projects.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">No active deployments found.</p>
                            <Link href="/buyer/post-project" className="text-primary hover:underline text-[10px] font-black uppercase tracking-widest mt-2 block">
                                Launch your first project
                            </Link>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <Link key={project.id} href={`/buyer/projects/${project.id}`} className="block">
                                <div className="p-6 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{project.title}</h4>
                                        <div className="flex items-center space-x-4 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                            <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10">{project.category}</span>
                                            <span>Budget: {formatCurrency(project.budget)}</span>
                                            <span>Posted: {formatDate(project.createdAt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-6">
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Status</p>
                                            <div className={cn(
                                                "text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full w-fit ml-auto",
                                                project.status === 'OPEN' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                                    project.status === 'AWARDED' ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                                                        "bg-muted text-muted-foreground"
                                            )}>
                                                {project.status}
                                            </div>
                                        </div>
                                        <div className="text-right border-l border-white/10 pl-6">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Bids</p>
                                            <p className="text-sm font-black">{project._count?.bids || 0}</p>
                                        </div>
                                        <div className="p-2 rounded-full border border-white/10 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}

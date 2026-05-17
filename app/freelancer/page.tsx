"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency } from "@/lib/utils";
import { MessageSquare, ArrowUpRight, Clock, CheckCircle2, XCircle, Plus, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/dashboard/stat-card";
import { motion } from "framer-motion";

export default function FreelancerDashboard() {
    const user = useAuthStore((state) => state.user);
    const [bids, setBids] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        if (user?.id) {
            fetchDashboardData();
            fetch(`/api/wallet/balance?userId=${user.id}`)
                .then(res => res.json())
                .then(data => setBalance(data.balance))
                .catch(err => console.error(err));
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            const [bidsRes, projectsRes] = await Promise.all([
                fetch(`/api/bids?freelancerId=${user?.id}`),
                fetch("/api/projects?status=OPEN")
            ]);
            const [bidsData, projectsData] = await Promise.all([
                bidsRes.json(),
                projectsRes.json()
            ]);
            setBids(bidsData.slice(0, 3));
            setProjects(projectsData.slice(0, 3));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: "Active Bids", value: bids.length.toString(), icon: Clock, color: "bg-blue-500", trend: "neutral" as const },
        { label: "Projects Won", value: bids.filter(b => b.status === "ACCEPTED").length.toString(), icon: CheckCircle2, color: "bg-green-500", trend: "up" as const, trendValue: "12%" },
        { label: "Total Earnings", value: balance !== null ? `₹${balance.toLocaleString("en-IN")}` : "Loading...", icon: TrendingUp, color: "bg-electric-purple", trend: "up" as const, trendValue: "5%" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
                        Command Center: {user?.email.split('@')[0]}
                    </h1>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                        Status: Operational • Signal Strength: Optimal
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Link href="/freelancer/browse" className="btn-primary flex items-center px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40">
                        <Plus className="mr-2 h-4 w-4" /> Browse Projects
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Projects Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-3xl border border-white/10 shadow-xl overflow-hidden h-fit"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                            <Sparkles className="h-3 w-3" /> Explore Global Signals
                        </h3>
                        <Link href="/freelancer/browse" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Full Spectrum</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scanning frequencies...</div>
                        ) : projects.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground italic text-sm">No signals detected.</div>
                        ) : (
                            projects.map((project) => (
                                <Link key={project.id} href={`/freelancer/browse?id=${project.id}`} className="p-6 transition-colors flex items-center justify-between group hover:bg-white/5">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{project.title}</h4>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                            <span>{project.category}</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span>{formatCurrency(project.budget)}</span>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                </Link>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Recent Bids */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-3xl border border-white/10 shadow-xl overflow-hidden h-fit"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">Recent Activity</h3>
                        <Link href="/freelancer/bids" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-white/5">
                        {loading ? (
                            <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retrieving history...</div>
                        ) : bids.length === 0 ? (
                            <div className="p-12 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40 italic">Zero uplinks established.</div>
                        ) : (
                            bids.map((bid) => (
                                <div key={bid.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight">{bid.project.title}</h4>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                            <span className="text-primary font-black">Bid: {formatCurrency(bid.bidAmount)}</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span>{bid.status}</span>
                                        </div>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        bid.status === 'ACCEPTED' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
                                            bid.status === 'PENDING' ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" :
                                                "bg-muted"
                                    )} />
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// End of file

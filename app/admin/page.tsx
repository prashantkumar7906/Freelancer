"use client";

import { useEffect, useState } from "react";
import { Users, Briefcase, IndianRupee, TrendingUp, Clock, ShieldAlert, Sparkles, Activity } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { StatCard } from "@/components/dashboard/stat-card";
import Link from "next/link";

interface ActivityLog {
    type: string;
    detail: string;
    time: string;
}

interface Transaction {
    id: string;
    amount: number;
    type: string;
    status: string;
    createdAt: string;
    userId: string;
}

interface Stats {
    totalRevenue: number;
    activeProjects: number;
    totalUsers: number;
    transactionVolume: number;
    activity: ActivityLog[];
    transactions: Transaction[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        totalRevenue: 0,
        activeProjects: 0,
        totalUsers: 0,
        transactionVolume: 0,
        activity: [],
        transactions: [],
    });
    const [loading, setLoading] = useState(true);

    // Mock data for initial UI
    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats");
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: IndianRupee,
            color: "bg-green-500",
            trend: "up" as const,
            trendValue: "+12.5%"
        },
        {
            label: "Active Projects",
            value: stats.activeProjects.toString(),
            icon: Briefcase,
            color: "bg-blue-500",
            trend: "neutral" as const
        },
        {
            label: "Total Users",
            value: stats.totalUsers.toString(),
            icon: Users,
            color: "bg-electric-purple",
            trend: "up" as const,
            trendValue: "+5"
        },
        {
            label: "Txn Volume",
            value: formatCurrency(stats.transactionVolume),
            icon: TrendingUp,
            color: "bg-orange-500",
            trend: "up" as const,
            trendValue: "+8%"
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-destructive to-orange-500">
                        System Overwatch
                    </h1>
                    <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60 mt-1">
                        Access Level: Administrator • Root Privileges Active
                    </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full text-destructive text-[10px] font-black uppercase tracking-widest">
                        <ShieldAlert className="w-4 h-4" />
                        Secure Environment
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
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
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-3xl border border-white/10 shadow-xl overflow-hidden"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                            <Activity className="h-3 w-3" /> System Logs
                        </h3>
                        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Full Audit</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {stats.activity.length === 0 ? (
                            <div className="p-10 text-center text-muted-foreground opacity-50 uppercase text-[9px] font-black tracking-widest">
                                No recent activity logged.
                            </div>
                        ) : (
                            stats.activity.map((log, i) => (
                                <div key={i} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                                    <div className="p-2 bg-white/5 rounded-full mt-1">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground">{log.detail}</p>
                                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider opacity-60">
                                            {log.type} • {new Date(log.time).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Financial Ledger */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass rounded-3xl border border-white/10 shadow-xl overflow-hidden flex flex-col max-h-[500px]"
                >
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                            <IndianRupee className="h-3 w-3" /> Financial Ledger
                        </h3>
                    </div>
                    <div className="divide-y divide-white/5 overflow-y-auto custom-scrollbar">
                        {stats.transactions?.length === 0 ? (
                            <div className="p-10 text-center text-muted-foreground opacity-50 uppercase text-[9px] font-black tracking-widest">
                                No transactions found.
                            </div>
                        ) : (
                            stats.transactions?.map((txn: any, i: number) => (
                                <div key={i} className="p-4 hover:bg-white/5 transition-colors flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex flex-shrink-0 items-center justify-center font-black",
                                            txn.amount > 0 ? "bg-green-500/10 text-green-500" : "bg-destructive/10 text-destructive"
                                        )}>
                                            {txn.type.substring(0, 1)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{txn.type}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground uppercase opacity-60">
                                                {new Date(txn.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            "text-sm font-black tabular-nums tracking-tighter",
                                            txn.amount > 0 ? "text-green-500" : "text-destructive"
                                        )}>
                                            {txn.amount > 0 ? "+" : ""}{formatCurrency(txn.amount)}
                                        </p>
                                        <p className={cn(
                                            "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 mt-1 rounded-md inline-block",
                                            txn.status === "COMPLETED" || txn.status === "CLEARED" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                                        )}>
                                            {txn.status || "PENDING"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}


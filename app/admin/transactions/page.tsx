"use client";

import { motion } from "framer-motion";
import { IndianRupee, ArrowUpRight, ArrowDownRight, ArrowRight, Search, Download, ShieldCheck, Activity, Filter, Layers, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AdminTransactionsPage() {
    const globalStats = {
        vaultBalance: 842500,
        volume24h: 125400,
        feeRevenue: 32150,
        securityScore: 98,
    };

    const globalTransactions = [
        { id: "LOG-9921", buyer: "BuyerAlpha", freelancer: "DevOmega", amount: 45000, type: "ESCROW_LOCK", date: "2026-02-15", status: "SECURE" },
        { id: "LOG-9920", buyer: "System", freelancer: "DesignKing", amount: 12000, type: "PAYOUT", date: "2026-02-15", status: "COMPLETED" },
        { id: "LOG-9919", buyer: "BuyerDelta", freelancer: "System", amount: 50000, type: "DEPOSIT", date: "2026-02-14", status: "CLEARED" },
        { id: "LOG-9918", buyer: "ClientX", freelancer: "DevOmega", amount: 8000, type: "DISPUTE_REFUND", date: "2026-02-14", status: "REJECTED" },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-10">
            {/* Economic Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {[
                    { label: "Vault Liquidity", value: formatCurrency(globalStats.vaultBalance), icon: IndianRupee, color: "text-primary" },
                    { label: "Volume Flux (24h)", value: formatCurrency(globalStats.volume24h), icon: Activity, color: "text-orange-500" },
                    { label: "Neural Tax (Fees)", value: formatCurrency(globalStats.feeRevenue), icon: ShieldCheck, color: "text-green-500" },
                    { label: "Integrity Index", value: globalStats.securityScore + "%", icon: Layers, color: "text-blue-500" },
                ].map((stat, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="glass p-8 rounded-[2.5rem] border border-border/50 shadow-xl group hover:border-primary/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-muted rounded-2xl group-hover:bg-primary/10 transition-colors">
                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                            </div>
                            <span className="text-[9px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full uppercase tracking-widest">Stable</span>
                        </div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-1">{stat.label}</p>
                        <p className="text-2xl font-black tracking-tighter tabular-nums">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Transaction Pulse Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/5 p-6 rounded-[2rem] border border-border/30 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(59,130,246,0.3)]">
                        <CreditCard className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-1">Financial Flux</h2>
                        <p className="text-[10px] font-black text-primary/60 uppercase tracking-[0.3em]">Monitoring Global Credit Movements</p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Trace signal hash..."
                            className="w-full bg-white/5 border-none h-12 pl-12 pr-4 rounded-xl text-xs font-bold focus:ring-1 ring-primary/30 transition-all"
                        />
                    </div>
                    <button className="glass px-6 py-3 rounded-xl border border-border/50 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                    <button className="p-3 glass rounded-xl border border-border/50 hover:bg-white/10">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Ledger Interface */}
            <div className="glass rounded-[3rem] border border-border/50 shadow-2xl relative overflow-hidden h-[600px] flex flex-col">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-background/80 backdrop-blur-md z-20 border-b border-border/30">
                            <tr className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                                <th className="px-8 py-6">Flux ID</th>
                                <th className="px-8 py-6">Channel (Parties)</th>
                                <th className="px-8 py-6">Type Protocol</th>
                                <th className="px-8 py-6">Date-Time</th>
                                <th className="px-8 py-6 text-right">Value Flux</th>
                                <th className="px-8 py-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/20">
                            {globalTransactions.map((txn, i) => (
                                <motion.tr
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={txn.id}
                                    className="group hover:bg-primary/5 transition-all text-sm font-medium"
                                >
                                    <td className="px-8 py-8">
                                        <span className="font-black font-mono text-xs opacity-60 group-hover:text-primary transition-colors">#{txn.id}</span>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-muted rounded-lg text-[10px] font-black uppercase">{txn.buyer}</span>
                                            <ArrowRight className="w-3 h-3 opacity-30" />
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter">{txn.freelancer}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8">
                                        <div className="flex items-center gap-2">
                                            <div className={cn(
                                                "w-2 h-2 rounded-full",
                                                txn.type === 'ESCROW_LOCK' ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" :
                                                    txn.type === 'PAYOUT' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-primary"
                                            )} />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{txn.type.replace('_', ' ')}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-8 tabular-nums opacity-60 text-xs">
                                        {formatDate(txn.date)}
                                    </td>
                                    <td className="px-8 py-8 text-right">
                                        <p className="text-xl font-black tracking-tighter tabular-nums">{formatCurrency(txn.amount)}</p>
                                    </td>
                                    <td className="px-8 py-8 text-center">
                                        <div className={cn(
                                            "inline-block px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                            txn.status === 'SECURE' ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]" :
                                                txn.status === 'COMPLETED' ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" :
                                                    "bg-destructive/10 text-destructive border-destructive/20 opacity-50"
                                        )}>
                                            {txn.status}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-8 border-t border-border/30 bg-primary/5 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Displaying 24-hour flux cycle</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 glass rounded-lg text-[9px] font-black uppercase">Prev</button>
                        <button className="px-4 py-2 btn-primary rounded-lg text-[9px] font-black">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

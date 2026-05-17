"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Clock, Send, CheckCircle2, XCircle, Search, Filter, ArrowUpRight, MessageSquare, History, Edit2, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function FreelancerBidsPage() {
    const user = useAuthStore((state) => state.user);
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");

    useEffect(() => {
        if (user?.id) fetchMyBids();
    }, [user]);

    const fetchMyBids = async () => {
        try {
            const res = await fetch(`/api/bids?freelancerId=${user?.id}`);
            const data = await res.json();
            setBids(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredBids = bids.filter(bid => filter === "ALL" || bid.status === filter);

    const stats = [
        { label: "Active Links", value: bids.filter(b => b.status === "PENDING").length, icon: Send, color: "text-blue-500" },
        { label: "Successful Uplinks", value: bids.filter(b => b.status === "ACCEPTED").length, icon: CheckCircle2, color: "text-green-500" },
        { label: "Bounty Volume", value: formatCurrency(bids.reduce((acc, b) => acc + (b.bidAmount || 0), 0)), icon: ArrowUpRight, color: "text-primary" },
    ];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Bidding Terminal</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60">Neural Proposal Management</p>
                </div>

                <div className="flex gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="glass px-6 py-4 rounded-2xl border border-border/50 flex flex-col items-center min-w-[120px]">
                            <stat.icon className={cn("w-5 h-5 mb-2", stat.color)} />
                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none">{stat.label}</p>
                            <p className="text-xl font-black mt-1 tracking-tighter">{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white/5 p-4 rounded-[1.5rem] border border-border/30">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search signal stream..."
                        className="w-full bg-white/5 border-none h-12 pl-12 pr-4 rounded-xl text-xs font-bold focus:ring-1 ring-primary/50 transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {["ALL", "PENDING", "ACCEPTED", "REJECTED"].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                filter === f ? "btn-primary shadow-lg shadow-primary/20" : "glass hover:bg-white/10"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bids List */}
            <div className="glass rounded-[2.5rem] p-8 border border-border/50 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                <div className="space-y-6">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center space-y-4">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Decoding data packets...</p>
                        </div>
                    ) : filteredBids.length === 0 ? (
                        <div className="p-20 text-center opacity-40 flex flex-col items-center">
                            <History className="h-20 w-20 mb-6 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Terminal Empty. No signals detected.</p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="space-y-4"
                        >
                            <AnimatePresence>
                                {filteredBids.map((bid) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={bid.id}
                                        className="glass group p-6 rounded-[2rem] border border-transparent hover:border-primary/30 transition-all hover:translate-x-2 flex flex-col md:flex-row items-center justify-between gap-6"
                                    >
                                        <div className="flex-1 space-y-3 w-full">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-lg tracking-tighter uppercase">{bid.project?.title || "Unknown Project"}</h3>
                                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">ID: {bid.id.slice(0, 8)}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed pl-1">
                                                {bid.proposal}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-border/30 pt-6 md:pt-0 md:pl-10 justify-between md:justify-end">
                                            <div className="text-right">
                                                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Proposed Value</p>
                                                <p className="text-2xl font-black tracking-tighter tabular-nums">{formatCurrency(bid.bidAmount)}</p>
                                                <span className="text-[9px] font-black uppercase text-muted-foreground opacity-60 tracking-widest">{formatDate(bid.createdAt)}</span>
                                            </div>

                                            <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                                <div className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-lg transition-transform group-hover:scale-105",
                                                    bid.status === "PENDING" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                        bid.status === "ACCEPTED" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                                            bid.status === "REJECTED" ? "bg-destructive/10 text-destructive border-destructive/20" :
                                                                "bg-muted/50 text-muted-foreground border-border/50"
                                                )}>
                                                    {bid.status}
                                                </div>
                                                <div className="flex gap-2">
                                                    {bid.status === "PENDING" && (
                                                        <button
                                                            onClick={() => {
                                                                const newAmount = prompt("Enter new bid amount:", bid.bidAmount.toString());
                                                                const newProposal = prompt("Enter new proposal:", bid.proposal);
                                                                if (newAmount && newProposal) {
                                                                    fetch(`/api/bids/${bid.id}`, {
                                                                        method: "PATCH",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({
                                                                            bidAmount: newAmount,
                                                                            proposal: newProposal
                                                                        })
                                                                    }).then(() => fetchMyBids());
                                                                }
                                                            }}
                                                            className="p-2.5 glass bg-white/5 border-border/50 hover:bg-white/10 text-primary transition-colors rounded-xl shadow-md"
                                                            title="Edit Bid"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {bid.status === "ACCEPTED" && (
                                                        <button
                                                            onClick={() => {
                                                                const files = prompt("Enter file links or description of deliverables:");
                                                                if (files) {
                                                                    fetch(`/api/projects/${bid.projectId}`, {
                                                                        method: "PATCH",
                                                                        headers: { "Content-Type": "application/json" },
                                                                        body: JSON.stringify({ submission: files })
                                                                    }).then(res => {
                                                                        if (res.ok) alert("Project files submitted successfully!");
                                                                        fetchMyBids();
                                                                    });
                                                                }
                                                            }}
                                                            className="p-2.5 glass bg-green-500/10 border-green-500/20 hover:bg-green-500/20 text-green-500 transition-colors rounded-xl shadow-md"
                                                            title="Submit Files"
                                                        >
                                                            <Rocket className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button className="p-2.5 glass bg-white/5 border-border/50 hover:bg-primary/20 hover:text-primary transition-colors rounded-xl shadow-md">
                                                        <MessageSquare className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

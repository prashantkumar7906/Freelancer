"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Briefcase, IndianRupee, MapPin, Filter, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

function BrowseProjectsContent() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [bidAmount, setBidAmount] = useState("");
    const [proposal, setProposal] = useState("");
    const [bidLoading, setBidLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const user = useAuthStore((state) => state.user);
    const searchParams = useSearchParams();
    const targetId = searchParams.get("id");
    const detailRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject && window.innerWidth < 1024) {
            detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [selectedProject]);

    const fetchProjects = async () => {
        try {
            const res = await fetch("/api/projects?status=OPEN");
            const data = await res.json();
            if (Array.isArray(data)) {
                setProjects(data);
                // Auto-select project from URL if present
                if (targetId) {
                    const found = data.find(p => p.id === targetId);
                    if (found) setSelectedProject(found);
                }
            } else {
                setProjects([]);
                if (data.error) setMessage({ type: "error", text: data.error });
            }
        } catch (err) {
            console.error(err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBidSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            setMessage({ type: "error", text: "You must be logged in to bid" });
            return;
        }

        setBidLoading(true);
        setMessage({ type: "", text: "" });

        try {
            const res = await fetch("/api/bids", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    projectId: selectedProject.id,
                    freelancerId: user.id,
                    bidAmount: parseFloat(bidAmount),
                    proposal,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: "success", text: "Proposal transmitted successfully" });
                setBidAmount("");
                setProposal("");
                fetchProjects(); // Refresh list to update bid count
            } else {
                setMessage({ type: "error", text: data.error || "Uplink failed" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Communication error" });
        } finally {
            setBidLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold uppercase tracking-tighter">Browse Available Signals</h1>
                <div className="relative max-w-sm w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Scan registry for signatures..."
                        className="input-field pl-12 h-12 bg-white/5 border-border/50 focus:border-primary/50 text-xs font-bold transition-all"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-none">
                <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg shadow-primary/20">All Frequencies</button>
                {["Development", "Engineering", "Interface", "Architecture", "Logistics"].map(cat => (
                    <button key={cat} className="px-5 py-2.5 glass border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap hover:bg-white/10 transition-colors">{cat}</button>
                ))}
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                {/* Project List */}
                <div className="lg:col-span-2 space-y-4 h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4 glass rounded-[2.5rem] border border-border/30">
                            <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Synchronizing data stream...</p>
                        </div>
                    ) : !Array.isArray(projects) || projects.length === 0 ? (
                        <div className="p-20 text-center glass rounded-[2.5rem] border border-border/30 border-dashed bg-white/5">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">Zero open signals detected at this range.</p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {projects.map((project, idx) => (
                                <motion.div
                                    variants={itemVariants}
                                    layout
                                    key={project.id}
                                    onClick={() => setSelectedProject(project)}
                                    className={cn(
                                        "glass p-8 rounded-[2rem] border transition-all cursor-pointer group relative overflow-hidden",
                                        selectedProject?.id === project.id
                                            ? "border-primary/50 bg-primary/10 shadow-[0_0_30px_rgba(59,130,246,0.1)] translate-x-3"
                                            : "border-border/30 hover:border-primary/30 hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black tracking-tighter uppercase group-hover:text-primary transition-colors flex items-center gap-3">
                                                {project.title}
                                                {idx === 0 && <span className="bg-primary/20 text-primary text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-primary/20">Active Pulse</span>}
                                            </h3>
                                            <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                                                <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {project.category}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {formatDate(project.createdAt)}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">Signal Bounty</p>
                                            <p className="text-2xl font-black text-foreground tracking-tighter tabular-nums">{formatCurrency(project.budget)}</p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm font-medium leading-relaxed line-clamp-2 mb-6 relative z-10 opacity-80">{project.description}</p>

                                    <div className="flex items-center justify-between relative z-10 border-t border-border/20 pt-4">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{project._count?.bids || 0} UPLINKS ESTABLISHED</span>
                                        <ArrowRight className={cn("w-5 h-5 transition-transform group-hover:translate-x-2 text-primary", selectedProject?.id === project.id ? "opacity-100" : "opacity-0")} />
                                    </div>

                                    <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                {/* Project Details & Bidding */}
                <div className="lg:col-span-1" ref={detailRef}>
                    <AnimatePresence mode="wait">
                        {selectedProject ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={selectedProject.id}
                                className="glass rounded-[2.5rem] border border-primary/20 shadow-2xl p-10 sticky top-24 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

                                <h2 className="text-3xl font-black mb-8 tracking-tighter uppercase leading-none">
                                    {selectedProject.title}
                                </h2>

                                <div className="space-y-8 mb-10 pb-10 border-b border-border/30">
                                    <div className="p-6 bg-primary/5 rounded-[1.5rem] border border-primary/20">
                                        <h4 className="text-[9px] font-black text-primary uppercase mb-1 tracking-[0.3em]">Clearance Value</h4>
                                        <p className="text-4xl font-black text-foreground tracking-tighter leading-none">{formatCurrency(selectedProject.budget)}</p>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Technical Directives</h4>
                                        <p className="text-sm text-foreground/80 leading-relaxed font-medium">{selectedProject.description}</p>
                                    </div>
                                </div>

                                <form onSubmit={handleBidSubmit} className="space-y-6">
                                    <h3 className="font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 text-primary">
                                        Initiate Proposal Protocol
                                    </h3>

                                    {message.text && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            className={cn(
                                                "p-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-4",
                                                message.type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-destructive/10 border-destructive/20 text-destructive"
                                            )}
                                        >
                                            <div className={cn("w-2 h-2 rounded-full", message.type === 'success' ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-destructive shadow-[0_0_10px_rgba(239,68,68,0.5)]")} />
                                            {message.text}
                                        </motion.div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Bid Amplitude (INR)</label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                            <input
                                                type="number"
                                                required
                                                className="input-field pl-12 h-14 bg-white/5 border-border/50 focus:border-primary/50 text-xs font-bold rounded-2xl transition-all"
                                                placeholder="0.00"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest pl-1">Expert Justification</label>
                                        <textarea
                                            required
                                            rows={5}
                                            className="input-field resize-none py-5 bg-white/5 border-border/50 focus:border-primary/50 text-xs font-bold rounded-2xl transition-all"
                                            placeholder="Specify your technical edge..."
                                            value={proposal}
                                            onChange={(e) => setProposal(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={bidLoading}
                                        className="btn-primary w-full py-5 text-[10px] font-black uppercase tracking-[0.4em] group relative overflow-hidden rounded-2xl"
                                    >
                                        <span className="relative z-10">{bidLoading ? "Transmitting..." : "Send Proposal"}</span>
                                        <motion.div
                                            initial={{ x: "-100%" }}
                                            whileHover={{ x: "0%" }}
                                            className="absolute inset-0 bg-white/5"
                                        />
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass rounded-[2.5rem] border border-border/30 border-dashed p-16 text-center text-muted-foreground sticky top-24 backdrop-blur-sm"
                            >
                                <Briefcase className="h-16 w-16 mx-auto mb-8 opacity-10 animate-pulse text-primary" />
                                <p className="text-xs font-black uppercase tracking-[0.3em] leading-relaxed">Select a terminal node to decrypt specifications and initiate uplink.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default function BrowseProjectsPage() {
    return (
        <Suspense fallback={
            <div className="p-20 text-center flex flex-col items-center gap-4 glass rounded-[2.5rem] border border-border/30">
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Initializing signal scanner...</p>
            </div>
        }>
            <BrowseProjectsContent />
        </Suspense>
    );
}

import { Clock } from "lucide-react";

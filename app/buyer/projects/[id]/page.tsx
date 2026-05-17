"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Check, X, Star, FileText, ArrowLeft, Clock, Users } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [project, setProject] = useState<any>(null);
    const [bids, setBids] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [awardingId, setAwardingId] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchProject();
            fetchBids();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${id}`);
            const data = await res.json();
            setProject(data);
        } catch (err) { console.error(err); }
    };

    const fetchBids = async () => {
        try {
            const res = await fetch(`/api/bids?projectId=${id}`);
            const data = await res.json();
            setBids(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAward = async (bidId: string) => {
        if (!confirm("Are you sure you want to award this project? 30% upfront will be deducted from your wallet.")) return;

        setAwardingId(bidId);
        try {
            const res = await fetch("/api/projects/award", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bidId, buyerId: user?.id }),
            });

            const data = await res.json();
            if (!res.ok) {
                if (data.insufficientFunds) {
                    alert(`Insufficient wallet balance. You need ₹${data.requiredAmount} but have ₹${data.availableBalance}. Please add funds to your wallet.`);
                    router.push("/buyer/wallet");
                } else {
                    throw new Error(data.error);
                }
            } else {
                alert("Project awarded successfully!");
                fetchProject();
                fetchBids();
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setAwardingId(null);
        }
    };

    if (loading) return (
        <div className="p-32 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full" />
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin relative z-10" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Decrypting Mission Data...</p>
        </div>
    );

    if (!project) return <div className="p-12 text-center text-destructive font-bold">Mission coordinates invalid.</div>;

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-20">
            <Link href="/buyer/projects" className="group flex items-center text-muted-foreground hover:text-primary transition-colors mb-4 w-fit">
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-primary/10 mr-3 transition-colors">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest">Return to Mission Control</span>
            </Link>

            <div className="glass rounded-[3rem] border border-border/50 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />

                <div className="p-10 border-b border-white/10 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase rounded-lg tracking-widest shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                    {project.category}
                                </span>
                                <span className={cn(
                                    "px-3 py-1 text-[9px] font-bold uppercase rounded-lg tracking-widest border",
                                    project.status === 'OPEN' ? "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]" : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                )}>
                                    {project.status}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">{project.title}</h1>
                        </div>
                        <div className="text-right bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">Mission Bounty</p>
                            <p className="text-4xl font-black text-primary tracking-tighter tabular-nums text-shadow-glow">{formatCurrency(project.budget)}</p>
                        </div>
                    </div>
                </div>
                <div className="p-10 relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center text-muted-foreground">
                        <FileText className="h-4 w-4 mr-2 text-primary" /> Mission Briefing
                    </h3>
                    <div className="prose prose-invert max-w-none">
                        <p className="text-lg leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">{project.description}</p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-4">
                    <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Users className="h-6 w-6 text-primary" /> Incoming Signals <span className="text-lg text-muted-foreground opacity-50">({bids.length})</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {bids.length === 0 ? (
                        <div className="glass rounded-[2rem] border border-border/50 border-dashed p-20 text-center text-muted-foreground flex flex-col items-center">
                            <div className="p-6 bg-white/5 rounded-full mb-4 animate-pulse">
                                <Users className="h-8 w-8 opacity-50" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.3em]">No signals intercepted yet.</p>
                        </div>
                    ) : (
                        bids.map((bid, i) => (
                            <div key={bid.id} className={cn(
                                "glass rounded-[2.5rem] border transition-all p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group hover:scale-[1.01]",
                                bid.status === 'ACCEPTED' ? "border-primary ring-1 ring-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]" : "border-white/5 hover:border-primary/30"
                            )}>
                                {bid.status === 'ACCEPTED' && (
                                    <div className="absolute top-0 right-0 p-3 bg-green-500 text-black font-black text-[9px] uppercase tracking-widest rounded-bl-2xl">
                                        Mission Assigned
                                    </div>
                                )}

                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center font-black text-xl text-white shadow-lg">
                                                {bid.freelancer.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-lg">{bid.freelancer.email}</p>
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3" /> Transmitted {formatDate(bid.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right hidden md:block">
                                            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Proposed Value</p>
                                            <p className="text-2xl font-black text-primary tracking-tighter">{formatCurrency(bid.bidAmount)}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                        <p className="text-[9px] font-black mb-3 uppercase tracking-widest text-muted-foreground opacity-60">Freelancer Proposal</p>
                                        <p className="text-sm leading-relaxed font-medium text-foreground/90">{bid.proposal}</p>
                                    </div>
                                    <div className="md:hidden pt-4 border-t border-white/5 flex justify-between items-center">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Proposed Value</p>
                                        <p className="text-xl font-black text-primary tracking-tighter">{formatCurrency(bid.bidAmount)}</p>
                                    </div>
                                </div>

                                <div className="shrink-0 flex md:flex-col justify-end gap-3 pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-8 min-w-[180px]">
                                    {project.status === 'OPEN' ? (
                                        <>
                                            <button
                                                onClick={() => handleAward(bid.id)}
                                                disabled={awardingId === bid.id}
                                                className="btn-primary flex items-center justify-center py-4 px-6 w-full text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                                            >
                                                {awardingId === bid.id ? "Processing..." : "Award Mission"}
                                            </button>
                                            <button className="px-6 py-4 glass rounded-2xl border border-white/10 font-bold hover:bg-white/10 transition-colors w-full text-xs uppercase tracking-widest">
                                                Shortlist
                                            </button>
                                        </>
                                    ) : (
                                        <div className={cn(
                                            "px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center",
                                            bid.status === 'ACCEPTED' ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-white/5 text-muted-foreground border border-white/10"
                                        )}>
                                            {bid.status === 'ACCEPTED' && <Check className="h-4 w-4 mr-2" />}
                                            {bid.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

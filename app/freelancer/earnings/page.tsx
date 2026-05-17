"use client";

import { motion, AnimatePresence } from "framer-motion";
import { IndianRupee, TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Download, Wallet, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function FreelancerEarningsPage() {
    const user = useAuthStore((state) => state.user);
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            Promise.all([
                fetch(`/api/wallet/balance?userId=${user.id}`).then(res => res.json()),
                fetch(`/api/payments/transactions?userId=${user.id}`).then(res => res.json())
            ]).then(([walletData, transData]) => {
                setBalance(walletData.balance);
                setTransactions(Array.isArray(transData) ? transData : transData.transactions || []);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [user]);

    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [withdrawMethod, setWithdrawMethod] = useState("Bank Transfer");
    const [withdrawDetails, setWithdrawDetails] = useState("");

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/payments/withdraw", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id,
                    amount: parseFloat(withdrawAmount),
                    method: withdrawMethod,
                    details: withdrawDetails
                })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Withdrawal request submitted successfully!");
                setShowWithdrawModal(false);
                // Refresh data
                window.location.reload();
            } else {
                alert(data.error || "Withdrawal failed");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const earnings = {
        totalBalance: balance || 0,
        pendingClearance: 0,
        availableWithdraw: balance || 0,
        lastMonthGrowth: 0,
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            {/* Main Wallet Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-[3rem] p-10 border border-primary/20 shadow-[0_0_50px_rgba(59,130,246,0.1)] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48" />

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/30">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">Neural Treasury</h2>
                        </div>
                        <div>
                            <p className="text-xs font-black text-primary/60 uppercase tracking-widest mb-1">Total Net Worth</p>
                            <h1 className="text-6xl font-black tracking-tighter tabular-nums">{formatCurrency(earnings.totalBalance)}</h1>
                        </div>
                        <div className="flex items-center gap-2 text-green-500 font-bold text-sm bg-green-500/10 w-fit px-3 py-1 rounded-full border border-green-500/20">
                            <TrendingUp className="w-4 h-4" />
                            <span>+{earnings.lastMonthGrowth}% Growth</span>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full md:w-auto">
                        <button 
                            onClick={() => setShowWithdrawModal(true)}
                            className="btn-primary flex-1 md:flex-none py-5 px-10 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-105 transition-transform active:scale-95">
                            Withdraw <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-border/30">
                    <div className="glass bg-white/5 p-6 rounded-[2rem] border border-border/50">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">Available for Uplink</p>
                        <p className="text-2xl font-black text-foreground">{formatCurrency(earnings.availableWithdraw)}</p>
                    </div>
                    <div className="glass bg-white/5 p-6 rounded-[2rem] border border-border/50">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1 tracking-widest">In Transit (Escrow)</p>
                        <p className="text-2xl font-black text-primary/80">{formatCurrency(earnings.pendingClearance)}</p>
                    </div>
                </div>
            </motion.div>

            {/* Withdrawal Modal */}
            <AnimatePresence>
                {showWithdrawModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowWithdrawModal(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative glass rounded-[2.5rem] p-8 border border-white/10 w-full max-w-lg shadow-2xl"
                        >
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-6">Initiate Payout</h3>
                            <form onSubmit={handleWithdraw} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount (₹)</label>
                                    <input 
                                        type="number"
                                        required
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="e.g. 10000"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-sm font-bold focus:ring-1 ring-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Payment Channel</label>
                                    <select 
                                        value={withdrawMethod}
                                        onChange={(e) => setWithdrawMethod(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-sm font-bold focus:ring-1 ring-primary outline-none appearance-none"
                                    >
                                        <option value="Bank Transfer">Bank Transfer (IMPS/NEFT)</option>
                                        <option value="UPI">UPI (Google Pay/PhonePe)</option>
                                        <option value="PayPal">PayPal</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Account Details / ID</label>
                                    <input 
                                        type="text"
                                        required
                                        value={withdrawDetails}
                                        onChange={(e) => setWithdrawDetails(e.target.value)}
                                        placeholder="Account No / VPA ID"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-sm font-bold focus:ring-1 ring-primary outline-none"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setShowWithdrawModal(false)}
                                        className="flex-1 glass py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 btn-primary py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                                    >
                                        Confirm Withdrawal
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transaction Ledger */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-border/50 shadow-2xl relative"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">Financial Ledger</h3>
                            <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 tracking-widest">Real-time Transaction Stream</p>
                        </div>
                        <button className="p-3 bg-muted rounded-xl hover:bg-border transition-colors">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {transactions.map((txn, i) => (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                key={txn.id}
                                className="group p-5 rounded-2xl hover:bg-primary/5 transition-all border border-transparent hover:border-primary/20 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg",
                                        txn.type === "INCOME" ? "bg-green-500/10 text-green-500 shadow-green-500/10" : "bg-destructive/10 text-destructive shadow-destructive/10"
                                    )}>
                                        {txn.type === "INCOME" ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm tracking-tight">{txn.description}</h4>
                                        <div className="flex items-center gap-3 mt-1 opacity-60">
                                            <span className="text-[9px] font-black uppercase tracking-widest">{txn.id}</span>
                                            <div className="w-1 h-1 bg-border rounded-full" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{formatDate(txn.date)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className={cn(
                                        "text-lg font-black tabular-nums tracking-tighter",
                                        txn.amount > 0 ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {txn.amount > 0 ? "+" : ""}{formatCurrency(txn.amount)}
                                    </p>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md",
                                        txn.status === "CLEARED" ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                                    )}>
                                        {txn.status === "CLEARED" ? "Finalized" : "Pending"}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-5 border-2 border-dashed border-border/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-primary/50 hover:text-primary transition-all group">
                        Load Full History <ArrowRight className="inline ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Right Sidebar: Analytics */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                >
                    <div className="glass rounded-[2rem] p-8 border border-border/50 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-6">Revenue Pulse</h3>

                        <div className="space-y-6">
                            {[
                                { label: "Project Bounties", value: 85, color: "bg-primary" },
                                { label: "Performance Bonus", value: 35, color: "bg-orange-500" },
                                { label: "Neural Royalties", value: 15, color: "bg-green-500" }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-muted-foreground">{stat.label}</span>
                                        <span className="text-foreground">{stat.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                            className={cn("h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]", stat.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass bg-primary/5 rounded-[2rem] p-8 border border-primary/20 shadow-xl text-center space-y-4">
                        <div className="p-4 bg-primary text-white w-fit mx-auto rounded-2xl shadow-[0_10px_20px_rgba(59,130,246,0.3)]">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Next Payout</h4>
                        <p className="text-3xl font-black tracking-tighter">
                            {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric" }).toUpperCase()}
                        </p>
                        <p className="text-xs font-medium text-muted-foreground">Estimated Total: {formatCurrency(earnings.totalBalance)}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

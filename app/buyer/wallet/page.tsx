"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Wallet, IndianRupee, ArrowDownCircle, ArrowUpCircle, Plus, CheckCircle, ShieldCheck, Zap } from "lucide-react";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function WalletPage() {
    const user = useAuthStore((state) => state.user);
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [rzpLoaded, setRzpLoaded] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchWalletData();
            fetchTransactions();
        }
    }, [user]);

    const fetchWalletData = async () => {
        try {
            const res = await fetch(`/api/wallet/balance?userId=${user?.id}`);
            const data = await res.json();
            setBalance(data.balance);
        } catch (err) { console.error(err); }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(`/api/payments/transactions?userId=${user?.id}`);
            const data = await res.json();
            setTransactions(data);
        } catch (err) { console.error(err); }
    };

    const handleAddFunds = async () => {
        if (!amount || isNaN(parseFloat(amount))) return;

        // Development Bypass: If Razorpay is not loaded or key is missing, simulate success
        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const razorpayConstructor = (window as any).Razorpay;

        if (!razorpayKey || !razorpayConstructor) {
            console.warn("[PAYMENT] Razorpay Key Missing or Script Not Loaded. Simulating success for dev flow.");
            setLoading(true);
            try {
                const simulateRes = await fetch("/api/payments/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_payment_id: `mock_pay_${Math.random().toString(36).substring(7)}`,
                        razorpay_order_id: `mock_order_${Math.random().toString(36).substring(7)}`,
                        razorpay_signature: "mock_sig",
                        userId: user?.id,
                        amount: parseFloat(amount),
                        type: "DEPOSIT"
                    }),
                });
                if (simulateRes.ok) {
                    // alert("Funds added successfully! (SIMULATED FOR DEVELOPMENT)");
                    fetchWalletData();
                    fetchTransactions();
                    setAmount("");
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });
            const order = await res.json();

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "FreelancePro",
                description: "Add funds to wallet",
                order_id: order.id,
                handler: async function (response: any) {
                    const verifyRes = await fetch("/api/payments/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...response,
                            userId: user?.id,
                            amount: parseFloat(amount),
                            type: "DEPOSIT"
                        }),
                    });
                    if (verifyRes.ok) {
                        // alert("Funds added successfully!");
                        fetchWalletData();
                        fetchTransactions();
                        setAmount("");
                    }
                },
                prefill: {
                    email: user?.email,
                },
                theme: { color: "#2E75B6" },
            };

            const rzp = new razorpayConstructor(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10">
            <Script
                src="https://checkout.razorpay.com/v1/checkout.js"
                onLoad={() => setRzpLoaded(true)}
            />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-4 mb-4"
            >
                <div className="p-3 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30">
                    <Wallet className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                        Capital Reserves
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        Secure Transaction Gateway
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Wallet Balance Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass bg-gradient-to-br from-green-500/20 to-emerald-700/20 rounded-[2.5rem] p-10 border border-green-500/30 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                    <IndianRupee className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-bold text-sm uppercase tracking-widest text-green-100/80">Available Balance</span>
                            </div>
                            <h2 className="text-6xl font-black tracking-tighter text-white tabular-nums mb-2">
                                {formatCurrency(balance)}
                            </h2>
                        </div>

                        <div className="mt-8 flex items-center gap-3 bg-black/20 w-fit px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm">
                            <ShieldCheck className="h-4 w-4 text-green-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Escrow Secured Level 1</span>
                        </div>
                    </div>
                    {/* Decorative Elements */}
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 rounded-full blur-[80px]" />
                    <div className="absolute bottom-0 right-0 opacity-20 transform translate-y-10 translate-x-10">
                        <Wallet className="w-64 h-64 text-white" />
                    </div>
                </motion.div>

                {/* Add Funds Form */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass rounded-[2.5rem] p-10 border border-white/10 shadow-xl"
                >
                    <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" /> Inject Capital
                    </h3>
                    <div className="space-y-6">
                        <div className="relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 block ml-1">Amount (INR)</label>
                            <div className="relative group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xl">₹</span>
                                <input
                                    type="number"
                                    className="input-field pl-12 h-16 text-2xl font-black bg-white/5 border-white/10 focus:border-green-500/50 rounded-2xl"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {[500, 1000, 2000, 5000].map(val => (
                                <button
                                    key={val}
                                    onClick={() => setAmount(val.toString())}
                                    className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-green-500 hover:text-white hover:border-green-500 transition-all shadow-sm"
                                >
                                    +₹{val}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleAddFunds}
                            disabled={loading || !amount}
                            className="btn-primary w-full py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40"
                        >
                            {loading ? (
                                <span className="flex gap-1"><span className="animate-bounce">●</span><span className="animate-bounce delay-100">●</span><span className="animate-bounce delay-200">●</span></span>
                            ) : (
                                <><Plus className="mr-2 h-4 w-4" /> Initialize Transfer</>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Transaction History */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-[2rem] border border-white/10 shadow-xl overflow-hidden"
            >
                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <h3 className="text-lg font-black uppercase tracking-tighter">Transaction Ledger</h3>
                    <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline hover:text-primary/80 transition-colors">
                        Export Data
                    </button>
                </div>
                <div className="divide-y divide-white/5">
                    {transactions.length === 0 ? (
                        <div className="p-20 text-center text-muted-foreground opacity-50 flex flex-col items-center">
                            <Wallet className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-xs font-black uppercase tracking-widest">No signals detected in ledger.</p>
                        </div>
                    ) : (
                        transactions.map((tx, i) => (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                key={tx.id}
                                className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center space-x-6">
                                    <div className={cn(
                                        "p-4 rounded-2xl shadow-lg transition-transform group-hover:scale-110",
                                        tx.type === 'DEPOSIT' ? "bg-green-500/10 text-green-500 shadow-green-500/10" : "bg-blue-500/10 text-blue-500 shadow-blue-500/10"
                                    )}>
                                        {tx.type === 'DEPOSIT' ? <ArrowDownCircle className="h-6 w-6" /> : <ArrowUpCircle className="h-6 w-6" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm uppercase tracking-wider text-foreground">{tx.type}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-medium text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">
                                                {formatDate(tx.createdAt)}
                                            </span>
                                            <span className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">
                                                ID: {tx.razorpayPaymentId?.slice(-6) || tx.id.slice(0, 6)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={cn(
                                        "text-xl font-black tracking-tighter tabular-nums",
                                        tx.type === 'DEPOSIT' ? "text-green-500" : "text-blue-500"
                                    )}>
                                        {tx.type === 'DEPOSIT' ? "+" : "-"}{formatCurrency(tx.amount)}
                                    </p>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full border",
                                        tx.status === 'SUCCESS' ? "border-green-500/20 text-green-500" : "border-yellow-500/20 text-yellow-500"
                                    )}>
                                        {tx.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}

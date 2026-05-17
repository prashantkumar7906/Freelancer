"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Cosmos } from "@/components/auth/cosmos";
import { FloatContainer } from "@/components/auth/float-container";
import { Lock, Mail, Phone, Users, Zap, Star } from "lucide-react";

const AnimatedText = ({ text }: { text: string }) => {
    const letters = Array.from(text);
    const container = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
        }),
    };

    const child = {
        visible: (i: number = 1) => ({
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            } as any,
        }),
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            } as any,
        },
    } as any;

    return (
        <motion.div
            style={{ display: "flex", overflow: "hidden" }}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index}>
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const isShattering = useAuthStore((state) => state.isShattered);

    const [formData, setFormData] = useState({
        email: "",
        phoneNumber: "",
        password: "",
        role: "FREELANCER",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";

        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Something went wrong");

            if (isLogin || data.user) {
                setUser(data.user);
                if (data.user.role === "ADMIN") router.push("/admin");
                else if (data.user.role === "BUYER") router.push("/buyer");
                else router.push("/freelancer");
            } else {
                router.push(`/auth/verify?userId=${data.userId}`);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative w-full flex items-center justify-center overflow-hidden">
            <Cosmos />

            <AnimatePresence mode="wait">
                {!isShattering && (
                    <FloatContainer className="relative z-10 w-full max-w-md p-4">
                        <motion.div
                            layout
                            className="glass rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(59,130,246,0.1)] border-white/10"
                        >
                            <div className="mb-8 text-center flex flex-col items-center">
                                <motion.div
                                    initial={{ rotate: 180, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl relative"
                                >
                                    <Zap className="w-8 h-8 fill-white animate-pulse" />
                                    {/* Orbital Elements */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-20px] border border-primary/20 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ rotate: -360 }}
                                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                        className="absolute inset-[-40px] border border-white/5 rounded-full"
                                    />
                                </motion.div>

                                <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
                                    <AnimatedText text="FreelancePro" />
                                </h1>
                                <p className="text-white/50 font-medium">
                                    {isLogin ? "Neural uplink ready." : "Initiating agent protocol."}
                                </p>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{
                                        x: [0, -5, 5, -5, 5, 0],
                                        opacity: 1
                                    }}
                                    transition={{
                                        x: { duration: 0.5, repeat: 0, ease: "linear" },
                                        opacity: { duration: 0.3 }
                                    }}
                                    className="mb-6 rounded-2xl bg-destructive/10 p-4 text-xs font-bold text-destructive border border-destructive/20 flex items-center gap-3"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-ping" />
                                    {error.toUpperCase()}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {!isLogin ? (
                                        <motion.div
                                            key="register-fields"
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -20, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Selection: Role</label>
                                                <div className="relative group">
                                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                                    <select
                                                        className="input-field pl-12 bg-white/5 hover:bg-white/10"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                                    >
                                                        <option value="FREELANCER" className="bg-slate-900">Freelancer</option>
                                                        <option value="BUYER" className="bg-slate-900">Buyer</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Identity: Email</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="email"
                                                        required
                                                        suppressHydrationWarning
                                                        autoComplete="email"
                                                        className="input-field pl-12 bg-white/5 hover:bg-white/10"
                                                        placeholder="vector@cosmic.id"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Subsystem: Phone</label>
                                                <div className="relative group">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="tel"
                                                        required
                                                        suppressHydrationWarning
                                                        autoComplete="tel"
                                                        className="input-field pl-12 bg-white/5 hover:bg-white/10"
                                                        placeholder="+00 000 000"
                                                        value={formData.phoneNumber}
                                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Encryption: Cipher</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="password"
                                                        required
                                                        suppressHydrationWarning
                                                        autoComplete="new-password"
                                                        className="input-field pl-12 bg-white/5 hover:bg-white/10"
                                                        placeholder="••••••••"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="login-fields"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: 50, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            className="space-y-6"
                                        >
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Identity: Email</label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="email"
                                                        required
                                                        suppressHydrationWarning
                                                        autoComplete="email"
                                                        className="input-field pl-12 bg-white/5 hover:bg-white/10"
                                                        placeholder="vector@cosmic.id"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2 ml-1">Encryption: Cipher</label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                                    <input
                                                        type="password"
                                                        required
                                                        suppressHydrationWarning
                                                        autoComplete="current-password"
                                                        className="input-field pl-12 bg-white/5 hover:bg-white/10"
                                                        placeholder="••••••••"
                                                        value={formData.password}
                                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.button
                                    layout
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59,130,246,0.3)" }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full mt-6 h-14 text-lg"
                                >
                                    {loading ? (
                                        <div className="flex space-x-2">
                                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity }} className="w-2 h-2 bg-white rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
                                        </div>
                                    ) : isLogin ? (
                                        "Authorize Access"
                                    ) : (
                                        "Establish Connection"
                                    )}
                                </motion.button>
                            </form>

                            <div className="mt-8 text-center pt-6 border-t border-white/5">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="text-white/40 hover:text-primary text-xs font-black uppercase tracking-[0.2em] transition-all"
                                >
                                    {isLogin ? "No account? Establish New ID" : "ID Verified? Return to Authorization"}
                                </button>
                            </div>
                        </motion.div>
                    </FloatContainer>
                )}
            </AnimatePresence>
        </main>
    );
}

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { PlusCircle, Info, Sparkles, Rocket, Layers, IndianRupee, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function PostProjectPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        budget: "",
        category: "Web Development",
    });

    const categories = [
        "Web Development",
        "Mobile Apps",
        "Design",
        "Writing",
        "Marketing",
        "Data Science",
        "Blockchain",
        "AI/ML"
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, buyerId: user?.id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            router.push("/buyer/projects");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-4 mb-8"
            >
                <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/30">
                    <Rocket className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                        Initiate Protocol
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        Launch a new project into the ecosystem
                    </p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-[2rem] border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.1)] overflow-hidden relative"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                <div className="p-8 border-b border-white/10 bg-white/5 flex items-start gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                        <Info className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-1">Mission Briefing</h3>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                            Define your objectives clearly. Specialized agents (freelancers) will analyze your requirements
                            and propose execution strategies. Precision is key.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-2"
                        >
                            <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-3 group">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors ml-1">
                            Project Designation (Title)
                        </label>
                        <div className="relative">
                            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-yellow-500 transition-colors" />
                            <input
                                type="text"
                                required
                                className="input-field pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 text-foreground font-bold text-lg placeholder:font-normal placeholder:text-muted-foreground/50 rounded-xl"
                                placeholder="e.g. Quantum Web Interface v2.0"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3 group">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors ml-1">
                                Sector (Category)
                            </label>
                            <div className="relative">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
                                <select
                                    className="input-field pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 text-foreground font-bold rounded-xl appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-[#0f172a] text-white">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 group">
                            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors ml-1">
                                Allocation (Budget)
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-green-500 transition-colors" />
                                <input
                                    type="number"
                                    required
                                    className="input-field pl-12 h-14 bg-white/5 border-white/10 focus:border-primary/50 text-foreground font-bold text-lg placeholder:font-normal placeholder:text-muted-foreground/50 rounded-xl"
                                    placeholder="50000"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 group">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors ml-1">
                            Parameters (Description)
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-6 w-5 h-5 text-muted-foreground group-focus-within:text-blue-400 transition-colors" />
                            <textarea
                                required
                                rows={8}
                                className="input-field pl-12 py-6 bg-white/5 border-white/10 focus:border-primary/50 text-foreground font-medium resize-none rounded-xl leading-relaxed"
                                placeholder="Detail the system architecture, required modules, and expected outcomes..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary min-w-[200px] flex items-center justify-center py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 group"
                        >
                            {loading ? (
                                <div className="flex gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.1s]" />
                                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                                </div>
                            ) : (
                                <span className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                                    <PlusCircle className="w-4 h-4" /> Initialize Project
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}

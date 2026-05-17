"use client";

import { useState } from "react";
import { Settings, Save, Bell, Shield, Percent, Sliders, ToggleLeft, Activity, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
    const [commissionRate, setCommissionRate] = useState("10");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("general");

    const handleUpdate = async () => {
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/admin/settings/commission", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commissionRate: parseFloat(commissionRate) }),
            });
            if (res.ok) setMessage("Parameters updated successfully!");
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "general", label: "Core Systems", icon: Sliders },
        { id: "notifications", label: "Signals", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-4 mb-4"
            >
                <div className="p-3 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-lg border border-white/10">
                    <Settings className="h-8 w-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Control Deck
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                        System Configuration Module
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="col-span-1 space-y-4">
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full p-4 rounded-xl border flex items-center gap-3 transition-all",
                                activeTab === tab.id
                                    ? "glass bg-primary/20 border-primary/50 text-foreground shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                    : "bg-background border-border hover:bg-white/5 text-muted-foreground"
                            )}
                        >
                            <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "opacity-50")} />
                            <div className="text-left">
                                <h3 className="font-bold text-xs uppercase tracking-widest">{tab.label}</h3>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="glass rounded-[2rem] p-10 border border-white/10 shadow-xl min-h-[500px] relative overflow-hidden"
                        >
                            {/* Content Background Grid */}
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:30px_30px]" />

                            <div className="relative z-10 space-y-8">
                                {activeTab === "general" && (
                                    <>
                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 flex items-center gap-2">
                                                <Percent className="h-5 w-5 text-primary" /> Economic Logic (Commission)
                                            </h3>
                                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">Global Take Rate</label>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative flex-1 group">
                                                        <input
                                                            type="number"
                                                            className="input-field h-16 text-3xl font-black pl-6 bg-black/20 border-white/10 focus:border-primary/50 text-white rounded-xl"
                                                            value={commissionRate}
                                                            onChange={(e) => setCommissionRate(e.target.value)}
                                                        />
                                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20">%</span>
                                                    </div>
                                                    <button
                                                        onClick={handleUpdate}
                                                        disabled={loading}
                                                        className="btn-primary h-16 px-8 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-primary/30"
                                                    >
                                                        {loading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <Save className="h-5 w-5" />}
                                                        <span className="font-black text-xs uppercase tracking-widest hidden md:inline">Execute</span>
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 mt-4 text-orange-400/80">
                                                    <Activity className="w-3 h-3" />
                                                    <p className="text-[10px] font-medium uppercase tracking-wider">
                                                        Warning: Updates affect all future transactions immediately.
                                                    </p>
                                                </div>
                                            </div>

                                            {message && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-6 p-4 bg-green-500/10 text-green-500 border border-green-500/20 rounded-xl text-xs font-bold uppercase tracking-widest text-center"
                                                >
                                                    {message}
                                                </motion.div>
                                            )}
                                        </div>
                                    </>
                                )}

                                {activeTab === "notifications" && (
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                                            <Bell className="h-5 w-5 text-primary" /> Signal Protocols
                                        </h3>
                                        <div className="space-y-4">
                                            {['Maintenance Mode', 'Audit Logging', 'User Registration Alerts'].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-foreground">{item}</h4>
                                                        <p className="text-xs text-muted-foreground mt-1">Manage system-wide behavior.</p>
                                                    </div>
                                                    <div className="w-14 h-8 bg-primary/20 rounded-full relative cursor-pointer border border-primary/30 transition-colors hover:bg-primary/30">
                                                        <div className="absolute right-1 top-1 w-6 h-6 bg-primary rounded-full shadow-lg" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === "security" && (
                                    <div className="text-center py-20 opacity-50">
                                        <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">Restricted Area</h3>
                                        <p className="text-xs font-medium">Root access verified. No active threats.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { MessageSquare, Send, User, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function FreelancerMessagesPage() {
    const user = useAuthStore((state) => state.user);
    const [selectedContactId, setSelectedContactId] = useState("test-buyer-id"); // Hardcoded for demo
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (user?.id && selectedContactId) fetchMessages();
    }, [user, selectedContactId]);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/messages?userId=${user?.id}&contactId=${selectedContactId}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setMessages(data); // Expecting ascending order from API
            } else {
                setMessages([]);
            }
        } catch (err) {
            console.error(err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    senderId: user?.id,
                    receiverId: selectedContactId,
                    content: newMessage
                }),
            });
            if (res.ok) {
                setNewMessage("");
                fetchMessages();
            }
        } catch (err) { console.error(err); }
    };

    return (
        <div className="h-[calc(100vh-14rem)] flex gap-8">
            {/* Sidebar: Conversations */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 glass rounded-[2rem] border border-border/50 shadow-2xl flex flex-col overflow-hidden"
            >
                <div className="p-8 border-b border-border/30 bg-primary/5">
                    <h3 className="font-black text-xs uppercase tracking-[0.3em] text-primary mb-1">Neural Channels</h3>
                    <p className="text-xl font-black text-foreground/80 tracking-tighter">Active Links</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {[1, 2].map(i => (
                        <motion.div
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                            whileTap={{ scale: 0.98 }}
                            key={i}
                            className={cn(
                                "p-4 flex items-center space-x-4 rounded-2xl cursor-pointer transition-all border border-transparent",
                                i === 1 ? "bg-primary/10 border-primary/20" : "hover:border-white/10"
                            )}
                        >
                            <div className="relative">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-black shadow-lg">B{i}</div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="font-black text-sm text-foreground truncate uppercase tracking-tighter">Protocol: Client {i}</p>
                                    <span className="text-[9px] font-bold text-muted-foreground uppercase">{i === 1 ? 'Now' : '2H'}</span>
                                </div>
                                <p className="text-[11px] text-muted-foreground truncate font-medium">Uplink established. Awaiting signal...</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 glass rounded-[2.5rem] border border-border/50 shadow-2xl flex flex-col overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <div className="p-8 border-b border-border/30 flex items-center justify-between backdrop-blur-md bg-white/5">
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div className="absolute -top-2 -right-2 p-1 bg-green-500 rounded-lg shadow-lg">
                                <Sparkles className="w-3 h-3 text-white animate-pulse" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-black tracking-tighter uppercase">Signal Processing</h3>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em]">Encrypted Connection</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-white/2 overflow-x-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Scanning frequencies...</p>
                        </div>
                    ) : !Array.isArray(messages) || messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-30">
                            <MessageSquare className="h-20 w-20 text-muted-foreground animate-float" />
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">No packets detected in this channel.</p>
                        </div>
                    ) : (
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    key={msg.id || idx}
                                    className="flex flex-col items-end w-full group"
                                >
                                    <div className="max-w-[80%] flex flex-col items-end">
                                        <div className="glass-morphism bg-primary p-5 rounded-[1.8rem] rounded-tr-[0.3rem] shadow-xl relative overflow-hidden group-hover:shadow-primary/20 transition-all border-none">
                                            <p className="text-sm font-medium leading-relaxed text-white">{msg.message}</p>
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 px-1">
                                            <Clock className="w-3 h-3 text-muted-foreground/50" />
                                            <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-tighter">{formatDate(msg.createdAt)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                <form onSubmit={handleSend} className="p-8 border-t border-border/30 bg-white/5 flex gap-4 backdrop-blur-xl">
                    <div className="flex-1 relative group">
                        <input
                            type="text"
                            className="input-field w-full h-14 pl-6 pr-14 bg-white/5 border-border/50 focus:border-primary/50 text-sm font-medium transition-all rounded-2xl"
                            placeholder="Enter transmission data..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="btn-primary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 p-0"
                    >
                        <Send className="h-6 w-6" />
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
}

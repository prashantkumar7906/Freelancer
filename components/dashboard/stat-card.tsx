"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    description?: string;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    color?: string; // Hex or Tailwind class
    delay?: number;
}

export function StatCard({ title, value, icon: Icon, description, trend, trendValue, color = "bg-primary", delay = 0 }: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            <Card variant="glass" hoverEffect={true} className="relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                    <Icon className="w-24 h-24" />
                </div>

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        {title}
                    </CardTitle>
                    <div className={`p-2 rounded-xl ${color}/10 text-${color.replace("bg-", "")}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{value}</div>
                    {(description || trendValue) && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            {trend === "up" && <span className="text-green-500 mr-1">↑ {trendValue}</span>}
                            {trend === "down" && <span className="text-red-500 mr-1">↓ {trendValue}</span>}
                            {description}
                        </p>
                    )}
                </CardContent>

                {/* Glow Effect */}
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 ${color} blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
            </Card>
        </motion.div>
    );
}

"use client";

import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
    value: number; // 0 to 100
    label?: string;
    subLabel?: string;
    color?: string;
    showValue?: boolean;
}

export function ProgressBar({ value, label, subLabel, color = "bg-primary", showValue = true }: ProgressBarProps) {
    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                {label && <span className="text-sm font-medium text-foreground">{label}</span>}
                {showValue && <span className="text-sm font-medium text-muted-foreground">{value}%</span>}
            </div>
            <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                <motion.div
                    className={`h-2.5 rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </div>
            {subLabel && <p className="text-xs text-muted-foreground mt-1">{subLabel}</p>}
        </div>
    );
}

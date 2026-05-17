"use client";

import React from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";

interface ShatterContainerProps {
    children: React.ReactNode;
    className?: string;
}

const shatterVariants = {
    normal: {
        opacity: 1,
        scale: 1,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        filter: "blur(0px)",
    },
    shattered: {
        opacity: [1, 1, 0],
        scale: [1, 1.1, 0.5],
        y: [0, -100, 1000],
        rotateX: [0, 45, 90],
        rotateY: [0, -45, -90],
        filter: ["blur(0px)", "blur(2px)", "blur(20px)"],
        transition: {
            duration: 3,
            times: [0, 0.1, 1], // Freeze for 300ms (0.1 of 3s)
            ease: ["easeInOut", "easeInOut", "easeInOut"] as any,
        }
    }
} as any;

export function ShatterContainer({ children, className }: ShatterContainerProps) {
    const isShattered = useAuthStore((state) => state.isShattered);

    return (
        <motion.div
            variants={shatterVariants}
            animate={isShattered ? "shattered" : "normal"}
            className={className}
            style={{ transformStyle: "preserve-3d" }}
        >
            {children}
        </motion.div>
    );
}

export function Fragment({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    const isShattered = useAuthStore((state) => state.isShattered);

    return (
        <motion.div
            animate={isShattered ? {
                x: (Math.random() - 0.5) * 1000,
                y: 1000,
                rotate: (Math.random() - 0.5) * 720,
                opacity: 0,
                transition: { duration: 2, delay: 0.3 + delay, ease: "easeIn" as any }
            } : {}}
        >
            {children}
        </motion.div>
    )
}

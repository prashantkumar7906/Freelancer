"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

interface FloatContainerProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function FloatContainer({ children, className, delay = 0 }: FloatContainerProps) {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const floatX = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), springConfig);
    const floatY = useSpring(useTransform(mouseY, [-500, 500], [-15, 15]), springConfig);
    const rotateX = useSpring(useTransform(mouseY, [-500, 500], [5, -5]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-5, 5]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        mouseX.set(clientX - innerWidth / 2);
        mouseY.set(clientY - innerHeight / 2);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{
                opacity: 1,
                x: 0,
                y: [0, -10, 0],
                transition: {
                    opacity: { duration: 1.2, ease: "easeOut", delay },
                    x: { duration: 1, type: "spring", stiffness: 100, damping: 20, delay },
                    y: {
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }
                }
            }}
            style={{
                x: floatX,
                y: floatY,
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            className={className}
        >
            {children}
        </motion.div>
    );
}

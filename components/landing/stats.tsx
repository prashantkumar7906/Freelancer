"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
    { label: "Active Experts", value: "12k+", numericValue: 12000, suffix: "+" },
    { label: "Successful Projects", value: "45k+", numericValue: 45000, suffix: "+" },
    { label: "Avg. Review", value: "4.9/5", numericValue: 4.9, suffix: "/5" },
    { label: "Fees", value: "Zero", numericValue: 0, suffix: "", isText: true },
];

export function Stats() {
    const sectionRef = useRef<HTMLElement>(null);
    const statRefs = useRef<(HTMLDivElement | null)[]>([]);
    const valueRefs = useRef<(HTMLHeadingElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Staggered reveal for each stat card
            statRefs.current.forEach((el, index) => {
                if (!el) return;

                gsap.fromTo(
                    el,
                    { opacity: 0, y: 50, scale: 0.9 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        delay: index * 0.15,
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none none",
                        },
                    }
                );
            });

            // Animated counters
            stats.forEach((stat, index) => {
                const valEl = valueRefs.current[index];
                if (!valEl || stat.isText) return;

                const counter = { value: 0 };
                gsap.to(counter, {
                    value: stat.numericValue,
                    duration: 2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: valEl,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                    onUpdate: () => {
                        if (stat.numericValue >= 1000) {
                            valEl.textContent = `${Math.floor(counter.value / 1000)}k${stat.suffix}`;
                        } else if (Number.isInteger(stat.numericValue)) {
                            valEl.textContent = `${Math.floor(counter.value)}${stat.suffix}`;
                        } else {
                            valEl.textContent = `${counter.value.toFixed(1)}${stat.suffix}`;
                        }
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-20 bg-muted/50" data-scroll-section>
            <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        ref={(el) => { statRefs.current[index] = el; }}
                        className="text-center"
                        style={{ opacity: 0 }}
                    >
                        <h3
                            ref={(el) => { valueRefs.current[index] = el; }}
                            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-foreground to-muted-foreground mb-2"
                        >
                            {stat.value}
                        </h3>
                        <p className="text-sm uppercase tracking-widest font-bold text-muted-foreground">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

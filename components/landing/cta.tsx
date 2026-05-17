"use client";

import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CTA() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const blob1Ref = useRef<HTMLDivElement>(null);
    const blob2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !cardRef.current) return;

        const ctx = gsap.context(() => {
            // Card entrance animation
            gsap.fromTo(
                cardRef.current,
                { opacity: 0, scale: 0.85, y: 60 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 85%",
                        toggleActions: "play none none none",
                    },
                }
            );

            // Parallax on background blobs
            if (blob1Ref.current) {
                gsap.to(blob1Ref.current, {
                    y: -80,
                    x: 40,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                });
            }

            if (blob2Ref.current) {
                gsap.to(blob2Ref.current, {
                    y: 80,
                    x: -40,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.5,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-32 px-4 relative overflow-hidden" data-scroll-section>
            <div className="absolute inset-0 bg-secondary/30 -skew-y-3 transform origin-top-left z-0" />

            <div className="max-w-5xl mx-auto relative z-10 text-center">
                <div
                    ref={cardRef}
                    className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-br from-electric-purple to-indigo-900 border border-white/10 shadow-2xl relative overflow-hidden"
                    style={{ opacity: 0 }}
                >
                    {/* Background decorations with parallax */}
                    <div
                        ref={blob1Ref}
                        className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-hot-pink/30 rounded-full blur-[100px]"
                    />
                    <div
                        ref={blob2Ref}
                        className="absolute bottom-[-50%] right-[-20%] w-[500px] h-[500px] bg-cyan/30 rounded-full blur-[100px]"
                    />

                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 relative z-10">
                        Ready to Scale your Vision?
                    </h2>
                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto relative z-10">
                        Stop settling for mediocre. Join the network where the top 1% builds the future.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link href="/auth">
                            <Button variant="default" size="lg" className="bg-white text-electric-purple hover:bg-white/90 shadow-xl">
                                Get Started Free
                            </Button>
                        </Link>
                        <Button variant="glass" size="lg" className="border-white/30 text-white hover:bg-white/10">
                            Talk to Sales
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

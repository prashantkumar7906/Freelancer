"use client";

import React, { useEffect, useRef, createContext, useContext, useState } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LocomotiveContextType {
    scroll: LocomotiveScroll | null;
}

const LocomotiveContext = createContext<LocomotiveContextType>({ scroll: null });

export const useLocomotive = () => useContext(LocomotiveContext);

export function LocomotiveProvider({ children }: { children: React.ReactNode }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollInstance, setScrollInstance] = useState<LocomotiveScroll | null>(null);

    useEffect(() => {
        if (!scrollRef.current) return;

        const scrollEl = scrollRef.current;

        // Initialize Locomotive Scroll v5 (Lenis-based)
        const locoScroll = new LocomotiveScroll({
            lenisOptions: {
                wrapper: scrollEl,
                content: scrollEl,
                lerp: 0.1,
                duration: 1.2,
                orientation: "vertical",
                gestureOrientation: "vertical",
                smoothWheel: true,
                touchMultiplier: 2,
            },
            scrollCallback: (values) => {
                ScrollTrigger.update();
            },
        });

        setScrollInstance(locoScroll);

        // Setup GSAP ScrollTrigger scroller proxy for Locomotive
        ScrollTrigger.scrollerProxy(scrollEl, {
            scrollTop(value?: number) {
                if (typeof value === "number") {
                    locoScroll.scrollTo(value, { duration: 0, immediate: true });
                    return undefined as unknown as number;
                }
                return locoScroll.lenisInstance?.scroll ?? 0;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
            pinType: scrollEl.style.transform ? "transform" : "fixed",
        });

        ScrollTrigger.defaults({ scroller: scrollEl });

        // Refresh after a short delay to ensure everything is measured
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);

        return () => {
            clearTimeout(timer);
            locoScroll.destroy();
            ScrollTrigger.getAll().forEach((t) => t.kill());
        };
    }, []);

    return (
        <LocomotiveContext.Provider value={{ scroll: scrollInstance }}>
            <div
                ref={scrollRef}
                data-scroll-container
                style={{
                    height: "100vh",
                    overflow: "auto",
                }}
            >
                {children}
            </div>
        </LocomotiveContext.Provider>
    );
}

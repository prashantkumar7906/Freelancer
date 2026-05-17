"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function RotatingShape({ position, speed, children }: { position: [number, number, number], speed: number, children: React.ReactNode }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHover] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * speed;
            meshRef.current.rotation.y += delta * speed * 0.5;
            if (hovered) {
                meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
            } else {
                meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
            }
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh
                ref={meshRef}
                position={position}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {children}
            </mesh>
        </Float>
    );
}

function Scene() {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Floating Shapes */}
            <RotatingShape position={[-4, 2, -2]} speed={0.5}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#7c3aed" roughness={0.2} metalness={0.8} emissive="#7c3aed" emissiveIntensity={0.2} />
            </RotatingShape>

            <RotatingShape position={[4, -2, -1]} speed={0.3}>
                <torusGeometry args={[0.8, 0.3, 16, 32]} />
                <meshStandardMaterial color="#06b6d4" roughness={0.2} metalness={0.8} emissive="#06b6d4" emissiveIntensity={0.2} />
            </RotatingShape>

            <RotatingShape position={[-3, -3, 0]} speed={0.4}>
                <octahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#db2777" roughness={0.2} metalness={0.8} emissive="#db2777" emissiveIntensity={0.2} />
            </RotatingShape>

            <RotatingShape position={[3, 3, -3]} speed={0.6}>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial color="#84cc16" roughness={0.2} metalness={0.8} emissive="#84cc16" emissiveIntensity={0.2} />
            </RotatingShape>

            <ContactShadows position={[0, -4.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
        </>
    );
}

export function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const canvasWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Parallax: text moves up faster than canvas as user scrolls past hero
            if (textRef.current) {
                gsap.to(textRef.current, {
                    y: -120,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
            }

            // Canvas moves slower for depth effect
            if (canvasWrapRef.current) {
                gsap.to(canvasWrapRef.current, {
                    y: 60,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 1,
                    },
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full h-screen pt-20 flex flex-col items-center justify-center overflow-hidden" data-scroll-section>
            {/* 3D Background */}
            <div ref={canvasWrapRef} className="absolute inset-0 z-0">
                <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
                    <Scene />
                </Canvas>
            </div>

            {/* Content Overlay */}
            <div ref={textRef} className="relative z-10 text-center px-6 max-w-5xl mx-auto pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="pointer-events-auto"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-primary mb-8 text-sm font-bold shadow-lg">
                        <Zap className="w-4 h-4 fill-primary" />
                        <span>The Future of Freelancing</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-foreground leading-[1.1] mb-8 tracking-tight">
                        Hire the Best. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-purple via-hot-pink to-cyan">
                            Work without Limits.
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join 50k+ businesses scaling with verified experts. Immersive collaboration, instant payments, and zero friction.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth">
                            <Button size="lg" variant="default" className="text-lg px-8 py-6 rounded-2xl shadow-2xl shadow-primary/30">
                                Start Hiring <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Button size="lg" variant="glass" className="text-lg px-8 py-6 rounded-2xl">
                            View Demo
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-0 pointer-events-none"></div>
        </section>
    );
}

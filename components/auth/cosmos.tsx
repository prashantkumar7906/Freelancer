"use client";

import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function StarField() {
    const ref = useRef<THREE.Points>(null!);
    const sphere = useMemo(() => {
        const positions = new Float32Array(5000 * 3);
        for (let i = 0; i < 5000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 10;
            ref.current.rotation.y -= delta / 15;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref as any} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#ffffff"
                    size={0.05}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>
        </group>
    );
}

function FloatingShapes() {
    return (
        <>
            <Float speed={1.4} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[1, 32, 32]} position={[4, 2, -5]}>
                    <MeshDistortMaterial
                        color="#3b82f6"
                        speed={3}
                        distort={0.4}
                        radius={1}
                        emissive="#1e40af"
                    />
                </Sphere>
            </Float>
            <Float speed={2} rotationIntensity={2} floatIntensity={1.5}>
                <Sphere args={[0.5, 32, 32]} position={[-5, -2, -3]}>
                    <MeshDistortMaterial
                        color="#8b5cf6"
                        speed={5}
                        distort={0.6}
                        radius={1}
                        emissive="#5b21b6"
                    />
                </Sphere>
            </Float>
        </>
    );
}

export function Cosmos() {
    return (
        <div className="fixed inset-0 z-0 bg-black">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#8b5cf6" />
                <StarField />
                <FloatingShapes />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none" />
        </div>
    );
}

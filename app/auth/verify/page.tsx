"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const [step, setStep] = useState(1); // 1: Email info, 2: Phone OTP, 3: Success
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, otpCode: otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return (
            <div className="auth-card text-center">
                <h2 className="text-xl font-bold text-destructive">Invalid Session</h2>
                <p className="mt-2">Please register again to continue.</p>
                <button onClick={() => router.push("/auth")} className="btn-primary mt-4">Go to Register</button>
            </div>
        );
    }

    return (
        <div className="auth-card">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-primary">Verification</h1>
                <div className="flex justify-center mt-4 space-x-2">
                    <div className={cn("h-2 w-8 rounded-full", step >= 1 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-2 w-8 rounded-full", step >= 2 ? "bg-primary" : "bg-muted")} />
                    <div className={cn("h-2 w-8 rounded-full", step >= 3 ? "bg-primary" : "bg-muted")} />
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-4">
                    <p className="text-center text-muted-foreground">
                        We've sent a verification link to your email. Please check your inbox and click the link to verify your email.
                    </p>
                    <div className="p-4 bg-accent/50 rounded-lg border border-accent">
                        <p className="text-sm font-medium">Next Step: Phone Verification</p>
                        <p className="text-xs text-muted-foreground mt-1">Once you verify your email, click the button below to verify your phone number.</p>
                    </div>
                    <button onClick={() => setStep(2)} className="btn-primary w-full">I've verified my email</button>
                </div>
            )}

            {step === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <p className="text-center text-muted-foreground">
                        Enter the 6-digit code sent to your phone number.
                    </p>
                    <div>
                        <input
                            type="text"
                            maxLength={6}
                            required
                            className="input-field text-center text-2xl tracking-[0.5em] font-bold"
                            placeholder="000000"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                        />
                    </div>
                    <button disabled={loading || otp.length < 6} className="btn-primary w-full">
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </form>
            )}

            {step === 3 && (
                <div className="text-center space-y-4">
                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold">Registration Complete!</h2>
                    <p className="text-muted-foreground">
                        Your application has been submitted to admin for approval. You will receive an email once your account is activated.
                    </p>
                    <button onClick={() => router.push("/auth")} className="btn-primary w-full">Back to Login</button>
                </div>
            )}
        </div>
    );
}

import { cn } from "@/lib/utils";

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}

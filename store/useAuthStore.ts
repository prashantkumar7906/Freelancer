import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
    id: string;
    email: string;
    role: "ADMIN" | "BUYER" | "FREELANCER";
}

interface AuthState {
    user: User | null;
    isShattered: boolean;
    setUser: (user: User | null) => void;
    setShattered: (val: boolean) => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isShattered: false,
            setUser: (user) => set({ user }),
            setShattered: (val) => set({ isShattered: val }),
            logout: async () => {
                // First set shattering state for cinematic effect
                set({ isShattered: true });

                try {
                    // Call API to clear cookie
                    await fetch("/api/auth/logout", { method: "POST" });
                } catch (e) {
                    console.error("Logout API failed:", e);
                }

                // Wait for the animation to play out (2.5s for snappy feel)
                await new Promise(resolve => setTimeout(resolve, 2500));

                // Clear user and reset shattered state
                set({ user: null, isShattered: false });
            },
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({ user: state.user }), // only persist user
        }
    )
);

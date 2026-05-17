"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="p-2 w-10 h-10" />;

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
                "p-3 rounded-2xl border border-border bg-background/50 backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-lg",
                "flex items-center justify-center group"
            )}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-45 transition-transform" />
            ) : (
                <Moon className="h-5 w-5 text-primary group-hover:-rotate-12 transition-transform" />
            )}
        </button>
    );
}

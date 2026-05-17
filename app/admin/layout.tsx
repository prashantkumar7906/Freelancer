"use client";

import React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Settings, LogOut, Briefcase, IndianRupee } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShatterContainer, Fragment } from "@/components/auth/shatter-container";
import { Cosmos } from "@/components/auth/cosmos";
import { AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);

    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Approvals", href: "/admin/approvals", icon: Users },
        { name: "Projects", href: "/admin/projects", icon: Briefcase },
        { name: "Transactions", href: "/admin/transactions", icon: IndianRupee },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    const handleLogout = async () => {
        await logout();
        router.push("/auth");
    };

    const isShattering = useAuthStore((state) => state.isShattered);

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-background">
            <AnimatePresence>
                {isShattering && <Cosmos />}
            </AnimatePresence>
            <div className="fixed inset-0 grid-tiling pointer-events-none opacity-[0.4] dark:opacity-[0.1]" />
            {/* Sidebar */}
            <Fragment delay={0.1}>
                <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-primary">FreelancePro</h1>
                        <p className="text-xs text-muted-foreground">Admin Portal</p>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </button>
                    </div>
                </aside>
            </Fragment>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative z-10">
                <Fragment delay={0.2}>
                    <header className="h-20 glass border-b border-border flex items-center justify-between px-8 transition-all duration-300">
                        <h2 className="text-lg font-semibold capitalize">
                            {pathname.split("/").pop() || "Dashboard"}
                        </h2>
                        <div className="flex items-center space-x-6">
                            <ThemeToggle />
                            <div className="flex items-center space-x-4">
                                <span className="text-sm font-medium">System Admin</span>
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    A
                                </div>
                            </div>
                        </div>
                    </header>
                </Fragment>

                <main className="flex-1 p-8 overflow-y-auto">
                    <ShatterContainer>
                        {children}
                    </ShatterContainer>
                </main>
            </div>
        </div>
    );
}

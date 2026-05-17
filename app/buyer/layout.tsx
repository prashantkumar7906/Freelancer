"use client";

import React from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Briefcase, Wallet, MessageSquare, LogOut, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShatterContainer, Fragment } from "@/components/auth/shatter-container";
import { Cosmos } from "@/components/auth/cosmos";
import { AnimatePresence } from "framer-motion";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);

    const navItems = [
        { name: "My Dashboard", href: "/buyer", icon: LayoutDashboard },
        { name: "Post Project", href: "/buyer/post-project", icon: PlusCircle },
        { name: "My Projects", href: "/buyer/projects", icon: Briefcase },
        { name: "My Wallet", href: "/buyer/wallet", icon: Wallet },
        { name: "Messages", href: "/buyer/messages", icon: MessageSquare },
    ];

    const handleLogout = async () => {
        await logout();
        router.push("/auth");
    };

    const [balance, setBalance] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (user?.id) {
            fetch(`/api/wallet/balance?userId=${user.id}`)
                .then(res => res.json())
                .then(data => setBalance(data.balance))
                .catch(err => console.error("Balance fetch failed", err));
        }
    }, [user?.id]);

    const isShattering = useAuthStore((state) => state.isShattered);

    return (
        <div className="flex min-h-screen relative overflow-hidden bg-background">
            <AnimatePresence>
                {isShattering && <Cosmos />}
            </AnimatePresence>
            <div className="fixed inset-0 grid-tiling pointer-events-none opacity-[0.4] dark:opacity-[0.1]" />
            {/* Sidebar */}
            <Fragment delay={0.1}>
                <aside className="w-64 bg-background border-r border-border hidden md:flex flex-col sticky top-0 h-screen">
                    <div className="p-6">
                        <Link href="/buyer">
                            <h1 className="text-2xl font-bold text-primary">FreelancePro</h1>
                        </Link>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Buyer Dashboard</p>
                    </div>

                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
                                    pathname === item.href
                                        ? "bg-primary text-white shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <div className="mb-4 px-4 py-3 bg-accent/10 rounded-xl border border-accent/20">
                            <p className="text-xs text-muted-foreground">Wallet Balance</p>
                            <p className="text-lg font-bold text-primary mt-1">
                                {balance !== null ? `₹${balance.toLocaleString("en-IN")}` : "Loading..."}
                            </p>
                        </div>
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
                    <header className="h-20 glass border-b border-border flex items-center justify-between px-8 sticky top-0 transition-all duration-300 z-50">
                        <h2 className="text-lg font-semibold text-foreground">
                            {navItems.find(item => item.href === pathname)?.name || "Dashboard"}
                        </h2>
                        <div className="flex items-center space-x-6">
                            <ThemeToggle />
                            <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full border-2 border-white dark:border-slate-800"></span>
                            </button>
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold">{user?.email.split('@')[0]}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{user?.role.toLowerCase()}</p>
                                </div>
                                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold ring-2 ring-primary/20">
                                    {user?.email[0].toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </header>
                </Fragment>

                <main className="flex-1 p-4 md:p-8">
                    <ShatterContainer>
                        {children}
                    </ShatterContainer>
                </main>
            </div>
        </div>
    );
}

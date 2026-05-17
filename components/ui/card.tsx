import * as React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { motion } from "framer-motion"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "glass" | "3d", hoverEffect?: boolean }
>(({ className, variant = "glass", hoverEffect = true, ...props }, ref) => {

    const baseStyles = "rounded-xl border shadow-sm transition-all duration-300 relative overflow-hidden"

    const variants = {
        default: "bg-card text-card-foreground",
        glass: "bg-white/5 backdrop-blur-md border-white/10 hover:border-white/20 text-foreground",
        "3d": "bg-card text-card-foreground transform-gpu perspective-1000",
    }

    const hoverStyles = hoverEffect ? "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10" : ""

    const Component = hoverEffect ? motion.div : "div"

    return (
        <Component
            ref={ref as any}
            className={cn(baseStyles, variants[variant] || variants.default, hoverStyles, className)}
            {...(hoverEffect ? { whileHover: { y: -5 } } : {})}
            {...(props as any)}
        />
    )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

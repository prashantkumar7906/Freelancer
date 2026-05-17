import * as React from "react"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "neon"
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant = "default", ...props }, ref) => {

        const variants = {
            default: "border-input bg-background/50",
            neon: "border-primary/50 bg-background/50 focus:border-primary focus:shadow-[0_0_10px_rgba(124,58,237,0.5)]"
        }

        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
                    variants[variant] || variants.default,
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }

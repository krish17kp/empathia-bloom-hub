import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-medium hover:scale-105 transition-bounce",
        secondary: "bg-gradient-secondary text-secondary-foreground hover:shadow-medium hover:scale-105 transition-bounce",
        tertiary: "bg-gradient-growth text-tertiary-foreground hover:shadow-medium hover:scale-105 transition-bounce",
        warm: "bg-gradient-warm text-warm-foreground hover:shadow-medium hover:scale-105 transition-bounce",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-medium",
        outline: "border-2 border-primary/20 bg-background/50 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-medium hover:border-primary",
        ghost: "text-primary hover:bg-primary/10 hover:text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-gradient-wellness text-white shadow-large hover:shadow-glow hover:scale-105 transition-bounce border border-white/20",
        card: "bg-card/80 backdrop-blur-sm border border-border/50 text-card-foreground hover:bg-card hover:shadow-medium hover:scale-105 transition-bounce",
        glow: "bg-gradient-primary text-primary-foreground shadow-glow hover:animate-glow-pulse hover:scale-105 transition-bounce",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base font-semibold",
        xl: "h-16 rounded-xl px-12 text-lg font-semibold",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

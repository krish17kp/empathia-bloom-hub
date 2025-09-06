import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  buttonText: string;
  variant?: "default" | "secondary" | "tertiary" | "warm";
  className?: string;
  onAction?: () => void;
}

export const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  variant = "default",
  className,
  onAction
}: FeatureCardProps) => {
  const gradientMap = {
    default: "bg-gradient-primary",
    secondary: "bg-gradient-secondary", 
    tertiary: "bg-gradient-growth",
    warm: "bg-gradient-warm"
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 shadow-soft hover:shadow-large transition-smooth animate-scale-in backdrop-blur-sm bg-card/80",
      className
    )}>
      <div className={cn("absolute inset-0 opacity-5", gradientMap[variant])} />
      
      <CardContent className="relative p-8 text-center">
        <div className={cn(
          "inline-flex h-16 w-16 items-center justify-center rounded-full mb-6 shadow-medium group-hover:shadow-glow transition-smooth",
          gradientMap[variant]
        )}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-4 text-foreground group-hover:gradient-text transition-smooth">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {description}
        </p>
        
        <Button 
          variant={variant} 
          size="lg" 
          className="w-full group-hover:scale-105"
          onClick={onAction}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
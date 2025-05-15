
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10"
  };

  return (
    <Loader 
      className={cn(
        "animate-spin text-muted-foreground",
        sizeClasses[size],
        className
      )} 
    />
  );
}

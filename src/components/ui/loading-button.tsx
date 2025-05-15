
import { Button, ButtonProps } from "@/components/ui/button";
import { LoadingSpinner } from "./loading-spinner";

interface LoadingButtonProps extends ButtonProps {
  isLoading: boolean;
  loadingText?: string;
}

export function LoadingButton({
  isLoading,
  loadingText,
  children,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <Button 
      disabled={isLoading || disabled} 
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" />
          {loadingText || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

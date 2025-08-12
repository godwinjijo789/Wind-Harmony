import * as React from "react";
import { cn } from "@/lib/utils";

interface InputOTPProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  maxLength: number;
  className?: string;
  containerClassName?: string;
}

const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  ({ value, onChange, onComplete, maxLength, className, containerClassName }, ref) => {
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
    
    const handleInputChange = (index: number, inputValue: string) => {
      // Only allow single digits
      const digit = inputValue.replace(/\D/g, '').slice(-1);
      
      const newValue = value.split('');
      newValue[index] = digit;
      
      // Fill any gaps with empty strings
      while (newValue.length < maxLength) {
        newValue.push('');
      }
      
      const finalValue = newValue.slice(0, maxLength).join('');
      onChange(finalValue);
      
      // Auto-focus next input
      if (digit && index < maxLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      
      // Call onComplete when all digits are filled
      if (finalValue.length === maxLength && onComplete) {
        onComplete();
      }
    };
    
    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      
      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      
      if (e.key === 'ArrowRight' && index < maxLength - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };
    
    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');
      const newValue = pastedData.slice(0, maxLength);
      onChange(newValue);
      
      if (newValue.length === maxLength && onComplete) {
        onComplete();
      }
    };
    
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", containerClassName)}
        onPaste={handlePaste}
      >
        {Array.from({ length: maxLength }, (_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={value[index] || ''}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "relative flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background text-center text-sm font-medium transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              "disabled:cursor-not-allowed disabled:opacity-50",
              value[index] && "border-primary",
              className
            )}
            autoComplete="off"
          />
        ))}
      </div>
    );
  }
);

InputOTP.displayName = "InputOTP";

// Legacy component wrappers for compatibility
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 items-center justify-center rounded-md border border-input text-sm transition-all",
      className,
    )}
    {...props}
  />
));
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };

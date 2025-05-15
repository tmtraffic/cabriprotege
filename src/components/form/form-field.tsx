
import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormInputFieldProps {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function FormInputField({
  name,
  label,
  description,
  className,
  disabled,
  children
}: FormInputFieldProps) {
  const { control } = useFormContext();
  
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel htmlFor={name}>{label}</FormLabel>}
          <FormControl>
            {React.cloneElement(children as React.ReactElement, { 
              id: name,
              ...field,
              disabled: disabled || field.disabled
            })}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

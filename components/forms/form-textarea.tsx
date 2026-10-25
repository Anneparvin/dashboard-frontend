// components/forms/form-textarea.tsx
"use client";

import { ComponentProps, forwardRef, useId } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormTextareaProps = Omit<ComponentProps<"textarea">, "ref"> & {
  label: string;
  error?: string;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(function FormTextarea(
  { label, error, id, ...props },
  ref
) {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <div className="space-y-2">
      <Label htmlFor={textareaId}>{label}</Label>
      <Textarea
        id={textareaId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${textareaId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${textareaId}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
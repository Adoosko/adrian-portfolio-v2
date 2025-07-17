// components/contact/FormField.tsx
'use client';

import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { memo, useCallback, useMemo } from 'react';
import { type FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  register: any;
  error?: FieldError;
  value?: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  isSubmitting: boolean;
}

export const FormField = memo<FormFieldProps>(({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  register, 
  error, 
  value, 
  focusedField, 
  setFocusedField, 
  isSubmitting 
}) => {
  const isFocused = focusedField === name;
  const hasValue = Boolean(value?.length);
  const hasError = Boolean(error);

  const handleFocus = useCallback(() => {
    setFocusedField(name);
  }, [name, setFocusedField]);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, [setFocusedField]);

  const inputClasses = useMemo(() => 
    `pt-6 pb-2 px-3 bg-transparent border-border focus:border-foreground transition-all duration-300 ${
      hasError ? 'border-destructive focus:border-destructive' : ''
    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`,
    [hasError, isSubmitting]
  );

  return (
    <m.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <m.label
        htmlFor={name}
        className={`absolute left-3 transition-all duration-300 pointer-events-none ${
          isFocused || hasValue 
            ? 'top-2 text-xs text-muted-foreground' 
            : 'top-4 text-sm text-muted-foreground'
        }`}
        animate={{
          y: isFocused || hasValue ? -8 : 0,
          scale: isFocused || hasValue ? 0.9 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </m.label>

      <Input
        {...register(name)}
        type={type}
        id={name}
        placeholder={isFocused ? placeholder : ''}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={isSubmitting}
        className={inputClasses}
        aria-describedby={hasError ? `${name}-error` : undefined}
        aria-invalid={hasError}
      />

      <AnimatePresence>
        {error && (
          <m.div
            id={`${name}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 mt-2 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle size={14} />
            <span>{error.message}</span>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
});

FormField.displayName = 'FormField';

// components/contact/MessageField.tsx
'use client';

import { Textarea } from '@/components/ui/textarea';
import { AlertCircle } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { memo, useCallback, useMemo } from 'react';
import { type FieldError } from 'react-hook-form';

interface MessageFieldProps {
  label: string;
  placeholder: string;
  register: any;
  error?: FieldError;
  value?: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  isSubmitting: boolean;
  maxLength?: number;
}

export const MessageField = memo<MessageFieldProps>(({ 
  label, 
  placeholder, 
  register, 
  error, 
  value, 
  focusedField, 
  setFocusedField, 
  isSubmitting,
  maxLength = 1000
}) => {
  const isFocused = focusedField === 'message';
  const hasValue = Boolean(value?.length);
  const hasError = Boolean(error);
  const charCount = value?.length || 0;

  const handleFocus = useCallback(() => {
    setFocusedField('message');
  }, [setFocusedField]);

  const handleBlur = useCallback(() => {
    setFocusedField(null);
  }, [setFocusedField]);

  const textareaClasses = useMemo(() => 
    `pt-8 pb-3 px-3 bg-transparent border-border resize-none focus:border-foreground transition-all duration-300 ${
      hasError ? 'border-destructive focus:border-destructive' : ''
    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`,
    [hasError, isSubmitting]
  );

  return (
    <m.div
      className="relative"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      <m.label
        htmlFor="message"
        className={`absolute left-3 transition-all duration-300 pointer-events-none z-10 ${
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

      <div className="relative">
        <Textarea
          {...register('message')}
          id="message"
          rows={6}
          placeholder={isFocused ? placeholder : ''}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isSubmitting}
          className={textareaClasses}
          aria-describedby={hasError ? 'message-error' : undefined}
          aria-invalid={hasError}
          maxLength={maxLength}
        />

        <m.div
          className="absolute bottom-0 left-0 h-0.5 bg-foreground"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <m.div
          className="absolute bottom-2 right-3 text-xs text-muted-foreground"
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          aria-live="polite"
        >
          {charCount}/{maxLength}
        </m.div>
      </div>

      <AnimatePresence>
        {error && (
          <m.div
            id="message-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 mt-2 text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle size={14} />
            <span>{error.message}</span>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
});

MessageField.displayName = 'MessageField';

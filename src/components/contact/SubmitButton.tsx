// components/contact/SubmitButton.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Check, Send } from 'lucide-react';
import { AnimatePresence, m } from 'motion/react';
import { memo, useMemo } from 'react';

interface SubmitButtonProps {
  isSubmitting: boolean;
  isSuccess: boolean;
  sendButton: string;
  sendingButton: string;
  sentButton: string;
}

export const SubmitButton = memo<SubmitButtonProps>(({ 
  isSubmitting, 
  isSuccess, 
  sendButton, 
  sendingButton, 
  sentButton 
}) => {
  const buttonContent = useMemo(() => {
    if (isSuccess) {
      return (
        <m.div
          key="success"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-2"
        >
          <Check size={16} />
          <span>{sentButton}</span>
        </m.div>
      );
    }

    if (isSubmitting) {
      return (
        <m.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-2"
        >
          <m.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border border-current border-t-transparent rounded-full"
          />
          <span>{sendingButton}</span>
        </m.div>
      );
    }

    return (
      <m.div
        key="default"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-2"
      >
        <Send size={16} />
        <span>{sendButton}</span>
      </m.div>
    );
  }, [isSubmitting, isSuccess, sendButton, sendingButton, sentButton]);

  return (
    <m.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        type="submit"
        disabled={isSubmitting || isSuccess}
        size="lg"
        className="font-mono px-8 py-3 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {buttonContent}
        </AnimatePresence>
      </Button>
    </m.div>
  );
});

SubmitButton.displayName = 'SubmitButton';

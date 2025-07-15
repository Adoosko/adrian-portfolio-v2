//@ts-nocheck
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormStore } from '@/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  motion,
  useInView,
  type Variants
} from 'framer-motion';
import { AlertCircle, Check, Send } from 'lucide-react';
import {
  memo,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm, type FieldError } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// Optimalizované typy
interface ContactProps {
  data: {
    title: string;
    description: string;
    name: string;
    name_placeholder: string;
    email: string;
    email_placeholder: string;
    message: string;
    message_placeholder: string;
    send_button: string;
    sending_button: string;
    validation: {
      name_required: string;
      email_invalid: string;
      message_required: string;
    };
    sent_button: string;
    toast_success: string;
    toast_error: string;
  };
}

// Konstanty pre optimalizáciu
const EASING_SMOOTH = [0.25, 0.46, 0.45, 0.94] as const;
const EASING_DRAMATIC = [0.22, 1, 0.36, 1] as const;

const SUCCESS_TIMEOUT = 3000;
const VALIDATION_DEBOUNCE = 300;

// Optimalizované schema factory
const createContactSchema = (validation: ContactProps['data']['validation']) => 
  z.object({
    name: z.string().min(2, validation.name_required).max(50),
    email: z.string().email(validation.email_invalid).max(100),
    message: z.string().min(10, validation.message_required).max(1000),
  });

// Optimalizované variants
const createContainerVariants = (): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
});

const createItemVariants = (): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASING_SMOOTH,
    },
  },
});

// Optimalizovaný FormField komponent
const FormField = memo<{
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
}>(({ 
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

  // Memoizované styles
  const labelClasses = useMemo(() => 
    `absolute left-3 transition-all duration-300 pointer-events-none ${
      isFocused || hasValue 
        ? 'top-2 text-xs text-muted-foreground' 
        : 'top-4 text-sm text-muted-foreground'
    }`, [isFocused, hasValue]
  );

  const inputClasses = useMemo(() => 
    `pt-6 pb-2 px-3 bg-transparent border-border focus:border-foreground transition-all duration-300 ${
      hasError ? 'border-destructive focus:border-destructive' : ''
    } ${
      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
    }`, [hasError, isSubmitting]
  );

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Floating Label */}
      <motion.label
        htmlFor={name}
        className={labelClasses}
        animate={{
          y: isFocused || hasValue ? -8 : 0,
          scale: isFocused || hasValue ? 0.9 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.label>

      {/* Input Field */}
      <motion.div className="relative">
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

        {/* Focus indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-foreground"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            id={`${name}-error`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 mt-2 text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            <AlertCircle size={14} />
            <span>{error.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

FormField.displayName = 'FormField';

// Optimalizovaný MessageField komponent
const MessageField = memo<{
  label: string;
  placeholder: string;
  register: any;
  error?: FieldError;
  value?: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  isSubmitting: boolean;
}>(({ 
  label, 
  placeholder, 
  register, 
  error, 
  value, 
  focusedField, 
  setFocusedField, 
  isSubmitting 
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
    } ${
      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
    }`, [hasError, isSubmitting]
  );

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      {/* Floating Label */}
      <motion.label
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
      </motion.label>

      {/* Textarea Field */}
      <motion.div className="relative">
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
          maxLength={1000}
        />

        {/* Focus indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-foreground"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Character counter */}
        <motion.div
          className="absolute bottom-2 right-3 text-xs text-muted-foreground"
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          aria-live="polite"
        >
          {charCount}/1000
        </motion.div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

MessageField.displayName = 'MessageField';

// Optimalizovaný SubmitButton komponent
const SubmitButton = memo<{
  isSubmitting: boolean;
  isSuccess: boolean;
  sendButton: string;
  sendingButton: string;
  sentButton: string;
}>(({ isSubmitting, isSuccess, sendButton, sendingButton, sentButton }) => {
  const buttonContent = useMemo(() => {
    if (isSuccess) {
      return (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center space-x-2"
        >
          <Check size={16} />
          <span>{sentButton}</span>
        </motion.div>
      );
    }

    if (isSubmitting) {
      return (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center space-x-2"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border border-current border-t-transparent rounded-full"
          />
          <span>{sendingButton}</span>
        </motion.div>
      );
    }

    return (
      <motion.div
        key="default"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="flex items-center space-x-2"
      >
        <Send size={16} />
        <span>{sendButton}</span>
      </motion.div>
    );
  }, [isSubmitting, isSuccess, sendButton, sendingButton, sentButton]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        type="submit"
        disabled={isSubmitting || isSuccess}
        size="lg"
        className="font-mono px-8 py-3 relative overflow-hidden bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        aria-label={isSubmitting ? sendingButton : isSuccess ? sentButton : sendButton}
      >
        <AnimatePresence mode="wait">
          {buttonContent}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
});

SubmitButton.displayName = 'SubmitButton';

// Hlavný Contact komponent s brutal optimalizáciami
const Contact = memo<ContactProps>(({ data }) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    isSubmitting,
    setIsSubmitting,
    contactForm,
    setContactForm,
    resetContactForm,
    setToast,
    toast: formToast,
  } = useFormStore();

  // Memoizované schema
  const contactSchema = useMemo(() => 
    createContactSchema(data.validation), [data.validation]
  );

  type ContactForm = z.infer<typeof contactSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactForm,
    mode: 'onChange', // Real-time validation
  });

  const watchedValues = watch();

  // Optimalizovaný submit handler
  const onSubmit = useCallback(async (formData: ContactForm) => {
    setIsSubmitting(true);
    setContactForm(formData);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        resetContactForm();
        toast.success(data.toast_success);
      } else {
        toast.error(data.toast_error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(data.toast_error);
    } finally {
      setIsSubmitting(false);
      
      // Auto-hide success state
      if (isSuccess) {
        setTimeout(() => {
          startTransition(() => {
            setIsSuccess(false);
          });
        }, SUCCESS_TIMEOUT);
      }
    }
  }, [setIsSubmitting, setContactForm, reset, resetContactForm, data.toast_success, data.toast_error, isSuccess]);

  // Cleanup toast effects
  useEffect(() => {
    if (formToast) {
      if (formToast.type === 'success') {
        toast.success(formToast.message);
      } else if (formToast.type === 'error') {
        toast.error(formToast.message);
      }
      setToast(null);
    }
  }, [formToast, setToast]);

  // Memoizované variants
  const containerVariants = useMemo(() => createContainerVariants(), []);
  const itemVariants = useMemo(() => createItemVariants(), []);

  return (
    <LazyMotion features={domAnimation}>
      <section 
        id="contact" 
        ref={ref}
        className="py-20 px-6 lg:px-20 overflow-hidden"
        aria-labelledby="contact-heading"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            {/* Section Header */}
            <motion.div
              variants={itemVariants}
              className="mb-16 text-center"
            >
              <div className="flex items-center justify-center space-x-6 mb-8">
                <motion.div 
                  className="flex-1 h-px bg-border"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                
                <div className="flex items-center space-x-4">
                  <motion.span 
                    className="font-mono text-sm text-muted-foreground"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    03
                  </motion.span>
                  <h2 
                    id="contact-heading"
                    className="text-2xl lg:text-3xl font-light text-foreground whitespace-nowrap tracking-tight"
                  >
                    {data.title}
                  </h2>
                </div>
                
                <motion.div 
                  className="flex-1 h-px bg-border"
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>

              <motion.p
                variants={itemVariants}
                className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              >
                {data.description}
              </motion.p>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-8"
                noValidate
              >
                {/* Form Fields Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    label={data.name}
                    name="name"
                    placeholder={data.name_placeholder}
                    register={register}
                    error={errors.name}
                    value={watchedValues.name}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                    isSubmitting={isSubmitting}
                  />

                  <FormField
                    label={data.email}
                    name="email"
                    type="email"
                    placeholder={data.email_placeholder}
                    register={register}
                    error={errors.email}
                    value={watchedValues.email}
                    focusedField={focusedField}
                    setFocusedField={setFocusedField}
                    isSubmitting={isSubmitting}
                  />
                </div>

                <MessageField
                  label={data.message}
                  placeholder={data.message_placeholder}
                  register={register}
                  error={errors.message}
                  value={watchedValues.message}
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  isSubmitting={isSubmitting}
                />

                {/* Submit Button */}
                <div className="text-center pt-4">
                  <SubmitButton
                    isSubmitting={isSubmitting}
                    isSuccess={isSuccess}
                    sendButton={data.send_button}
                    sendingButton={data.sending_button}
                    sentButton={data.sent_button}
                  />
                </div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </LazyMotion>
  );
});

Contact.displayName = 'Contact';

export default Contact;

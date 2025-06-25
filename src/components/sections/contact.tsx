"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFormStore } from "@/stores/form-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { AlertCircle, Check, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
  };
}

// Professional easing functions
const customEasing = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  dramatic: [0.22, 1, 0.36, 1],
  gentle: [0.4, 0, 0.2, 1],
};

export function Contact({ data }: ContactProps) {
  const contactSchema = z.object({
    name: z.string().min(2, data.validation.name_required),
    email: z.string().email(data.validation.email_invalid),
    message: z.string().min(10, data.validation.message_required),
  });

  type ContactForm = z.infer<typeof contactSchema>;

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    isSubmitting,
    setIsSubmitting,
    contactForm,
    setContactForm,
    resetContactForm,
  } = useFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactForm,
  });

  // Watch form values for real-time validation
  const watchedValues = watch();

  const onSubmit = async (formData: ContactForm) => {
    setIsSubmitting(true);
    setContactForm(formData);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form data:", formData);

    setIsSuccess(true);
    reset();
    resetContactForm();
    setIsSubmitting(false);

    // Reset success state after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  // Container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Item variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: customEasing.smooth,
      },
    },
  };

  return (
    <section id="contact" className="py-20 px-6 lg:px-20 overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Minimalistic Section Header */}
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
                    ease: "easeInOut",
                  }}
                >
                  03
                </motion.span>
                <h2 className="text-2xl lg:text-3xl font-light text-foreground whitespace-nowrap tracking-tight">
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

          {/* Enhanced Contact Form */}
          <motion.div
            variants={itemVariants}
            className="relative"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Form Fields Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Name Field */}
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

                {/* Email Field */}
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

              {/* Message Field */}
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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting || isSuccess}
                    size="lg"
                    className="
                      font-mono px-8 py-3 relative overflow-hidden
                      bg-foreground text-background
                      hover:bg-foreground/90
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-all duration-300
                    "
                  >
                    <AnimatePresence mode="wait">
                      {isSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center space-x-2"
                        >
                          <Check size={16} />
                          <span>Sent!</span>
                        </motion.div>
                      ) : isSubmitting ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center space-x-2"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border border-current border-t-transparent rounded-full"
                          />
                          <span>{data.sending_button}</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center space-x-2"
                        >
                          <Send size={16} />
                          <span>{data.send_button}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Enhanced Form Field Component
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  register: any;
  error?: any;
  value?: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  isSubmitting: boolean;
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  register,
  error,
  value,
  focusedField,
  setFocusedField,
  isSubmitting,
}: FormFieldProps) {
  const isFocused = focusedField === name;
  const hasValue = value && value.length > 0;
  const hasError = !!error;

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Floating Label */}
      <motion.label
        htmlFor={name}
        className={`
          absolute left-3 transition-all duration-300 pointer-events-none
          ${isFocused || hasValue 
            ? 'top-2 text-xs text-muted-foreground' 
            : 'top-4 text-sm text-muted-foreground'
          }
        `}
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
          placeholder={isFocused ? placeholder : ""}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField(null)}
          disabled={isSubmitting}
          className={`
            pt-6 pb-2 px-3 bg-transparent border-border
            focus:border-foreground transition-all duration-300
            ${hasError ? 'border-destructive focus:border-destructive' : ''}
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 mt-2 text-sm text-destructive"
          >
            <AlertCircle size={14} />
            <span>{error.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Enhanced Message Field Component
interface MessageFieldProps {
  label: string;
  placeholder: string;
  register: any;
  error?: any;
  value?: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  isSubmitting: boolean;
}

function MessageField({
  label,
  placeholder,
  register,
  error,
  value,
  focusedField,
  setFocusedField,
  isSubmitting,
}: MessageFieldProps) {
  const isFocused = focusedField === "message";
  const hasValue = value && value.length > 0;
  const hasError = !!error;

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.2 }}
    >
      {/* Floating Label */}
      <motion.label
        htmlFor="message"
        className={`
          absolute left-3 transition-all duration-300 pointer-events-none z-10
          ${isFocused || hasValue 
            ? 'top-2 text-xs text-muted-foreground' 
            : 'top-4 text-sm text-muted-foreground'
          }
        `}
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
          {...register("message")}
          id="message"
          rows={6}
          placeholder={isFocused ? placeholder : ""}
          onFocus={() => setFocusedField("message")}
          onBlur={() => setFocusedField(null)}
          disabled={isSubmitting}
          className={`
            pt-8 pb-3 px-3 bg-transparent border-border resize-none
            focus:border-foreground transition-all duration-300
            ${hasError ? 'border-destructive focus:border-destructive' : ''}
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
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
        >
          {value?.length || 0}
        </motion.div>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {hasError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 mt-2 text-sm text-destructive"
          >
            <AlertCircle size={14} />
            <span>{error.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

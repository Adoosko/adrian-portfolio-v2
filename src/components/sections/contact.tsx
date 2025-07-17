// components/contact/Contact.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LazyMotion, domAnimation, m, useInView } from 'motion/react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormField } from '../contact/FormField';
import { ContactProps } from '../contact/types';

import { MessageField } from '../contact/MessageField';
import { SubmitButton } from '../contact/SubmitButton';





const createContactSchema = (validation: ContactProps['data']['validation']) => 
  z.object({
    name: z.string().min(2, validation.name_required),
    email: z.string().email(validation.email_invalid),
    message: z.string().min(10, validation.message_required),
  });

const Contact = memo<ContactProps>(({ data }) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    mode: 'onChange',
  });

  const watchedValues = watch();

  const onSubmit = useCallback(async (formData: ContactForm) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
        toast.success(data.toast_success);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        toast.error(data.toast_error);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(data.toast_error);
    } finally {
      setIsSubmitting(false);
    }
  }, [reset, data.toast_success, data.toast_error]);

  return (
    <LazyMotion features={domAnimation}>
      <section id="contact" ref={ref} className="py-20 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-light mb-4">{data.title}</h2>
              <p className="text-muted-foreground">{data.description}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
});

Contact.displayName = 'Contact';
export default Contact;

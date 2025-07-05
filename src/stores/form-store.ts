import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FormState {
  // Loading states
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;

  // Contact form data
  contactForm: {
    name: string;
    email: string;
    message: string;
  };
  setContactForm: (data: Partial<FormState["contactForm"]>) => void;
  resetContactForm: () => void;

  // UI states
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Theme preference (backup to next-themes)
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Toast state
  toast: {
    message: string;
    type: "success" | "error" | "info";
  } | null;
  setToast: (toast: FormState["toast"]) => void;
}

export const useFormStore = create(
  persist<FormState, [], [], Pick<FormState, "contactForm" | "isDarkMode">>(
    (set) => ({
      // Loading states
      isSubmitting: false,
      setIsSubmitting: (submitting) => set({ isSubmitting: submitting }),

      // Contact form
      contactForm: {
        name: "",
        email: "",
        message: "",
      },
      setContactForm: (data) =>
        set((state) => ({
          contactForm: { ...state.contactForm, ...data },
        })),
      resetContactForm: () =>
        set({
          contactForm: {
            name: "",
            email: "",
            message: "",
          },
        }),

      // UI states
      activeSection: "",
      setActiveSection: (section) => set({ activeSection: section }),

      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Toast
      toast: null,
      setToast: (toast) => set({ toast }),
    }),
    {
      name: "portfolio-storage",
      partialize: (state) => ({
        contactForm: state.contactForm,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

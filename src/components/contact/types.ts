// components/contact/types.ts
export interface ContactFormData {
    name: string;
    email: string;
    message: string;
  }
  
  export interface ContactProps {
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
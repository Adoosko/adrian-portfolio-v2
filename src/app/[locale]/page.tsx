// src/app/[locale]/page.tsx
import ClientOnly from "@/components/ClientOnly";
import Footer from "@/components/layout/footer";
import Navigation from "@/components/layout/navigation";
import About from "@/components/sections/about";
import Contact from "@/components/sections/contact";
import Hero from "@/components/sections/hero";

import Work from "@/components/sections/work";

// SSR: Zakázať static generation
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// SSR message loader
async function getMessages(locale: string) {
  try {
    const messages = await import(`../../../messages/${locale}.json`);
    return messages.default;
  } catch {
    const fallback = await import('../../../messages/en.json');
    return fallback.default;
  }
}

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // SSR: Načítanie messages pri každom requeste
  const messages = await getMessages(locale);
  
  // Optimalizované data objekty - iba texty, nie obrázky
  const heroData = {
    greeting: messages.Hero.greeting,
    title: messages.Hero.title,
    subtitle: messages.Hero.subtitle,
    description: messages.Hero.description,
    ctaText: messages.Hero.ctaText,
    cta2Text: messages.Hero.cta2Text,
  };

  const aboutData = {
    title: messages.About.title,
    description: messages.About.description,
    technologies: messages.About.technologies,
    tech_list_intro: messages.About.tech_list_intro,
  };

  const navigationData = {
    about: messages.Navigation.about,
    work: messages.Navigation.work,
    contact: messages.Navigation.contact,
    resume: messages.Navigation.resume,
    download_resume: messages.Navigation.download_resume,
  };

  const workData = {
    title: messages.Work.title,
    featured: messages.Work.featured,
    no_projects: messages.Work.no_projects,
    projects: messages.Work.projects,
  };

  const contactData = {
    title: messages.Contact.title,
    description: messages.Contact.description,
    name: messages.Contact.name,
    name_placeholder: messages.Contact.name_placeholder,
    email: messages.Contact.email,
    email_placeholder: messages.Contact.email_placeholder,
    message: messages.Contact.message,
    message_placeholder: messages.Contact.message_placeholder,
    send_button: messages.Contact.send_button,
    sending_button: messages.Contact.sending_button,
    sent_button: messages.Contact.sent_button,
    toast_success: messages.Contact.toast_success,
    toast_error: messages.Contact.toast_error,
    validation: messages.Contact.validation,
  };

  const footerData = {
    description: messages.Footer.description,
    navigation: messages.Footer.navigation,
    connect: messages.Footer.connect,
    rights_reserved: messages.Footer.rights_reserved,
    built_with: messages.Footer.built_with,
    back_to_top: messages.Footer.back_to_top,
  };

  return (
    <main className="relative">
      {/* Všetky komponenty sa renderujú server-side */}
      <Navigation data={navigationData} />
     <Hero data={heroData}></Hero>
      <About data={aboutData} />
      <Work data={workData} />
      <ClientOnly>
        <Contact data={contactData} />
      </ClientOnly>
      <Footer data={footerData} nav={navigationData} />
    </main>
  );
}

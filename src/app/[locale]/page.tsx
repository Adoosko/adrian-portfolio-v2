import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { getLocale, getMessages } from "next-intl/server";

export default async function HomePage() {
  const locale = await getLocale();
  const messages = await getMessages();

  // ✅ Konzistentný prístup cez messages objekt
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
    validation: messages.Contact.validation,
  };

  const navigationData = {
    about: messages.Navigation.about,
    work: messages.Navigation.work,
    contact: messages.Navigation.contact,
    resume: messages.Navigation.resume,
    download_resume: messages.Navigation.download_resume,
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
    <main>
      <Navigation data={navigationData} />
      <Hero data={heroData} />
      <About data={aboutData} />
      <Work data={workData} />
      <Contact data={contactData} />
      <Footer data={footerData} nav={navigationData} />
    </main>
  );
}

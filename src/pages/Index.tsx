import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import FearlessDesign from "@/components/FearlessDesign";
import PromoSection from "@/components/PromoSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import { useSEOSettings } from "@/hooks/useSEOSettings";
const Index = () => {
  const seoSettings = useSEOSettings('/');

  // Organization schema for the entire site
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Yakuza EV",
    "url": "https://yakuzaev.vercel.app",
    "logo": "https://yakuzaev.vercel.app/assets/logo.svg",
    "description": "Leading electric scooter manufacturer providing innovative and sustainable mobility solutions",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "India"
    },
    "sameAs": ["https://linkedin.com", "https://twitter.com", "https://youtube.com", "https://facebook.com", "https://instagram.com"],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  };

  // WebSite schema with search action
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Yakuza EV",
    "url": "https://yakuzaev.vercel.app",
    "description": "Leading electric scooter manufacturer providing innovative and sustainable mobility solutions",
    "publisher": {
      "@type": "Organization",
      "name": "Yakuza EV"
    }
  };
  return <div className="min-h-screen bg-background">
      <Helmet>
        {seoSettings?.meta_title && <title>{seoSettings.meta_title}</title>}
        {seoSettings?.meta_description && <meta name="description" content={seoSettings.meta_description} />}
        {seoSettings?.meta_keywords && <meta name="keywords" content={seoSettings.meta_keywords} />}
        {seoSettings?.og_title && <meta property="og:title" content={seoSettings.og_title} />}
        {seoSettings?.og_description && <meta property="og:description" content={seoSettings.og_description} />}
        {seoSettings?.og_image && <meta property="og:image" content={seoSettings.og_image} className="my-[2px]" />}
        {seoSettings?.canonical_url && <link rel="canonical" href={seoSettings.canonical_url} />}
      </Helmet>
      
      {/* Organization Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(organizationSchema)
    }} />
      
      {/* WebSite Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify(websiteSchema)
    }} />
      
      <Header />
      <Hero />
      <ProductShowcase />
      <FearlessDesign />
      <PromoSection className="px-[20px]" />
      <BlogSection />
      <Footer />
    </div>;
};
export default Index;
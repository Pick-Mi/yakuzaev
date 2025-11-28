import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import FearlessDesign from '@/components/FearlessDesign';
import PromoSection from '@/components/PromoSection';
import BlogSection from '@/components/BlogSection';
import Footer from '@/components/Footer';

// Generate metadata server-side
export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  
  try {
    const { data: seoSettings } = await supabase
      .from('page_seo_settings')
      .select('*')
      .eq('page_route', '/')
      .eq('is_active', true)
      .single();

    if (seoSettings) {
      return {
        title: seoSettings.meta_title || 'Yakuza EV',
        description: seoSettings.meta_description || 'Experience the Next Generation of Riding',
        keywords: seoSettings.meta_keywords || '',
        openGraph: {
          title: seoSettings.og_title || seoSettings.meta_title || 'Yakuza EV',
          description: seoSettings.og_description || seoSettings.meta_description || '',
          images: seoSettings.og_image ? [seoSettings.og_image] : [],
        },
        alternates: {
          canonical: seoSettings.canonical_url || 'https://yakuzaev.lovable.app/',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching SEO settings:', error);
  }

  // Fallback metadata
  return {
    title: 'Yakuza EV - Experience the Next Generation of Riding',
    description: 'Experience personalized shopping with AI-powered product recommendations. Discover curated products tailored to your preferences.',
  };
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductShowcase />
      <FearlessDesign />
      <PromoSection />
      <BlogSection />
      <Footer />
    </div>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ProductShowcase from '@/components/ProductShowcase';
import FeaturesAndBenefitsSection from '@/components/FeaturesAndBenefitsSection';
import ColorVarietySection from '@/components/ColorVarietySection';
import DesignSection from '@/components/DesignSection';
import ThrillsSection from '@/components/ThrillsSection';
import BlogSection from '@/components/BlogSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Neu - Electric Scooters | Future of Urban Mobility',
  description: 'Discover the future of urban mobility with Neu electric scooters. Premium design, exceptional performance, and sustainable transportation.',
  keywords: 'electric scooter, urban mobility, sustainable transport, neu scooters',
  openGraph: {
    title: 'Neu - Electric Scooters',
    description: 'Discover the future of urban mobility',
    type: 'website',
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProductShowcase />
        <FeaturesAndBenefitsSection />
        <ColorVarietySection />
        <DesignSection />
        <ThrillsSection />
        <BlogSection />
      </main>
      <Footer />
    </>
  );
}

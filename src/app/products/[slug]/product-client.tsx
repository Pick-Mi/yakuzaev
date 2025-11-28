'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ProductHero from '@/components/ProductHero';
import ProductFeatures from '@/components/ProductFeatures';
import VariantsPricingSection from '@/components/VariantsPricingSection';
import FeaturesAndBenefitsSection from '@/components/FeaturesAndBenefitsSection';
import ColorVarietySection from '@/components/ColorVarietySection';
import DesignSection from '@/components/DesignSection';
import FAQSection from '@/components/FAQSection';
import AccessoriesSection from '@/components/AccessoriesSection';
import ProductPromoSection from '@/components/ProductPromoSection';

interface ProductClientProps {
  slug: string;
  initialProduct: any;
}

export default function ProductClient({ slug, initialProduct }: ProductClientProps) {
  const [product, setProduct] = useState(initialProduct);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (!initialProduct) {
      router.push('/products');
    }
  }, [initialProduct, router]);

  if (!product) return null;

  return (
    <>
      <ProductHero product={product} />
      <ProductFeatures product={product} />
      <VariantsPricingSection product={product} />
      <FeaturesAndBenefitsSection />
      <ColorVarietySection product={product} />
      <DesignSection product={product} />
      <FAQSection product={product} />
      <AccessoriesSection product={product} />
      <ProductPromoSection product={product} />
    </>
  );
}

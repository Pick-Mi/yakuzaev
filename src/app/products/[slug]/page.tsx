import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductClient from './product-client';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.meta_title || `${product.name} - Neu Electric Scooters`,
    description: product.meta_description || product.description,
    keywords: product.meta_keywords,
    openGraph: {
      title: product.og_title || product.name,
      description: product.og_description || product.description,
      images: product.og_image ? [product.og_image] : undefined,
      type: 'website',
    },
    alternates: {
      canonical: product.canonical_url || `https://yourdomain.com/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (!product) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <ProductClient slug={slug} initialProduct={product} />
      </main>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  const supabase = await createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('slug')
    .eq('is_active', true);

  return (products || []).map((product) => ({
    slug: product.slug,
  }));
}

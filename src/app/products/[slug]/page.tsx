import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
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

  // This page demonstrates SSR for metadata/SEO only
  // Full product page implementation requires migrating Product.tsx component
  // See NEXTJS_MIGRATION.md for details
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg mb-4">₹{product.price.toLocaleString('en-IN')}</p>
        <p className="text-muted-foreground mb-6">
          Product page component migration in progress
        </p>
        <p className="text-sm text-muted-foreground">
          See NEXTJS_MIGRATION.md for full migration steps
        </p>
      </div>
    </div>
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

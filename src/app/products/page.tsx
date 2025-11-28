import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsGrid from '@/components/ProductsGrid';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Neu Electric Scooters',
  description: 'Browse our collection of premium electric scooters',
};

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main>
        <ProductsGrid />
      </main>
      <Footer />
    </>
  );
}

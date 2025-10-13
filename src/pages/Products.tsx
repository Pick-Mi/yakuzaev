import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";

const Products = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductsGrid />
      <Footer />
    </div>
  );
};


export default Products;
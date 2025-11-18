import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProductsGrid from "@/components/ProductsGrid";
import { useSchemaMarkup } from "@/hooks/useSchemaMarkup";

const Products = () => {
  const schemaMarkup = useSchemaMarkup('/products');

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        {schemaMarkup && (
          <script type="application/ld+json">
            {JSON.stringify(schemaMarkup, null, 2)}
          </script>
        )}
      </Helmet>
      <Header />
      <Hero />
      <ProductsGrid />
      <Footer />
    </div>
  );
};


export default Products;
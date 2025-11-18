import { Helmet } from "react-helmet";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import FearlessDesign from "@/components/FearlessDesign";
import PromoSection from "@/components/PromoSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";
import { useSchemaMarkup } from "@/hooks/useSchemaMarkup";

const Index = () => {
  const schemaMarkup = useSchemaMarkup('/');

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
      <ProductShowcase />
      <FearlessDesign />
      <PromoSection />
      <BlogSection />
      <Footer />
    </div>
  );
};

export default Index;

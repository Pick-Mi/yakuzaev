import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import FearlessDesign from "@/components/FearlessDesign";
import PromoSection from "@/components/PromoSection";
import BlogSection from "@/components/BlogSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div className="space-y-[75px]">
        <ProductShowcase />
        <FearlessDesign />
        <PromoSection />
        <BlogSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;

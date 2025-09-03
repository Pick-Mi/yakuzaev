import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import AIRecommendations from "@/components/AIRecommendations";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ProductShowcase />
      <AIRecommendations />
    </div>
  );
};

export default Index;

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductShowcase from "@/components/ProductShowcase";
import ScooterPromo from "@/components/ScooterPromo";
import FearlessDesign from "@/components/FearlessDesign";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <ProductShowcase />
      <FearlessDesign />
      <ScooterPromo />
    </div>
  );
};

export default Index;

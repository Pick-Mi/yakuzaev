import { Button } from "@/components/ui/button";
import { Sparkles, Zap, Target } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-subtle py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-ai opacity-5"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* AI Badge */}
          <div className="inline-flex items-center gap-2 bg-accent rounded-full px-4 py-2 mb-8 animate-scale-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-accent-foreground">Powered by AI</span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Discover Products
            <span className="block text-transparent bg-gradient-ai bg-clip-text">
              Tailored for You
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Our AI analyzes your preferences to showcase products you'll love. 
            Experience personalized shopping like never before.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button variant="hero" size="lg" className="group">
              Explore Products
              <Zap className="w-4 h-4 group-hover:animate-pulse" />
            </Button>
            <Button variant="ai" size="lg">
              <Target className="w-4 h-4" />
              Get Recommendations
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">10K+</div>
              <div className="text-sm text-muted-foreground">Products Curated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">95%</div>
              <div className="text-sm text-muted-foreground">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Smart Discovery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
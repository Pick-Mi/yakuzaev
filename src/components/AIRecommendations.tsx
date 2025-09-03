import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Users, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Smart Learning",
    description: "AI learns from your browsing patterns and preferences to improve recommendations over time."
  },
  {
    icon: TrendingUp,
    title: "Trend Analysis", 
    description: "Stay ahead with products trending in your interest categories and similar user groups."
  },
  {
    icon: Users,
    title: "Social Insights",
    description: "Discover what similar customers are buying and highly rating in real-time."
  },
  {
    icon: Zap,
    title: "Instant Matching",
    description: "Get personalized product suggestions in milliseconds based on your unique profile."
  }
];

const AIRecommendations = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How AI Powers Your
            <span className="block text-transparent bg-gradient-ai bg-clip-text">
              Shopping Experience
            </span>
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced machine learning algorithms work behind the scenes to create a personalized shopping journey just for you.
          </p>
        </div>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group bg-gradient-card border-0 shadow-product hover:shadow-hover transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* CTA section */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4 bg-card rounded-2xl p-6 shadow-product">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-ai rounded-full flex items-center justify-center animate-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="text-left">
              <h3 className="font-semibold text-card-foreground mb-1">
                Ready to experience AI shopping?
              </h3>
              <p className="text-sm text-muted-foreground">
                Let our AI discover your perfect products
              </p>
            </div>
            
            <Button variant="hero" size="sm" className="ml-4">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
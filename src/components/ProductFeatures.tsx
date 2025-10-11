import { Gauge, Settings, Key, Lightbulb } from "lucide-react";
import * as Icons from "lucide-react";

interface Feature {
  icon: string;
  text: string;
}

interface ProductFeaturesProps {
  features?: Feature[];
}

const ProductFeatures = ({ features }: ProductFeaturesProps) => {
  const defaultFeatures = [
    {
      icon: "Gauge",
      text: "Smart Digital ODO",
    },
    {
      icon: "Settings",
      text: "Multiple Ride Modes",
    },
    {
      icon: "Key",
      text: "Keyless Start System",
    },
    {
      icon: "Lightbulb",
      text: "LED Matrix Headlamp",
    }
  ];

  const displayFeatures = features || defaultFeatures;

  return (
    <div className="w-full px-4 md:px-[70px] py-8 animate-fade-in bg-white">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 max-w-[1200px] mx-auto">
        {displayFeatures.map((feature, index) => {
          const IconComponent = (Icons as any)[feature.icon] || Icons.Circle;
          
          return (
            <div
              key={index}
              className="flex items-center gap-4 w-full md:w-auto hover:scale-105 transition-transform duration-200 cursor-pointer"
              style={{
                animation: `fadeInUp 0.4s ease ${0.2 + index * 0.1}s backwards`
              }}
            >
              <div className="opacity-80 flex-shrink-0">
                <IconComponent className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="font-poppins font-medium text-base leading-normal whitespace-nowrap" style={{ color: '#2D2D2D' }}>
                {feature.text}
              </span>
            </div>
          );
        })}
      </div>
      
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ProductFeatures;

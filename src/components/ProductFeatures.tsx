import { Gauge, Settings, Key, Lightbulb } from "lucide-react";

const ProductFeatures = () => {
  const features = [
    {
      icon: Gauge,
      text: "Smart Digital ODO",
      color: "text-muted-foreground"
    },
    {
      icon: Settings,
      text: "Multiple Ride Modes",
      color: "text-muted-foreground"
    },
    {
      icon: Key,
      text: "Keyless Start System",
      color: "text-foreground"
    },
    {
      icon: Lightbulb,
      text: "LED Matrix Headlamp",
      color: "text-foreground"
    }
  ];

  return (
    <div className="w-full px-4 md:px-[70px] py-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-md max-w-[1200px] mx-auto px-6 md:px-[70px] py-6 md:py-[35px]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4 w-full md:w-auto hover:scale-105 transition-transform duration-200 cursor-pointer"
              style={{
                animation: `fadeInUp 0.4s ease ${0.2 + index * 0.1}s backwards`
              }}
            >
              <div className="opacity-80 flex-shrink-0">
                <feature.icon className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className={`font-medium text-base ${feature.color} whitespace-nowrap`}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>
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

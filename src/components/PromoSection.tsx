import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FeatureData {
  title: string;
  subtitle: string;
  feature1: string;
  feature2: string;
}

const PromoSection = () => {
  const [featureData, setFeatureData] = useState<FeatureData | null>(null);

  useEffect(() => {
    const fetchFeatureSection = async () => {
      try {
        const { data, error } = await supabase
          .from("feature_section")
          .select("title, subtitle, feature1, feature2")
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching feature section:", error);
          return;
        }

        if (data) {
          setFeatureData(data as FeatureData);
        }
      } catch (error) {
        console.error("Error fetching feature section:", error);
      }
    };

    fetchFeatureSection();
  }, []);

  return (
    <section className="w-full bg-[#f8f9f9] relative h-[612px]">
      <div className="absolute bg-white h-[522px] left-1/2 -translate-x-1/2 overflow-hidden top-[45px] w-[1300px] max-w-[95%]">
        {/* Main Title */}
        <h2 className="absolute font-['Inter'] font-medium leading-[54px] left-[40px] text-[#212121] text-[28px] top-[51px] w-[267px]">
          {featureData?.title || "Now Get 3 Scooters at only"}
        </h2>
        
        {/* Price */}
        <div className="absolute font-['Inter'] font-extrabold leading-[54px] left-[167.5px] -translate-x-1/2 text-[#212121] text-[48px] text-center whitespace-nowrap top-[217px]">
          {featureData?.subtitle || "₹ 99,999/-"}
        </div>
        
        {/* Features */}
        <div className="absolute flex gap-[20px] items-center left-[40px] top-[337px]">
          <span className="font-['Poppins'] leading-normal text-[#4b4f54] opacity-50 text-[15.932px] whitespace-nowrap">
            {featureData?.feature1 || "Zero Emissions"}
          </span>
          <div className="relative h-[14.936px] w-0">
            <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0 w-[1px] bg-[#B5B5B4]"></div>
          </div>
          <span className="font-['Poppins'] leading-normal text-[#212121] opacity-50 text-[15.932px] whitespace-nowrap">
            {featureData?.feature2 || "Stylish Design"}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="absolute flex gap-[15px] items-center left-[calc(50%-434.5px)] -translate-x-1/2 top-[415px] w-[351px]">
          <Link
            to="/products"
            className="flex-1 bg-black h-[55px] flex items-center justify-center overflow-hidden transition-colors hover:bg-[#333]"
          >
            <span className="font-['Poppins'] font-medium leading-normal text-white text-[16px] whitespace-nowrap">
              Book Now
            </span>
          </Link>
          <Link
            to="/products"
            className="flex-1 bg-[#f8f9f9] h-[55px] flex items-center justify-center overflow-hidden transition-colors hover:bg-[#e8e9ea]"
          >
            <span className="font-['Inter'] font-medium leading-normal text-black text-[14px] whitespace-nowrap">
              Explore 
            </span>
          </Link>
        </div>
        
        {/* Product Images */}
        {/* Main Image - Top Right */}
        <div className="absolute bg-[#d9d9d9] h-[288px] right-0 top-0 w-[572px]">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=572&h=288&fit=crop"
            alt="Main Scooter"
            className="absolute w-full h-full object-cover"
          />
        </div>
        
        {/* Bottom Right Image */}
        <div className="absolute bg-[#d9d9d9] bottom-0 h-[214px] right-0 w-[394px]">
          <img
            src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=394&h=214&fit=crop"
            alt="Scooter Detail"
            className="absolute w-full h-full object-cover"
          />
        </div>
        
        {/* Bottom Center Image */}
        <div className="absolute bg-[#d9d9d9] bottom-0 h-[214px] left-[calc(50%+39.5px)] -translate-x-1/2 w-[393px]">
          <img
            src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=393&h=214&fit=crop"
            alt="Scooter Side View"
            className="absolute w-full h-full object-cover"
          />
        </div>
        
        {/* Top Center Image */}
        <div className="absolute bg-[#d9d9d9] h-[288px] left-[calc(50%-49.5px)] -translate-x-1/2 top-0 w-[215px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=288&fit=crop"
            alt="Scooter Front"
            className="absolute h-full left-[-50.51%] top-0 w-[201.01%]"
          />
        </div>
      </div>
    </section>
  );
};

export default PromoSection;

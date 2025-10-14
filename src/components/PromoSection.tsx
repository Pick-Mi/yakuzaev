import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const PromoSection = () => {
  const [title, setTitle] = useState("Now Get 3 Scooters at only");
  const [subtitle, setSubtitle] = useState("₹ 99,999/-");
  const [feature1, setFeature1] = useState("Zero Emissions");
  const [feature2, setFeature2] = useState("Stylish Design");
  const [image1, setImage1] = useState("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=288&fit=crop");
  const [image2, setImage2] = useState("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=572&h=288&fit=crop");
  const [image3, setImage3] = useState("https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=393&h=214&fit=crop");
  const [image4, setImage4] = useState("https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=394&h=214&fit=crop");

  useEffect(() => {
    const fetchFeatureSection = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from("feature_section")
          .select("title, subtitle, feature1, feature2, image1_url, image2_url, image3_url, image4_url")
          .eq("is_active", true)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching feature section:", error);
          return;
        }

        if (data) {
          if (data.title) setTitle(data.title);
          if (data.subtitle) setSubtitle(data.subtitle);
          if (data.feature1) setFeature1(data.feature1);
          if (data.feature2) setFeature2(data.feature2);
          if (data.image1_url) setImage1(data.image1_url);
          if (data.image2_url) setImage2(data.image2_url);
          if (data.image3_url) setImage3(data.image3_url);
          if (data.image4_url) setImage4(data.image4_url);
        }
      } catch (error) {
        console.error("Error fetching feature section:", error);
      }
    };

    fetchFeatureSection();
  }, []);

  return (
    <section className="w-full bg-[#f8f9f9] relative py-8 sm:py-10 lg:py-0 min-h-[500px] sm:min-h-[600px] lg:h-[612px] overflow-hidden">
      <div className="relative bg-white mx-auto my-4 sm:my-6 lg:my-0 lg:h-[522px] overflow-hidden lg:top-[45px] lg:w-[1300px] max-w-[95%] p-6 sm:p-8 lg:p-0 flex flex-col items-center lg:items-start lg:block">
        {/* Main Title */}
        <h2 className="font-['Inter'] font-medium leading-[1.4] sm:leading-[1.5] lg:leading-[54px] lg:absolute lg:left-[40px] text-[#212121] text-[18px] sm:text-[22px] md:text-[26px] lg:text-[28px] lg:top-[51px] lg:w-[267px] mb-4 sm:mb-6 lg:mb-0 text-center lg:text-left">
          {title}
        </h2>
        
        {/* Price */}
        <div className="font-['Inter'] font-extrabold leading-[1.3] sm:leading-[1.4] lg:leading-[54px] lg:absolute lg:left-[167.5px] lg:-translate-x-1/2 text-[#212121] text-[28px] sm:text-[36px] md:text-[44px] lg:text-[48px] text-center lg:text-left lg:whitespace-nowrap lg:top-[217px] mb-4 sm:mb-6 lg:mb-0">
          {subtitle}
        </div>
        
        {/* Features */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 sm:gap-[20px] items-center justify-center lg:justify-start lg:absolute lg:left-[40px] lg:top-[337px] mb-4 sm:mb-6 lg:mb-0">
          <span className="font-['Poppins'] leading-normal text-[#4b4f54] opacity-50 text-[12px] sm:text-[14px] md:text-[15px] lg:text-[15.932px] whitespace-nowrap">
            {feature1}
          </span>
          <div className="relative h-[14.936px] w-0">
            <div className="absolute bottom-0 left-[-0.5px] right-[-0.5px] top-0 w-[1px] bg-[#B5B5B4]"></div>
          </div>
          <span className="font-['Poppins'] leading-normal text-[#212121] opacity-50 text-[12px] sm:text-[14px] md:text-[15px] lg:text-[15.932px] whitespace-nowrap">
            {feature2}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 sm:gap-[15px] items-center justify-center lg:justify-start lg:absolute lg:left-[calc(50%-434.5px)] lg:-translate-x-1/2 lg:top-[415px] w-full sm:w-auto lg:w-[351px] mb-6 lg:mb-0">
          <Link
            to="/products"
            className="flex-1 sm:flex-1 bg-black h-[42px] sm:h-[48px] lg:h-[55px] flex items-center justify-center overflow-hidden transition-colors hover:bg-[#333]"
          >
            <span className="font-['Poppins'] font-medium leading-normal text-white text-[13px] sm:text-[15px] lg:text-[16px] whitespace-nowrap">
              Book Now
            </span>
          </Link>
          <Link
            to="/products"
            className="flex-1 sm:flex-1 bg-[#f8f9f9] h-[42px] sm:h-[48px] lg:h-[55px] flex items-center justify-center overflow-hidden transition-colors hover:bg-[#e8e9ea]"
          >
            <span className="font-['Inter'] font-medium leading-normal text-black text-[11px] sm:text-[13px] lg:text-[14px] whitespace-nowrap">
              Explore 
            </span>
          </Link>
        </div>
        
        {/* Product Images Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 w-full lg:block lg:absolute lg:inset-0">
          {/* Main Image - Top Right */}
          <div className="col-span-2 sm:col-span-1 lg:absolute bg-[#d9d9d9] h-[180px] sm:h-[220px] md:h-[260px] lg:h-[288px] lg:right-0 lg:top-0 sm:w-full lg:w-[572px]">
            <img
              src={image2}
              alt="Main Scooter"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Top Center Image - Hidden on mobile, visible on tablet */}
          <div className="hidden sm:block lg:absolute bg-[#d9d9d9] h-[220px] md:h-[260px] lg:h-[288px] sm:w-full lg:left-[calc(50%-49.5px)] lg:-translate-x-1/2 lg:top-0 lg:w-[215px] lg:overflow-hidden">
            <img
              src={image1}
              alt="Scooter Front"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Bottom Center Image */}
          <div className="lg:absolute bg-[#d9d9d9] h-[140px] sm:h-[170px] md:h-[190px] lg:bottom-0 lg:h-[214px] lg:left-[calc(50%+39.5px)] lg:-translate-x-1/2 lg:w-[393px]">
            <img
              src={image3}
              alt="Scooter Side View"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Bottom Right Image */}
          <div className="lg:absolute bg-[#d9d9d9] h-[140px] sm:h-[170px] md:h-[190px] lg:bottom-0 lg:h-[214px] lg:right-0 lg:w-[394px]">
            <img
              src={image4}
              alt="Scooter Detail"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;

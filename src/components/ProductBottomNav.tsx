import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductBottomNavProps {
  productName: string;
  variants: any[];
  selectedVariant: any;
  onVariantChange: (variant: any) => void;
  price: number;
  onBookNow: () => void;
}

export const ProductBottomNav = ({
  productName,
  variants,
  selectedVariant,
  onVariantChange,
  price,
  onBookNow,
}: ProductBottomNavProps) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show nav when user scrolls down past 200px
          if (currentScrollY > 200) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Get colors from the selected variant only
  const colors = selectedVariant?.colors?.map((color: any) => {
    const hexMatch = color.name?.match(/#[0-9A-Fa-f]{6}/);
    const hexColor = hexMatch ? hexMatch[0] : '#000000';
    return {
      name: color.name,
      value: hexColor
    };
  }) || [];

  // Get price from selected variant's specifications
  const variantPrice = selectedVariant?.specifications?.find(
    (spec: any) => spec.label === 'Price'
  )?.value || `₹${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Mobile Layout
  if (isMobile) {
    return (
      <div 
        className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="px-4 py-4">
          {/* Product Name and Price */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-1">
              <div className="font-['Poppins'] font-medium text-[18px] text-gray-800 mb-2">
                {productName}
              </div>
              <div className="font-['Poppins'] font-semibold text-[24px] text-gray-800">
                {variantPrice}
              </div>
            </div>

            {/* Vertical Divider and Right Section */}
            <div className="flex gap-4">
              <div className="w-[1px] bg-gray-300 self-stretch"></div>
              
              <div className="flex flex-col gap-4">
                {/* Variant Selector */}
                <div>
                  <div className="font-['Inter'] text-[14px] text-gray-800 font-medium mb-2">
                    Pick your variant
                  </div>
                  <Select
                    value={selectedVariant?.name || ""}
                    onValueChange={(value) => {
                      const variant = variants.find((v) => v.name === value);
                      if (variant) onVariantChange(variant);
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-[40px] bg-white border-gray-300 font-['Inter'] text-[14px]">
                      <SelectValue placeholder="Pick your variant" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-[100]">
                      {variants.map((variant, index) => (
                        <SelectItem key={index} value={variant.name}>
                          {variant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Selector */}
                <div>
                  <div className="font-['Inter'] text-[14px] text-gray-800 font-medium mb-2">
                    Colour
                  </div>
                  <div className="flex gap-2">
                    {colors.length > 0 ? (
                      colors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-[40px] h-[40px] border-2 ${
                            selectedColor === color.name
                              ? "border-black"
                              : "border-gray-300"
                          }`}
                          style={{ 
                            backgroundColor: color.value,
                            border: selectedColor === color.name 
                              ? '2px solid #000' 
                              : (color.value.toLowerCase() === '#ffffff' ? '2px solid #E0E0E0' : '2px solid #D1D5DB')
                          }}
                          title={color.name}
                        />
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">No colors available</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Now Button */}
          <button
            onClick={onBookNow}
            className="w-full bg-black text-white h-[56px] font-['Poppins'] font-medium text-[18px] hover:bg-black/90 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Name */}
          <div className="font-['Poppins'] font-medium text-[18px] text-gray-800 min-w-[150px]">
            {productName}
          </div>

          {/* Variant Selector */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedVariant?.name || ""}
              onValueChange={(value) => {
                const variant = variants.find((v) => v.name === value);
                if (variant) onVariantChange(variant);
              }}
            >
              <SelectTrigger className="w-[200px] h-[40px] bg-white border-gray-300 font-['Inter'] text-[14px]">
                <SelectValue placeholder="Pick your variant" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[100]">
                {variants.map((variant, index) => (
                  <SelectItem key={index} value={variant.name}>
                    {variant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Color Selector */}
          <div className="flex items-center gap-2">
            <span className="font-['Inter'] text-[14px] text-gray-600">
              Colour
            </span>
            <div className="flex gap-2">
              {colors.length > 0 ? (
                colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-[28px] h-[28px] rounded border-2 ${
                      selectedColor === color.name
                        ? "border-black"
                        : "border-gray-300"
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      border: color.value.toLowerCase() === '#ffffff' ? '2px solid #E0E0E0' : undefined
                    }}
                    title={color.name}
                  />
                ))
              ) : (
                <span className="text-gray-400 text-sm">No colors available</span>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="font-['Poppins'] font-semibold text-[20px] text-gray-800 min-w-[140px] text-right">
            {variantPrice}
          </div>

          {/* Book Now Button */}
          <button
            onClick={onBookNow}
            className="bg-black text-white h-[48px] px-[40px] font-['Poppins'] font-medium text-[16px] hover:bg-black/90 transition-colors whitespace-nowrap"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

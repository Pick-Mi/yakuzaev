import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // Get all unique colors from all variants
  const allColors = variants.reduce((acc: any[], variant: any) => {
    if (variant.colors && Array.isArray(variant.colors)) {
      variant.colors.forEach((color: any) => {
        const hexMatch = color.name?.match(/#[0-9A-Fa-f]{6}/);
        const hexColor = hexMatch ? hexMatch[0] : '#000000';
        // Check if this color is already in the accumulator
        if (!acc.find(c => c.value === hexColor)) {
          acc.push({
            name: color.name,
            value: hexColor
          });
        }
      });
    }
    return acc;
  }, []);

  const colors = allColors;

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
            ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

import { useState } from "react";
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

  // Sample colors - you can customize these
  const colors = [
    { name: "White", value: "#FFFFFF" },
    { name: "Beige", value: "#F5DEB3" },
    { name: "Blue", value: "#A7C7E7" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Product Name */}
          <div className="font-['Poppins'] font-medium text-[18px] text-gray-800 min-w-[150px]">
            {productName}
          </div>

          {/* Variant Selector */}
          <div className="flex items-center gap-2">
            <span className="font-['Inter'] text-[14px] text-gray-600">
              Pick your variant
            </span>
            <Select
              value={selectedVariant?.name || ""}
              onValueChange={(value) => {
                const variant = variants.find((v) => v.name === value);
                if (variant) onVariantChange(variant);
              }}
            >
              <SelectTrigger className="w-[140px] h-[36px] bg-white border-gray-300">
                <SelectValue placeholder="Select variant" />
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
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-[28px] h-[28px] rounded border-2 ${
                    selectedColor === color.name
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
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

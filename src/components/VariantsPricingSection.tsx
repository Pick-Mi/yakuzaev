import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface VariantSpec {
  id?: string;
  name: string;
  specifications?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  colors?: Array<{
    name: string;
  }>;
  // Legacy properties for backward compatibility
  price?: string;
  range?: string;
  kerbWeight?: string;
  batteryWarranty?: string;
  peakPower?: string;
}

interface VariantsPricingSectionProps {
  onVariantSelect?: (variant: VariantSpec) => void;
  variants?: VariantSpec[];
  specificationTitles?: Array<{ label: string; key: string }>;
}

const VariantsPricingSection = ({ onVariantSelect, variants: propVariants, specificationTitles }: VariantsPricingSectionProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);


  // Only use data from database - no defaults
  const actualVariants = propVariants && propVariants.length > 0 ? propVariants : [];
  const specRows = specificationTitles || [];
  
  // Don't render if no database data
  if (actualVariants.length === 0 || specRows.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F8F9F9] w-full py-16 px-4 md:px-[70px] mt-[80px]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-inter font-medium text-[48px] text-[#000000] mb-12">
          Variants with their prices
        </h2>

        <div className="bg-white rounded-lg overflow-x-auto">
          {/* Variant Names Header */}
          <div className="grid grid-cols-4 border-b border-gray-200 min-w-[800px]">
            <div className="p-6"></div>
            {actualVariants.map((variant, index) => (
              <div key={index} className="p-6 text-center border-l border-gray-200">
                <h3 className="font-inter font-semibold text-[18px] text-[#000000]">
                  {variant.name || `Variant ${index + 1}`}
                </h3>
              </div>
            ))}
          </div>

          {/* Specification Rows */}
          {specRows.map((spec, rowIndex) => (
            <div 
              key={rowIndex} 
              className={`grid grid-cols-4 min-w-[800px] ${rowIndex !== specRows.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <div className="p-6 font-inter font-medium text-[16px] text-[#000000]">
                {spec.label}
              </div>
              {actualVariants.map((variant, colIndex) => {
                // Find the matching specification in the variant's specifications array
                const variantSpec = variant.specifications?.find(
                  (s: any) => s.label === spec.label
                );
                
                return (
                  <div 
                    key={colIndex} 
                    className="p-6 text-center border-l border-gray-200 flex items-center justify-center"
                  >
                    {spec.label === 'Colour' ? (
                      <div className="flex gap-2 justify-center">
                        {variant.colors?.map((color: any, colorIndex: number) => {
                          // Extract hex color from "1 (#0A4886)" format
                          const hexMatch = color.name?.match(/#[0-9A-Fa-f]{6}/);
                          const hexColor = hexMatch ? hexMatch[0] : '#000000';
                          return (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded"
                              style={{ 
                                backgroundColor: hexColor, 
                                border: hexColor.toLowerCase() === '#ffffff' ? '1px solid #E0E0E0' : 'none' 
                              }}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <span className="font-inter font-normal text-[16px] text-[#000000]">
                        {variantSpec?.value || '-'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Select Buttons Row */}
          <div className="grid grid-cols-4 bg-white pt-6 pb-8 min-w-[800px]">
            <div className="p-6"></div>
            {actualVariants.map((variant, index) => (
              <div key={index} className="p-6 flex items-center justify-center border-l border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedVariantIndex(index);
                    onVariantSelect?.(variant);
                  }}
                  className={`w-full max-w-[160px] h-12 font-inter font-medium text-[16px] border-2 transition-colors ${
                    selectedVariantIndex === index 
                      ? 'bg-[#000000] text-white border-[#000000]' 
                      : 'border-[#000000] hover:bg-[#000000] hover:text-white'
                  }`}
                >
                  {selectedVariantIndex === index ? 'Selected' : 'Select'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VariantsPricingSection;

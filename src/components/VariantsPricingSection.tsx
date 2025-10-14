import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const isMobile = useIsMobile();

  // Only use data from database - no defaults
  const actualVariants = propVariants && propVariants.length > 0 ? propVariants : [];
  const specRows = specificationTitles || [];
  
  // Don't render if no database data
  if (actualVariants.length === 0 || specRows.length === 0) {
    return null;
  }

  const selectedVariant = selectedVariantIndex !== null ? actualVariants[selectedVariantIndex] : null;
  const selectedColor = selectedVariant?.colors?.[selectedColorIndex];
  const selectedPrice = selectedVariant?.specifications?.find(s => s.label === 'Ex-showroom Price')?.value || '-';

  // Mobile Card Layout
  if (isMobile) {
    return (
      <section className="bg-[#F8F9F9] w-full py-8 px-4 mt-[60px]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-inter font-medium text-[28px] text-[#000000] mb-6">
            Variants with their prices
          </h2>

          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {actualVariants.map((variant, index) => {
              const price = variant.specifications?.find(s => s.label === 'Price')?.value || '-';
              const range = variant.specifications?.find(s => s.label === 'Range')?.value || '-';
              const kerbWeight = variant.specifications?.find(s => s.label === 'Kerb Weight')?.value || '-';
              const batteryWarranty = variant.specifications?.find(s => s.label === 'Battery Warranty')?.value || '-';
              const peakPower = variant.specifications?.find(s => s.label === 'Peak Power')?.value || '-';

              return (
                <div key={index} className="bg-white p-4 flex flex-col min-w-[280px] snap-center flex-shrink-0">
                  <h3 className="font-inter font-semibold text-[14px] text-[#000000] mb-6 text-center border-b border-gray-200 pb-3">
                    {variant.name}
                  </h3>

                  <div className="space-y-4 flex-1">
                    <div>
                      <p className="font-inter text-[12px] text-gray-500 mb-1">Price</p>
                      <p className="font-inter font-semibold text-[16px] text-[#000000]">{price}</p>
                    </div>

                    <div>
                      <p className="font-inter text-[12px] text-gray-500 mb-2">Colour</p>
                      <div className="flex gap-2">
                        {variant.colors?.map((color: any, colorIndex: number) => {
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
                    </div>

                    <div>
                      <p className="font-inter text-[12px] text-gray-500 mb-1">Range</p>
                      <p className="font-inter font-semibold text-[16px] text-[#000000]">{range}</p>
                    </div>

                    <div>
                      <p className="font-inter text-[12px] text-gray-500 mb-1">kerb weight</p>
                      <p className="font-inter font-semibold text-[16px] text-[#000000]">{kerbWeight}</p>
                    </div>

                    <div>
                      <p className="font-inter text-[12px] text-gray-500 mb-1">Battery Warranty</p>
                      <p className="font-inter font-semibold text-[16px] text-[#000000]">{batteryWarranty}</p>
                    </div>

                    {peakPower && peakPower !== '-' && (
                      <div>
                        <p className="font-inter text-[12px] text-gray-500 mb-1">Peak Power</p>
                        <p className="font-inter font-semibold text-[16px] text-[#000000]">{peakPower}</p>
                      </div>
                    )}
                  </div>

                  <Button 
                    onClick={() => {
                      setSelectedVariantIndex(index);
                      setSelectedColorIndex(0);
                      if (onVariantSelect) {
                        onVariantSelect(variant);
                      }
                    }}
                    className={`w-full mt-6 h-10 font-inter font-medium text-[14px] transition-colors rounded-none ${
                      selectedVariantIndex === index 
                        ? 'bg-[#000000] text-white' 
                        : 'bg-[#F8F9F9] text-[#000000] hover:bg-[#000000] hover:text-white'
                    }`}
                  >
                    {selectedVariantIndex === index ? 'Selected' : 'Select'}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  // Desktop/Tablet Table Layout
  return (
    <section className="bg-[#F8F9F9] w-full py-16 px-4 md:px-[70px] mt-[80px]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-inter font-medium text-[48px] text-[#000000] mb-12">
          Variants with their prices
        </h2>

        <div className="bg-white rounded-lg overflow-x-auto">
          {/* Variant Names Header */}
          <div className="grid grid-cols-4 border-b border-gray-200 min-w-[800px]">
            <div className="p-6 sticky left-0 bg-white z-10 min-w-[200px]"></div>
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
              <div className="p-6 font-inter font-medium text-sm md:text-base text-[#000000] sticky left-0 bg-white z-10 min-w-[200px]">
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
            <div className="p-6 sticky left-0 bg-white z-10 min-w-[200px]"></div>
            {actualVariants.map((variant, index) => (
              <div key={index} className="p-6 flex items-center justify-center border-l border-gray-200">
                <Button 
                  onClick={() => {
                    setSelectedVariantIndex(index);
                    setSelectedColorIndex(0);
                    if (onVariantSelect) {
                      onVariantSelect(variant);
                    }
                  }}
                  className={`w-full max-w-[160px] h-12 font-inter font-medium text-[16px] transition-colors rounded-none ${
                    selectedVariantIndex === index 
                      ? 'bg-[#000000] text-white' 
                      : 'bg-[#F8F9F9] text-[#000000] hover:bg-[#000000] hover:text-white'
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

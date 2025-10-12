import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface VariantSpec {
  name: string;
  price: string;
  colors: string[];
  range: string;
  kerbWeight: string;
  batteryWarranty: string;
  peakPower: string;
}

interface VariantsPricingSectionProps {
  onVariantSelect?: (variant: VariantSpec) => void;
  variants?: VariantSpec[];
  specificationTitles?: Array<{ label: string; key: string }>;
}

const VariantsPricingSection = ({ onVariantSelect, variants: propVariants, specificationTitles }: VariantsPricingSectionProps) => {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);

  // Only use variants from database, no defaults
  const variants = propVariants || [];
  
  // Only use specification titles from database, no defaults
  const specRows = specificationTitles || [];

  console.log('VariantsPricingSection - specificationTitles prop:', specificationTitles);
  console.log('VariantsPricingSection - specRows being used:', specRows);
  
  // Don't render if no variants or specs available
  if (!variants.length || !specRows.length) {
    return null;
  }

  return (
    <section className="bg-white w-full py-16 px-4 md:px-[70px] mt-[80px]">
      <div className="max-w-[1400px] mx-auto">
        <div className="bg-[#F8F9F9] rounded-2xl overflow-hidden p-8 md:p-12">
          <ScrollArea className="w-full">
            <div className="min-w-max">
              {/* Variant Names Header */}
              <div className="flex mb-12">
                <div className="min-w-[200px] flex-shrink-0"></div>
                {variants.map((variant, index) => (
                  <div key={index} className="text-center min-w-[280px] flex-shrink-0 px-4">
                    <h3 className="font-inter font-semibold text-[20px] text-[#000000] uppercase tracking-wide">
                      {variant.name}
                    </h3>
                  </div>
                ))}
              </div>

              {/* Specification Rows */}
              {specRows.map((spec, rowIndex) => (
                <div 
                  key={rowIndex} 
                  className="flex py-6"
                >
                  <div className="min-w-[200px] flex-shrink-0 font-inter font-normal text-[16px] text-[#000000]">
                    {spec.label}
                  </div>
                  {variants.map((variant, colIndex) => (
                    <div 
                      key={colIndex} 
                      className="text-center flex items-center justify-center min-w-[280px] flex-shrink-0 px-4"
                    >
                      {spec.key === 'colors' ? (
                        <div className="flex gap-2 justify-center">
                          {variant.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6 rounded"
                              style={{ backgroundColor: color, border: color === '#FFFFFF' ? '1px solid #E0E0E0' : 'none' }}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="font-inter font-normal text-[16px] text-[#000000]">
                          {variant[spec.key as keyof VariantSpec]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              {/* Select Buttons Row */}
              <div className="flex pt-12">
                <div className="min-w-[200px] flex-shrink-0"></div>
                {variants.map((variant, index) => (
                  <div key={index} className="flex items-center justify-center min-w-[280px] flex-shrink-0 px-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedVariantIndex(index);
                        onVariantSelect?.(variant);
                      }}
                      className={`w-full max-w-[160px] h-12 font-inter font-medium text-[16px] rounded-lg transition-all ${
                        selectedVariantIndex === index 
                          ? 'bg-[#000000] text-white border-[#000000]' 
                          : 'bg-white text-[#000000] border-[#E0E0E0] hover:bg-[#F5F5F5]'
                      }`}
                    >
                      {selectedVariantIndex === index ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
};

export default VariantsPricingSection;

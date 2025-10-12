import { Button } from '@/components/ui/button';
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

  const defaultVariants: VariantSpec[] = [
    {
      name: 'YAKUZA NEU + 43V',
      price: '₹35,280.00',
      colors: ['#2B4C7E', '#FFFFFF', '#000000', '#A8C5DD', '#888888'],
      range: '70 km',
      kerbWeight: '200 kg',
      batteryWarranty: '3 yrs/50,000 km',
      peakPower: '13 kW'
    },
    {
      name: 'YAKUZA NEU + 63V',
      price: '₹35,280.00',
      colors: ['#2B4C7E', '#FFFFFF', '#000000', '#A8C5DD', '#888888'],
      range: '70 km',
      kerbWeight: '200 kg',
      batteryWarranty: '3 yrs/50,000 km',
      peakPower: '13 kW'
    },
    {
      name: 'YAKUZA NEU + 73V',
      price: '₹35,280.00',
      colors: ['#2B4C7E', '#FFFFFF', '#000000', '#A8C5DD', '#888888'],
      range: '70 km',
      kerbWeight: '200 kg',
      batteryWarranty: '3 yrs/50,000 km',
      peakPower: '13 kW'
    }
  ];

  const variants = propVariants && propVariants.length > 0 ? propVariants : defaultVariants;

  const defaultSpecRows = [
    { label: 'Price', key: 'price' },
    { label: 'Colour', key: 'colors' },
    { label: 'Range', key: 'range' },
    { label: 'kerb weight', key: 'kerbWeight' },
    { label: 'Battery Warranty', key: 'batteryWarranty' },
    { label: 'Peak Power', key: 'peakPower' }
  ];

  const specRows = specificationTitles && specificationTitles.length > 0 ? specificationTitles : defaultSpecRows;

  console.log('VariantsPricingSection - specificationTitles prop:', specificationTitles);
  console.log('VariantsPricingSection - specRows being used:', specRows);

  return (
    <section className="bg-[#F8F9F9] w-full py-16 px-4 md:px-[70px] mt-[80px]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-inter font-medium text-[48px] text-[#000000] mb-12">
          Variants with their prices
        </h2>

        <div className="bg-white rounded-lg overflow-hidden">
          {/* Variant Names Header */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            <div className="p-6"></div>
            {variants.map((variant, index) => (
              <div key={index} className="p-6 text-center border-l border-gray-200">
                <h3 className="font-inter font-semibold text-[18px] text-[#000000]">
                  {variant.name}
                </h3>
              </div>
            ))}
          </div>

          {/* Specification Rows */}
          {specRows.map((spec, rowIndex) => (
            <div 
              key={rowIndex} 
              className={`grid grid-cols-4 ${rowIndex !== specRows.length - 1 ? 'border-b border-gray-200' : ''}`}
            >
              <div className="p-6 font-inter font-medium text-[16px] text-[#000000]">
                {spec.label}
              </div>
              {variants.map((variant, colIndex) => (
                <div 
                  key={colIndex} 
                  className="p-6 text-center border-l border-gray-200 flex items-center justify-center"
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
          <div className="grid grid-cols-4 bg-white pt-6 pb-8">
            <div className="p-6"></div>
            {variants.map((variant, index) => (
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

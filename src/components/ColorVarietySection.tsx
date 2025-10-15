import { useState, useEffect } from 'react';

interface ColorVariant {
  color: string;
  name: string;
  image?: string;
}

interface ColorVarietySectionProps {
  colorVariety?: {
    colors?: ColorVariant[];
    title?: string;
    subtitle?: string;
  };
}

const ColorVarietySection = ({ colorVariety }: ColorVarietySectionProps) => {
  const [selectedColor, setSelectedColor] = useState(0);

  // Default colors if no data from database
  const defaultColors = [
    { id: 0, name: 'Gray', bgColor: 'bg-[#888888]', borderColor: 'border-[#888888]', color: '#888888', image: undefined as string | undefined },
    { id: 1, name: 'Blue', bgColor: 'bg-[#2B4C7E]', borderColor: 'border-[#2B4C7E]', color: '#2B4C7E', image: undefined as string | undefined },
    { id: 2, name: 'Light Blue', bgColor: 'bg-[#A8C5DD]', borderColor: 'border-[#A8C5DD]', color: '#A8C5DD', image: undefined as string | undefined },
  ];

  // Map database colors to component format
  const colors = colorVariety?.colors && colorVariety.colors.length > 0
    ? colorVariety.colors.map((color, index) => ({
        id: index,
        name: color.name || `Color ${index + 1}`,
        bgColor: `bg-[${color.color}]`,
        borderColor: `border-[${color.color}]`,
        color: color.color,
        image: color.image
      }))
    : defaultColors;

  // Set initial selected color based on first available color
  useEffect(() => {
    if (colors.length > 0) {
      setSelectedColor(0);
    }
  }, []);

  const selectedColorData = colors[selectedColor];

  return (
    <section className="bg-[#F8F9F9] w-full py-0 overflow-hidden mt-12 md:mt-[80px]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center">
        {/* Left side - Dynamic background with Scooter Image */}
        <div 
          className={`relative flex-1 w-full lg:w-1/2 h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center transition-colors duration-500`}
          style={{ backgroundColor: selectedColorData?.color || '#2B4C7E' }}
        >
          {/* Scooter Image */}
          <div className="w-full h-full flex items-center justify-center px-4 md:px-8">
            {selectedColorData?.image ? (
              <img 
                src={selectedColorData.image} 
                alt={`${selectedColorData.name} Scooter`}
                className="w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-auto object-contain transition-opacity duration-500"
              />
            ) : (
              <div className={`w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] h-[300px] md:h-[400px] lg:h-[450px] bg-white bg-opacity-20 flex items-center justify-center transition-colors duration-300`}>
                <span className="text-white text-sm md:text-base lg:text-lg">Scooter Image ({selectedColorData?.name})</span>
              </div>
            )}
          </div>
        </div>

        {/* Right side - White background with Text and Color Swatches */}
        <div className="flex-1 w-full lg:w-1/2 bg-white h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center px-6 md:px-8 lg:px-16 py-[35px]">
          <div className="flex flex-col gap-6 md:gap-8 items-center lg:items-start text-center lg:text-left">
            <h2 className="font-inter font-medium text-2xl md:text-4xl lg:text-[48px] leading-tight text-[#000000]">
              {colorVariety?.title || (
                <>
                  Express Yourself<br />
                  with Color<br />
                  Variety
                </>
              )}
            </h2>

            {colorVariety?.subtitle && (
              <p className="font-inter text-base md:text-lg text-gray-600">
                {colorVariety.subtitle}
              </p>
            )}

            {/* Color Swatches */}
            <div className="flex gap-4">
              {colors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded border-4 transition-all ${
                    selectedColor === color.id
                      ? 'scale-110'
                      : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: color.color,
                    borderColor: selectedColor === color.id ? color.color : 'transparent'
                  }}
                  aria-label={`Select ${color.name} color`}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorVarietySection;

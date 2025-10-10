import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ColorVarietySection = () => {
  const [selectedColor, setSelectedColor] = useState(1);

  const colors = [
    { id: 0, name: 'Gray', bgColor: 'bg-[#888888]', borderColor: 'border-[#888888]' },
    { id: 1, name: 'Blue', bgColor: 'bg-[#2B4C7E]', borderColor: 'border-[#2B4C7E]' },
    { id: 2, name: 'Light Blue', bgColor: 'bg-[#A8C5DD]', borderColor: 'border-[#A8C5DD]' },
  ];

  const handlePrevious = () => {
    setSelectedColor((prev) => (prev === 0 ? colors.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedColor((prev) => (prev === colors.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-white w-full py-16 px-4 md:px-[70px]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left side - Image with geometric background */}
        <div className="relative flex-1 w-full">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous color"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>
          
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
            aria-label="Next color"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>

          <div className="relative flex items-center justify-center">
            {/* Blue geometric background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[45%] h-[85%] bg-[#2B4C7E] -z-10" />
            
            {/* Scooter Image Placeholder */}
            <div className="w-full max-w-[600px] h-[400px] flex items-center justify-center">
              <div className={`w-[90%] h-full ${colors[selectedColor].bgColor} bg-opacity-20 flex items-center justify-center transition-colors duration-300`}>
                <span className="text-gray-600 text-lg">Scooter Image ({colors[selectedColor].name})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Text and Color Swatches */}
        <div className="flex-1 flex flex-col gap-8 items-center lg:items-start text-center lg:text-left">
          <h2 className="font-inter font-medium text-[48px] leading-tight text-[#000000]">
            Express Yourself<br />
            with Color<br />
            Variety
          </h2>

          {/* Color Swatches */}
          <div className="flex gap-4">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color.id)}
                className={`w-16 h-16 rounded ${color.bgColor} border-4 transition-all ${
                  selectedColor === color.id
                    ? `${color.borderColor} scale-110`
                    : 'border-transparent'
                }`}
                aria-label={`Select ${color.name} color`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ColorVarietySection;

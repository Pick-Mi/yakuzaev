import { useState } from 'react';

const ColorVarietySection = () => {
  const [selectedColor, setSelectedColor] = useState(1);

  const colors = [
    { id: 0, name: 'Gray', bgColor: 'bg-[#888888]', borderColor: 'border-[#888888]' },
    { id: 1, name: 'Blue', bgColor: 'bg-[#2B4C7E]', borderColor: 'border-[#2B4C7E]' },
    { id: 2, name: 'Light Blue', bgColor: 'bg-[#A8C5DD]', borderColor: 'border-[#A8C5DD]' },
  ];

  return (
    <section className="bg-[#F8F9F9] w-full py-0 overflow-hidden mt-[80px]">
      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center">
        {/* Left side - Blue background with Scooter Image */}
        <div className="relative flex-1 w-full lg:w-1/2 bg-[#2B4C7E] h-[600px] flex items-center justify-center">
          {/* Scooter Image Placeholder */}
          <div className="w-full h-full flex items-center justify-center px-8">
            <div className={`w-full max-w-[500px] h-[450px] ${colors[selectedColor].bgColor} bg-opacity-20 flex items-center justify-center transition-colors duration-300`}>
              <span className="text-white text-lg">Scooter Image ({colors[selectedColor].name})</span>
            </div>
          </div>
        </div>

        {/* Right side - White background with Text and Color Swatches */}
        <div className="flex-1 w-full lg:w-1/2 bg-white h-[600px] flex items-center justify-center px-8 lg:px-16">
          <div className="flex flex-col gap-8 items-center lg:items-start text-center lg:text-left">
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
      </div>
    </section>
  );
};

export default ColorVarietySection;

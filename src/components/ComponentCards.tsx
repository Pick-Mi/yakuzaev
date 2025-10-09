import { useState } from "react";

const ComponentCards = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    { id: 1, label: "Hub Motor", width: "w-[630px]" },
    { id: 2, label: "Head Light", width: "flex-1" },
    { id: 3, label: "Disc Brake", width: "flex-1" }
  ];

  return (
    <section className="bg-[#f8f9f9] relative w-full min-h-screen py-24">
      <div className="absolute left-1/2 top-[100px] -translate-x-1/2 flex gap-[30px] items-center w-[1300px] max-w-[calc(100%-40px)]
                      lg:flex-wrap lg:top-[50px] lg:gap-5 md:gap-4 md:top-[30px] sm:gap-4 sm:top-5">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`
              bg-[#8a8a8a] h-[386px] relative overflow-hidden
              transition-all duration-300 ease-out cursor-pointer
              hover:-translate-y-[5px] hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]
              animate-fade-in
              ${card.width}
              lg:w-full lg:flex-none lg:h-[300px]
              md:h-[250px]
              sm:h-[200px]
            `}
            style={{
              animationDelay: `${index * 0.1 + 0.1}s`,
              animationFillMode: 'backwards'
            }}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => console.log('Clicked on:', card.label)}
          >
            {/* Headlight image placeholder for card 2 */}
            {card.id === 2 && (
              <div className="absolute -right-[213px] top-1/2 translate-y-[calc(-50%+32px)] 
                              flex items-center justify-center
                              h-[calc(523px*0.563+606px*0.826)] w-[calc(606px*0.563+523px*0.826)]">
                <div className="flex-none rotate-[214deg] scale-y-[-1]">
                  <div className="w-[523px] h-[606px] bg-white/5" />
                </div>
              </div>
            )}

            {/* Disc brake image for card 3 */}
            {card.id === 3 && (
              <div className="absolute right-[522px] top-1/2 -translate-y-1/2 
                              flex items-center justify-center w-[108px] h-[384px]">
                <div className="flex-none rotate-180 scale-y-[-1]">
                  <div className="h-[384px] w-[108px] relative">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img 
                        className="absolute h-[348.57%] left-[-1444.74%] top-[-178.81%] w-[1694.26%] max-w-none"
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className={`
              absolute left-[30px] font-inter font-medium text-[28px] leading-normal text-white whitespace-pre
              ${card.id === 3 ? 'top-[332px]' : 'top-[322px]'}
              lg:text-2xl lg:top-[250px]
              md:text-xl md:left-5 md:top-[200px]
              sm:text-lg sm:left-[15px] sm:top-[150px]
              ${card.id === 3 ? 'lg:top-[260px] md:top-[210px] sm:top-[160px]' : ''}
            `}>
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ComponentCards;

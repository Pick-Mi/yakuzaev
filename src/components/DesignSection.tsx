const DesignSection = () => {
  return (
    <section className="bg-[#f8f9f9] w-full py-20 px-4">
      <div className="max-w-[1300px] mx-auto flex flex-col gap-12">
        <h2 className="font-inter font-medium text-5xl text-[#12141d]">Design</h2>
        
        <div className="flex flex-col gap-8">
          {/* Design Row 1 */}
          <div className="flex gap-8 lg:flex-col">
            <div className="bg-[#8a8a8a] h-[519px] flex-[1.75] relative overflow-hidden">
              <div className="absolute left-8 top-8 flex flex-col gap-5 text-white w-[454px]">
                <p className="font-inter font-medium text-[28px]">New Stylish Bike</p>
                <p className="font-inter font-normal text-[22px] opacity-70">Elegance engineered for speed</p>
              </div>
            </div>
            
            <div className="bg-[#8a8a8a] h-[519px] flex-1 relative overflow-hidden">
              <div className="absolute left-10 top-5 flex flex-col gap-5 text-white w-[454px]">
                <p className="font-inter font-medium text-[28px]">Premium Seat</p>
                <p className="font-inter font-normal text-[22px] opacity-70">Comfort engineered for long rides</p>
              </div>
            </div>
          </div>

          {/* Design Row 2 - Feature Cards */}
          <div className="flex gap-7 lg:flex-wrap md:flex-col">
            {/* Fast-Charge Battery Card */}
            <div className="bg-[#e9ecf3] h-[271px] flex-1 relative overflow-hidden">
              {/* Decorative Circles */}
              <div className="absolute left-[510px] top-[89px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              <div className="absolute left-[571px] top-[383px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              <div className="absolute left-[442px] top-[350px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              <div className="absolute left-[149px] top-[353px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              
              {/* Action Token Icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M28 9.33333L16 2.66667L4 9.33333V22.6667L16 29.3333L28 22.6667V9.33333ZM16 5.72L23.88 10.0933L19.8667 12.32C18.8933 11.3067 17.52 10.6667 16 10.6667C14.48 10.6667 13.1067 11.3067 12.1333 12.32L8.12 10.0933L16 5.72ZM14.6667 25.5467L6.66667 21.1067V12.3467L10.84 14.6667C10.72 15.08 10.6667 15.5333 10.6667 16C10.6667 18.48 12.36 20.5733 14.6667 21.16V25.5467ZM13.3333 16C13.3333 14.5333 14.5333 13.3333 16 13.3333C17.4667 13.3333 18.6667 14.5333 18.6667 16C18.6667 17.4667 17.4667 18.6667 16 18.6667C14.5333 18.6667 13.3333 17.4667 13.3333 16ZM17.3333 25.5467V21.1733C19.64 20.5867 21.3333 18.4933 21.3333 16.0133C21.3333 15.5467 21.28 15.0933 21.16 14.6667L25.3333 12.3467V21.1067L17.3333 25.5467Z" fill="#5D637D"/>
                </svg>
              </div>
              
              <div className="absolute left-8 top-[133px] flex flex-col gap-5 text-[#5d637d] w-[309px]">
                <p className="font-inter font-medium text-[28px]">Fast-Charge Battery</p>
                <p className="font-inter font-normal text-[22px] opacity-70">Get charged in minutes</p>
              </div>
            </div>

            {/* LED Matrix Headlight Card */}
            <div className="bg-[#8a8a8a] h-[271px] flex-1 relative overflow-hidden">
              <div className="absolute left-7 top-7 flex flex-col gap-5 text-white w-[309px]">
                <p className="font-inter font-medium text-[28px]">LED Matrix Headlight</p>
                <p className="font-inter font-normal text-[22px] opacity-70">Brightness that leads the way</p>
              </div>
            </div>

            {/* Smart Boot Space Card */}
            <div className="bg-[#e9ecf3] h-[271px] flex-1 relative overflow-hidden">
              {/* Decorative Circles */}
              <div className="absolute left-[510px] top-[89px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              <div className="absolute left-[571px] top-[383px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              <div className="absolute left-[442px] top-[350px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              <div className="absolute left-[149px] top-[353px] w-[17px] h-[17px]">
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <rect x="0.464715" y="0.464715" width="15.8003" height="15.8003" rx="7.90016" stroke="white" strokeWidth="0.929431"/>
                  <circle cx="8.36487" cy="8.36487" r="2.78829" fill="white"/>
                </svg>
              </div>
              
              {/* Action Token Icon */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M28 9.33333L16 2.66667L4 9.33333V22.6667L16 29.3333L28 22.6667V9.33333ZM16 5.72L23.88 10.0933L19.8667 12.32C18.8933 11.3067 17.52 10.6667 16 10.6667C14.48 10.6667 13.1067 11.3067 12.1333 12.32L8.12 10.0933L16 5.72ZM14.6667 25.5467L6.66667 21.1067V12.3467L10.84 14.6667C10.72 15.08 10.6667 15.5333 10.6667 16C10.6667 18.48 12.36 20.5733 14.6667 21.16V25.5467ZM13.3333 16C13.3333 14.5333 14.5333 13.3333 16 13.3333C17.4667 13.3333 18.6667 14.5333 18.6667 16C18.6667 17.4667 17.4667 18.6667 16 18.6667C14.5333 18.6667 13.3333 17.4667 13.3333 16ZM17.3333 25.5467V21.1733C19.64 20.5867 21.3333 18.4933 21.3333 16.0133C21.3333 15.5467 21.28 15.0933 21.16 14.6667L25.3333 12.3467V21.1067L17.3333 25.5467Z" fill="#5D637D"/>
                </svg>
              </div>
              
              <div className="absolute left-8 top-[133px] flex flex-col gap-5 text-[#5d637d] w-[309px]">
                <p className="font-inter font-medium text-[28px]">Smart Boot Space</p>
                <p className="font-inter font-normal text-[22px] opacity-70">Compact design, ample room</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;

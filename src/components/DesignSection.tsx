const DesignSection = () => {
  return (
    <section className="bg-white w-full py-12 px-4">
      <div className="max-w-[1300px] mx-auto flex gap-8">
        {/* New Stylish Bike Card */}
        <div className="bg-[#8a8a8a] h-[500px] flex-[63] relative overflow-hidden">
          <div className="absolute left-8 top-8 flex flex-col gap-3 text-white">
            <p className="font-inter font-medium text-[28px]">New Stylish Bike</p>
            <p className="font-inter font-normal text-[22px] opacity-70">Elegance engineered for speed</p>
          </div>
        </div>
        
        {/* Premium Seat Card */}
        <div className="bg-[#8a8a8a] h-[500px] flex-[37] relative overflow-hidden">
          <div className="absolute left-8 top-8 flex flex-col gap-3 text-white">
            <p className="font-inter font-medium text-[28px]">Premium Seat</p>
            <p className="font-inter font-normal text-[22px] opacity-70">Comfort engineered for long rides</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignSection;

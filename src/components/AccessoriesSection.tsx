interface Accessory {
  id?: string;
  image?: string;
  title?: string;
  name?: string;
  description?: string;
}

interface AccessoriesSectionProps {
  accessories?: Accessory[];
}

const AccessoriesSection = ({ accessories = [] }: AccessoriesSectionProps) => {
  // Fallback accessories if none provided from database
  const defaultAccessories = [
    {
      id: '1',
      name: 'Battery',
      description: 'Packed with power, style, and comfort'
    },
    {
      id: '2',
      name: 'Phone Mount',
      description: 'Packed with power, style, and comfort'
    },
    {
      id: '3',
      name: 'Helmet',
      description: 'Packed with power, style, and comfort'
    }
  ];

  const displayAccessories = accessories.length > 0 ? accessories : defaultAccessories;

  return (
    <section className="bg-[#F8F9F9] w-full py-16 px-4 md:px-[70px] mt-[80px]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-inter font-medium text-[48px] text-[#000000] mb-12">
          Accessories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayAccessories.map((accessory, index) => (
            <div key={accessory.id || index} className="bg-white rounded-lg overflow-hidden">
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <h3 className="font-inter font-medium text-[24px] text-[#000000] mb-2">
                    {accessory.title || accessory.name || 'Accessory'}
                  </h3>
                  <p className="font-inter font-normal text-[16px] text-[#666666]">
                    {accessory.description || 'High-quality accessory'}
                  </p>
                </div>

                {/* Image */}
                {accessory.image ? (
                  <div 
                    className="w-full h-[280px] bg-cover bg-center rounded"
                    style={{ backgroundImage: `url(${accessory.image})` }}
                  />
                ) : (
                  <div className="w-full h-[280px] bg-[#F5F5F5] flex items-center justify-center rounded">
                    <span className="text-gray-400 text-sm">{accessory.title || accessory.name} Image</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccessoriesSection;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  range: string;
  speed: string;
  startingPrice: string;
  showroomPrice: string;
  category: string;
}

const ProductListingSection = () => {
  const [activeCategory, setActiveCategory] = useState('Registration Model');

  const categories = ['Registration Model', 'Family', 'Business'];

  const products: Product[] = [
    {
      id: '1',
      name: 'Neu',
      range: '65 km Range',
      speed: '40 Km/h Speed',
      startingPrice: 'Starting Price',
      showroomPrice: '₹39,616.00',
      category: 'Registration Model'
    },
    {
      id: '2',
      name: 'Amber',
      range: '65 km Range',
      speed: '40 Km/h Speed',
      startingPrice: 'Starting Price',
      showroomPrice: '₹39,616.00',
      category: 'Registration Model'
    },
    {
      id: '3',
      name: 'AQABA',
      range: '65 km Range',
      speed: '40 Km/h Speed',
      startingPrice: 'Starting Price',
      showroomPrice: '₹39,616.00',
      category: 'Registration Model'
    },
    {
      id: '4',
      name: 'Pax',
      range: '65 km Range',
      speed: '40 Km/h Speed',
      startingPrice: 'Starting Price',
      showroomPrice: '₹39,616.00',
      category: 'Registration Model'
    }
  ];

  const filteredProducts = products.filter(product => product.category === activeCategory);

  return (
    <section className="bg-[#F8F9F9] w-full py-16 px-4 md:px-[70px] mt-[80px]">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="font-inter font-medium text-[48px] text-[#000000] mb-12">
          Experience the Next Generation of Riding
        </h2>

        {/* Category Tabs */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 font-inter font-medium text-[16px] transition-colors ${
                  activeCategory === category
                    ? 'bg-[#000000] text-white'
                    : 'bg-white text-[#000000] hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-2 ml-auto">
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden flex flex-col">
              {/* Product Image */}
              <div className="w-full h-[300px] bg-gradient-to-b from-[#E8E8E8] to-[#F5F5F5] flex items-center justify-center">
                <span className="text-gray-400 text-sm">{product.name} Image</span>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <h3 className="font-inter font-semibold text-[28px] text-[#000000] mb-3">
                    {product.name}
                  </h3>
                  <p className="font-inter font-normal text-[14px] text-[#666666]">
                    {product.range} | {product.speed}
                  </p>
                </div>

                <div className="mt-auto">
                  <p className="font-inter font-normal text-[14px] text-[#666666] mb-2">
                    {product.startingPrice}
                  </p>
                  <p className="font-inter font-bold text-[24px] text-[#000000] mb-4">
                    {product.showroomPrice}{' '}
                    <span className="font-normal text-[14px] text-[#666666]">/ showroom price</span>
                  </p>

                  {/* Buttons */}
                  <div className="flex flex-col gap-3">
                    <Button 
                      className="w-full h-12 bg-[#000000] text-white font-inter font-medium text-[16px] hover:bg-[#333333]"
                    >
                      Book Now
                    </Button>
                    <Link to={`/product/${product.id}`}>
                      <Button 
                        variant="outline"
                        className="w-full h-12 border-2 border-[#000000] text-[#000000] font-inter font-medium text-[16px] hover:bg-gray-100"
                      >
                        Explore {product.name}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductListingSection;

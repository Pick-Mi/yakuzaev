import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ChevronRightIcon, Info } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ProductConfig = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product: rawProduct, selectedVariant: initialVariant, quantity = 1, from } = location.state || {};
  const [selectedVariant, setSelectedVariant] = useState<any>(initialVariant);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"book" | "buy">("book");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [showHeader, setShowHeader] = useState(false);

  // Determine breadcrumb text based on where user came from
  const getBreadcrumbText = () => {
    if (from) return from;
    const referrer = document.referrer;
    if (referrer.includes('/product/')) return 'Product Details';
    if (referrer.includes('/products')) return 'Products';
    return 'Home';
  };

  // Navigate to appropriate route based on breadcrumb
  const handleBreadcrumbClick = () => {
    const text = getBreadcrumbText();
    if (text === 'Products') {
      navigate('/products');
    } else if (text === 'Product Details') {
      navigate(-1); // Go back to product details
    } else {
      navigate('/'); // Default to home
    }
  };

  // Sample colors
  const colors = [
    { name: "White", value: "#FFFFFF", border: "#E5E5E5" },
    { name: "Blue", value: "#2B4C7E" },
    { name: "Gray", value: "#4A4A4A" },
    { name: "Black", value: "#000000" },
  ];

  // Scroll detection for header
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Show header when user scrolls down past 100px
          if (currentScrollY > 100) {
            setShowHeader(true);
          } else {
            setShowHeader(false);
          }
          
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!rawProduct) {
      navigate('/');
      return;
    }

    // Parse variants and images if they're JSON strings
    let parsedVariants = [];
    try {
      parsedVariants = typeof rawProduct.variants === 'string' 
        ? JSON.parse(rawProduct.variants) 
        : Array.isArray(rawProduct.variants) ? rawProduct.variants : [];
    } catch (e) {
      console.error('Error parsing variants:', e);
      parsedVariants = [];
    }

    let parsedImages = [];
    try {
      parsedImages = typeof rawProduct.images === 'string' 
        ? JSON.parse(rawProduct.images) 
        : Array.isArray(rawProduct.images) ? rawProduct.images : [];
    } catch (e) {
      console.error('Error parsing images:', e);
      parsedImages = [];
    }

    const processedProduct = {
      ...rawProduct,
      variants: parsedVariants,
      images: parsedImages
    };

    setProduct(processedProduct);
  }, [rawProduct, navigate]);

  if (!product) {
    return null;
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const bookingAmount = 999;
  const emiPerMonth = 999;

  const handleNext = () => {
    // Build breadcrumb history
    const breadcrumbs = [
      { label: getBreadcrumbText(), path: -1 },
      { label: 'Product Config', path: '/product-config' }
    ];

    navigate('/booking-confirmation', {
      state: {
        product,
        selectedVariant,
        selectedColor,
        bookingAmount,
        breadcrumbs
      }
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Default Header - Always visible */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Header />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl pt-32">{/* Added pt-32 for header spacing */}
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-[14px]">
          <button 
            onClick={handleBreadcrumbClick}
            className="text-gray-400 hover:text-gray-600 transition-colors font-['Inter']"
          >
            {getBreadcrumbText()}
          </button>
          <ChevronRightIcon className="w-4 h-4 text-gray-400" />
          <span className="text-black font-semibold font-['Inter']">
            Product Config
          </span>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <h1 className="font-['Poppins'] font-semibold text-[40px] mb-2">
            Buy {product.name}
          </h1>
          <p className="font-['Inter'] text-[16px] text-gray-600">
            From ₹{currentPrice?.toLocaleString('en-IN')} or ₹{emiPerMonth}/per month for 24 months 
            <span className="ml-1">Footnote *</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Product Image */}
          <div className="relative bg-[#F8F9F9] rounded-lg p-8">
            <div className="relative aspect-square flex items-center justify-center">
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
              
              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Image Dots */}
            {productImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {productImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      currentImageIndex === index ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Side - Configuration */}
          <div className="space-y-8">
            {/* Heading */}
            <h2 className="font-['Poppins'] font-semibold text-[28px]">
              Book your {product.name}
            </h2>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("book")}
                className={`flex-1 py-3 font-['Inter'] font-medium text-[16px] transition-colors ${
                  activeTab === "book"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                Book a Bike
              </button>
              <button
                onClick={() => setActiveTab("buy")}
                className={`flex-1 py-3 font-['Inter'] font-medium text-[16px] transition-colors ${
                  activeTab === "buy"
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-50"
                }`}
              >
                Buy a Bike
              </button>
            </div>

            {/* Pick your variant */}
            <div>
              <h3 className="font-['Inter'] font-medium text-[16px] mb-4">
                Pick your variant
              </h3>
              <div className="space-y-3">
                {product.variants && product.variants.length > 0 ? (
                  product.variants.map((variant: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`w-full border-2 rounded-lg p-4 flex items-center justify-between transition-all ${
                        selectedVariant?.name === variant.name
                          ? "border-black bg-gray-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-['Poppins'] font-semibold text-[20px]">
                          {variant.name}
                        </p>
                        <p className="font-['Inter'] text-[14px] text-gray-600">
                          IDC Range
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-['Inter'] text-[12px] text-gray-500">
                          Starts at
                        </p>
                        <p className="font-['Poppins'] font-semibold text-[18px]">
                          ₹{variant.price?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="border-2 border-gray-300 rounded-lg p-4">
                    <p className="font-['Poppins'] font-semibold text-[20px]">
                      Standard
                    </p>
                    <p className="font-['Inter'] text-[14px] text-gray-600">
                      ₹{currentPrice?.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Colour Selection */}
            <div>
              <h3 className="font-['Inter'] font-medium text-[16px] mb-4">
                Colour
              </h3>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? "border-black scale-110"
                        : color.border ? `border-[${color.border}]` : "border-gray-300"
                    }`}
                    style={{ 
                      backgroundColor: color.value,
                      borderColor: selectedColor === color.name ? '#000' : (color.border || '#D1D5DB')
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="border-t pt-6 space-y-4">
              {activeTab === "book" ? (
                <>
                  {/* Show variant price as reference */}
                  <div className="flex items-center justify-between">
                    <span className="font-['Inter'] text-[14px] text-gray-600">
                      {selectedVariant?.name || 'Standard'} variant price
                    </span>
                    <span className="font-['Inter'] text-[16px] font-medium">
                      ₹{currentPrice?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Booking amount - what they pay now */}
                  <div className="bg-[#F8F9F9] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-['Inter'] font-medium text-[16px]">
                          Pay now for booking
                        </span>
                        <Info className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-['Poppins'] font-bold text-[24px] text-green-700">
                        ₹{bookingAmount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Fully refundable • Remaining amount to be paid at delivery
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Full payment for Buy a Bike */}
                  <div className="bg-[#F8F9F9] rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-['Inter'] font-medium text-[16px]">
                        Total amount
                      </span>
                      <span className="font-['Poppins'] font-bold text-[24px]">
                        ₹{currentPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Pay full amount now • Free delivery included
                    </p>
                  </div>
                </>
              )}

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="w-full bg-black text-white h-[60px] font-['Poppins'] font-medium text-[16px] hover:bg-black/90 transition-colors flex items-center justify-between px-8 group"
              >
                <span>
                  {activeTab === "book" ? `Continue with ₹${bookingAmount}` : `Continue with ₹${currentPrice?.toLocaleString('en-IN')}`}
                </span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductConfig;

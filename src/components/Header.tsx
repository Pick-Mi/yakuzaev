import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import NotificationBar from "./NotificationBar";
import menuIcon from "@/assets/menu-icon.svg";
import cartIcon from "@/assets/cart-icon.svg";
import profileIcon from "@/assets/profile-icon.svg";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { removeBackground, loadImageFromUrl } from "@/utils/backgroundRemoval";
import { X, ArrowUpRight } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [featuredProduct, setFeaturedProduct] = useState<any>(null);
  
  // Show fixed header on scroll or specific pages
  const shouldShowFixedHeader = isScrolled || 
    location.pathname === '/product-config' || 
    location.pathname === '/booking-confirmation' ||
    location.pathname === '/products' ||
    location.pathname === '/profile' ||
    location.pathname === '/profile-setup' ||
    location.pathname === '/orders' ||
    location.pathname === '/auth' ||
    location.pathname.startsWith('/orders/');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('site_settings')
          .select('logo_url')
          .single();
        
        if (!error && data?.logo_url) {
          // Load the image
          const img = await loadImageFromUrl(data.logo_url);
          
          // Remove background
          const blob = await removeBackground(img);
          
          // Create object URL from blob
          const processedUrl = URL.createObjectURL(blob);
          setLogoUrl(processedUrl);
        }
      } catch (error) {
        console.error('Error processing logo:', error);
        // Fallback to original logo if background removal fails
        try {
          const { data } = await (supabase as any)
            .from('site_settings')
            .select('logo_url')
            .single();
          if (data?.logo_url) {
            setLogoUrl(data.logo_url);
          }
        } catch (e) {
          console.error('Error fetching logo:', e);
        }
      }
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    const fetchFeaturedProduct = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('products')
          .select('id, name, price, image_url, feature1, feature2')
          .eq('is_active', true)
          .limit(1)
          .single();
        
        if (!error && data) {
          setFeaturedProduct(data);
        }
      } catch (error) {
        console.error('Error fetching featured product:', error);
      }
    };

    if (isMenuOpen) {
      fetchFeaturedProduct();
    }
  }, [isMenuOpen]);

  const handleCartClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/auth', { state: { showSignUp: true, from: location } });
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(true);
  };


  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NotificationBar />
        <nav className={`w-full p-[13px] transition-all duration-300 ${shouldShowFixedHeader ? 'bg-white' : 'bg-transparent'} ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="relative h-8 w-full max-w-[1360px] mx-auto">
            {/* Logo */}
            <Link to="/" className="absolute left-0 top-0 px-4 py-2 h-8 flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <span className={`font-medium text-sm transition-colors ${shouldShowFixedHeader ? 'text-gray-900' : 'text-white'}`}>LOGO</span>
              )}
            </Link>
            
            {/* Navigation Menu - Desktop */}
            <div className="absolute left-1/2 top-2 -translate-x-1/2 hidden md:flex gap-9 items-center">
              <Link to="/products" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-all whitespace-nowrap font-medium ${shouldShowFixedHeader ? 'text-gray-900' : 'text-white'}`}>
                Products
              </Link>
              <Link to="/" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-all whitespace-nowrap font-normal ${shouldShowFixedHeader ? 'text-gray-700' : 'text-white'}`}>
                Yakuza Store
              </Link>
              <Link to="/" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-all whitespace-nowrap font-normal ${shouldShowFixedHeader ? 'text-gray-700' : 'text-white'}`}>
                Become a Dealer
              </Link>
              <Link to="/" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-all whitespace-nowrap font-normal ${shouldShowFixedHeader ? 'text-gray-700' : 'text-white'}`}>
                About Us
              </Link>
            </div>
            
            {/* Icons */}
            <div className="absolute right-0 top-1 flex gap-[15px] items-center">
              <Link to={user ? "/cart" : "/auth"} onClick={handleCartClick} state={{ showSignUp: true, from: location }}>
                <Button variant="ghost" size="icon" className={`relative h-auto p-1 transition-all ${shouldShowFixedHeader ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}>
                  <img src={cartIcon} alt="Cart" className={`w-[22px] h-[22px] transition-all ${shouldShowFixedHeader ? 'invert' : ''}`} />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link to={user ? "/profile" : "/auth"} state={!user ? { from: location } : undefined}>
                <Button variant="ghost" size="icon" className={`h-auto p-1 transition-all ${shouldShowFixedHeader ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}>
                  <img src={profileIcon} alt="Profile" className={`w-[22px] h-[22px] transition-all ${shouldShowFixedHeader ? 'invert' : ''}`} />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-auto p-1 transition-all ${shouldShowFixedHeader ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                onClick={handleMenuClick}
              >
                <img src={menuIcon} alt="Menu" className={`w-[22px] h-[22px] transition-all ${shouldShowFixedHeader ? 'invert' : ''}`} />
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Half-Page Menu Dropdown */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-[60] animate-fade-in"
            onClick={() => setIsMenuOpen(false)}
            style={{ top: 'var(--notification-bar-height, 40px)' }}
          />
          
          {/* Dropdown Menu */}
          <div 
            className="fixed left-0 right-0 bg-white z-[70] shadow-2xl animate-slide-in-from-top"
            style={{ 
              top: 'var(--notification-bar-height, 40px)',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}
          >
            <div className="max-w-[1360px] mx-auto px-6 py-8">
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Featured Product Card */}
                {featuredProduct && (
                  <div className="relative bg-gradient-to-br from-gray-900 via-orange-900 to-orange-700 rounded-3xl p-6 overflow-hidden h-[400px]">
                    <div className="relative z-10">
                      <h3 className="text-white text-3xl font-bold mb-3">{featuredProduct.name}</h3>
                      <p className="text-white/90 text-base mb-4">
                        {featuredProduct.feature1} | {featuredProduct.feature2}
                      </p>
                      <div className="mb-6">
                        <p className="text-white/80 text-sm mb-1">Starting Price</p>
                        <p className="text-white text-2xl font-bold">₹ {featuredProduct.price.toLocaleString()} <span className="text-base font-normal">/ Per Month</span></p>
                      </div>
                      <Link
                        to={`/product/${featuredProduct.id}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-colors text-sm"
                      >
                        Explore {featuredProduct.name}
                      </Link>
                    </div>
                    <button
                      className="absolute top-6 right-6 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate(`/product/${featuredProduct.id}`);
                      }}
                    >
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </button>
                    {featuredProduct.image_url && (
                      <img
                        src={featuredProduct.image_url}
                        alt={featuredProduct.name}
                        className="absolute bottom-0 right-0 w-3/5 h-auto object-contain"
                      />
                    )}
                  </div>
                )}

                {/* Navigation Links */}
                <div className="grid grid-cols-3 gap-6 pt-4">
                  {/* Column 1 */}
                  <div>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-900 text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
                    >
                      Yakuza Stores
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 text-sm mb-3 hover:opacity-70 transition-opacity"
                    >
                      Become a Dealers
                    </Link>
                  </div>

                  {/* Column 2 */}
                  <div>
                    <Link
                      to="/products"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-900 text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
                    >
                      Product
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 text-sm mb-3 hover:opacity-70 transition-opacity"
                    >
                      About Us
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 text-sm mb-3 hover:opacity-70 transition-opacity"
                    >
                      Blogs
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 text-sm mb-3 hover:opacity-70 transition-opacity"
                    >
                      Contact Us
                    </Link>
                  </div>

                  {/* Column 3 */}
                  <div>
                    <Link
                      to={user ? "/profile" : "/auth"}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-900 text-sm font-medium mb-4 hover:opacity-70 transition-opacity"
                    >
                      Account
                    </Link>
                    <Link
                      to={user ? "/cart" : "/auth"}
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 text-sm mb-3 hover:opacity-70 transition-opacity"
                    >
                      Cart
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-gray-700 text-sm mb-3 hover:opacity-70 transition-opacity"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>

              {/* Footer Text */}
              <div className="mt-8 text-right">
                <p className="text-gray-300 text-base font-light">Join With YAKUZA Family</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
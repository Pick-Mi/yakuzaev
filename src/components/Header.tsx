import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import NotificationBar from "./NotificationBar";
import menuIcon from "@/assets/menu-icon.svg";
import cartIcon from "@/assets/cart-icon.svg";
import profileIcon from "@/assets/profile-icon.svg";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { removeBackground, loadImageFromUrl } from "@/utils/backgroundRemoval";

const Header = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

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


  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NotificationBar />
        <nav className={`w-full p-[13px] transition-all duration-300 ${isScrolled ? 'bg-white' : 'bg-transparent'}`}>
          <div className="relative h-8 w-full max-w-[1360px] mx-auto">
            {/* Logo */}
            <Link to="/" className="absolute left-0 top-0 px-4 py-2 h-8 flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <span className={`font-medium text-sm ${isScrolled ? 'text-foreground' : 'text-white'}`}>LOGO</span>
              )}
            </Link>
            
            {/* Navigation Menu - Desktop */}
            <div className="absolute left-1/2 top-2 -translate-x-1/2 hidden md:flex gap-9 items-center">
              <Link to="/products" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-opacity whitespace-nowrap font-medium ${isScrolled ? 'text-black' : 'text-white'}`}>
                Products
              </Link>
              <Link to="/" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-opacity whitespace-nowrap font-normal ${isScrolled ? 'text-black' : 'text-white'}`}>
                Yakuza Store
              </Link>
              <Link to="/" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-opacity whitespace-nowrap font-normal ${isScrolled ? 'text-black' : 'text-white'}`}>
                Become a Dealer
              </Link>
              <Link to="/" className={`text-[14px] font-sans leading-normal hover:opacity-80 transition-opacity whitespace-nowrap font-normal ${isScrolled ? 'text-black' : 'text-white'}`}>
                About Us
              </Link>
            </div>
            
            {/* Icons */}
            <div className="absolute right-0 top-1 flex gap-[15px] items-center">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-black/10 h-auto p-1 text-black">
                  <img src={cartIcon} alt="Cart" className={`w-[22px] h-[22px] ${isScrolled ? 'invert' : ''}`} />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link to={user ? "/profile" : "/auth"}>
                <Button variant="ghost" size="icon" className="hover:bg-black/10 h-auto p-1 text-black">
                  <img src={profileIcon} alt="Profile" className={`w-[22px] h-[22px] ${isScrolled ? 'invert' : ''}`} />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="hover:bg-black/10 h-auto p-1 text-black">
                <img src={menuIcon} alt="Menu" className={`w-[22px] h-[22px] ${isScrolled ? 'invert' : ''}`} />
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
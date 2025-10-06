import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import NotificationBar from "./NotificationBar";
import menuIcon from "@/assets/menu-icon.svg";
import cartIcon from "@/assets/cart-icon.svg";
import profileIcon from "@/assets/profile-icon.svg";

const Header = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();

  return (
    <>
      <NotificationBar />
      <nav className="absolute top-0 left-0 w-full p-5 z-10 mt-10">
      <div className="relative h-8 w-full max-w-[1360px] mx-auto">
        {/* Logo */}
        <Link to="/" className="absolute left-0 top-0 bg-white text-[#040d16] px-4 py-2 font-medium text-sm h-8 flex items-center justify-center w-[82px]">
          LOGO
        </Link>
        
        {/* Navigation Menu - Desktop */}
        <div className="absolute left-1/2 top-2 -translate-x-1/2 hidden md:flex gap-9 items-center">
          <Link to="/products" className="text-white text-sm font-medium hover:opacity-80 transition-opacity whitespace-nowrap">
            Products
          </Link>
          <Link to="/" className="text-white text-sm font-normal hover:opacity-80 transition-opacity whitespace-nowrap">
            Yakuza Store
          </Link>
          <Link to="/" className="text-white text-sm font-normal hover:opacity-80 transition-opacity whitespace-nowrap">
            Become a Dealer
          </Link>
          <Link to="/" className="text-white text-sm font-normal hover:opacity-80 transition-opacity whitespace-nowrap">
            About Us
          </Link>
        </div>
        
        {/* Icons */}
        <div className="absolute right-0 top-1 flex gap-[15px] items-center">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 h-auto p-1">
              <img src={cartIcon} alt="Cart" className="w-[22px] h-[22px]" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Link to={user ? "/profile" : "/auth"}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-auto p-1">
              <img src={profileIcon} alt="Profile" className="w-[22px] h-[22px]" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-auto p-1">
            <img src={menuIcon} alt="Menu" className="w-[22px] h-[22px]" />
          </Button>
        </div>
      </div>
      </nav>
    </>
  );
};

export default Header;
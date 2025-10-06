import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, Menu, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { user } = useAuth();
  const { itemCount } = useCart();

  return (
    <nav className="absolute top-0 left-0 w-full py-4 px-10 z-10">
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
        </div>
        
        {/* Icons */}
        <div className="absolute right-0 top-1 flex gap-6 items-center">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 h-auto p-1">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-auto p-1">
            <Menu className="w-5 h-5" />
          </Button>
          <Link to={user ? "/profile" : "/auth"}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-auto p-1">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
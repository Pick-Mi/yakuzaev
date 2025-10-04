import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import NotificationBar from "./NotificationBar";

const Header = () => {
  const { user, signOut } = useAuth();
  const { displayName, loading: profileLoading } = useProfile();
  console.log('Header: user =', user, 'displayName =', displayName, 'profileLoading =', profileLoading);
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      <NotificationBar />
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary">
          Yakuza EV
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
          
          {/* User Menu */}
          {user ? (
            <Link to="/profile">
              <Button variant="ghost" className="flex items-center gap-2 h-auto px-3 py-2">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{displayName}</span>
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="ai" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
    </div>
  );
};

export default Header;
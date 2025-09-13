import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, User, LogOut, Settings, CreditCard, MapPin, Package } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const { user, signOut } = useAuth();
  const { displayName } = useProfile();
  const { itemCount } = useCart();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto px-3 py-2">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="w-56">
                 <div className="flex items-center justify-start gap-2 p-2">
                   <div className="flex flex-col space-y-1 leading-none">
                     <p className="text-sm font-medium">{user.email}</p>
                   </div>
                 </div>
                 <DropdownMenuSeparator />
                 <Link to="/profile">
                   <DropdownMenuItem>
                     <User className="w-4 h-4 mr-2" />
                     Profile Details
                   </DropdownMenuItem>
                 </Link>
                 <Link to="/profile?tab=address">
                   <DropdownMenuItem>
                     <MapPin className="w-4 h-4 mr-2" />
                     Address Details
                   </DropdownMenuItem>
                 </Link>
                  <Link to="/profile?tab=payment">
                    <DropdownMenuItem>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Details
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/orders">
                    <DropdownMenuItem>
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={handleSignOut}>
                   <LogOut className="w-4 h-4 mr-2" />
                   Sign Out
                 </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
  );
};

export default Header;
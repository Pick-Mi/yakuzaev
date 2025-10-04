import { Link } from "react-router-dom";

const NotificationBar = () => {
  return (
    <div className="w-full h-12 bg-[#0a0a0a] text-white px-4 flex items-center">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm h-full">
        <span className="text-xs font-normal">Introducing our new 3-bike combo all for just ₹99,999!</span>
        <Link 
          to="/products" 
          className="text-xs font-medium underline underline-offset-4 hover:text-primary transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default NotificationBar;

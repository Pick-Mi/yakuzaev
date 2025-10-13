import { Link } from "react-router-dom";

const NotificationBar = () => {
  return (
    <div className="w-full bg-[#0C121C] text-white h-12 sm:h-14 md:h-16 px-2 sm:px-4 flex items-center">
      <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-4 font-['Poppins'] text-[10px] sm:text-xs md:text-sm font-normal">
        <span className="text-center leading-tight">Introducing our new 3-bike combo all for just ₹99,999!</span>
        <Link 
          to="/products" 
          className="font-medium hover:underline underline-offset-4 transition-all whitespace-nowrap"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default NotificationBar;

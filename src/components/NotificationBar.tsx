import { Link } from "react-router-dom";

const NotificationBar = () => {
  return (
    <div className="w-full bg-black text-white py-2.5 px-4">
      <div className="container mx-auto flex items-center justify-center gap-4 text-sm">
        <span>Introducing our new 3-bike combo all for just ₹99,999!</span>
        <Link 
          to="/products" 
          className="font-medium hover:underline underline-offset-4 transition-all"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default NotificationBar;

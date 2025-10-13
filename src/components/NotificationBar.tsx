import { Link } from "react-router-dom";

const NotificationBar = () => {
  return (
    <div className="w-full bg-[#0C121C] text-white h-12 px-4 flex items-center">
      <div className="container mx-auto flex items-center justify-center gap-4" style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 400 }}>
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

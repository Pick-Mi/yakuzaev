import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Home, Package } from "lucide-react";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedVariant, selectedColor, bookingAmount = 999 } = location.state || {};

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl pt-32">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="font-['Poppins'] font-semibold text-[40px] mb-4">
            Booking Confirmed!
          </h1>
          <p className="font-['Inter'] text-[18px] text-muted-foreground max-w-2xl mx-auto">
            Thank you for booking your {product.name}. Your booking has been successfully confirmed.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-card border rounded-lg p-8 mb-8 shadow-sm">
          <h2 className="font-['Poppins'] font-semibold text-[24px] mb-6 border-b pb-4">
            Booking Details
          </h2>

          <div className="space-y-4">
            {/* Product Info */}
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={product.image || product.images?.[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-['Poppins'] font-semibold text-[20px] mb-1">
                  {product.name}
                </h3>
                {selectedVariant && (
                  <p className="font-['Inter'] text-[14px] text-muted-foreground">
                    Variant: {selectedVariant.name}
                  </p>
                )}
                {selectedColor && (
                  <p className="font-['Inter'] text-[14px] text-muted-foreground">
                    Color: {selectedColor}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-['Inter'] text-[12px] text-muted-foreground mb-1">
                  Price
                </p>
                <p className="font-['Poppins'] font-semibold text-[20px]">
                  ₹{currentPrice?.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Booking Amount */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-['Inter'] font-medium text-[16px]">
                    Booking Amount Paid
                  </p>
                  <p className="font-['Inter'] text-[14px] text-muted-foreground">
                    Fully refundable
                  </p>
                </div>
                <p className="font-['Poppins'] font-semibold text-[24px]">
                  ₹{bookingAmount.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Remaining Amount */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-['Inter'] font-medium text-[16px]">
                  Remaining Amount
                </p>
                <p className="font-['Poppins'] font-semibold text-[20px]">
                  ₹{(currentPrice - bookingAmount).toLocaleString('en-IN')}
                </p>
              </div>
              <p className="font-['Inter'] text-[14px] text-muted-foreground mt-2">
                To be paid at the time of delivery
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-['Poppins'] font-semibold text-[18px] mb-3">
            What's Next?
          </h3>
          <ul className="space-y-2 font-['Inter'] text-[14px] text-gray-700">
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>We'll send you a confirmation email with your booking details</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>Our team will contact you within 24 hours to confirm delivery details</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <span>You can track your order status in the Orders section</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate('/orders')}
            variant="outline"
            className="h-[50px] px-8 font-['Poppins'] font-medium text-[16px]"
          >
            <Package className="w-5 h-5 mr-2" />
            View Orders
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="h-[50px] px-8 font-['Poppins'] font-medium text-[16px] bg-black text-white hover:bg-black/90"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;

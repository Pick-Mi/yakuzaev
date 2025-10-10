import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Home, Package, ChevronRight, Search, Gift } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const deliveryFormSchema = z.object({
  phoneNumber: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits"),
  firstName: z.string().trim().min(1, "First name is required").max(100, "First name must be less than 100 characters"),
  lastName: z.string().trim().min(1, "Last name is required").max(100, "Last name must be less than 100 characters"),
  address: z.string().trim().min(5, "Address is required").max(500, "Address must be less than 500 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
});

type DeliveryFormData = z.infer<typeof deliveryFormSchema>;

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedVariant, selectedColor, bookingAmount = 999, breadcrumbs = [] } = location.state || {};
  const [manualAddress, setManualAddress] = useState(false);

  const form = useForm<DeliveryFormData>({
    resolver: zodResolver(deliveryFormSchema),
    defaultValues: {
      phoneNumber: "",
      firstName: "",
      lastName: "",
      address: "",
      email: "",
    },
  });

  const onSubmit = (data: DeliveryFormData) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

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
    <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl pt-32">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-[14px] flex-wrap">
          {breadcrumbs.map((crumb: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <button 
                onClick={() => typeof crumb.path === 'number' ? navigate(crumb.path) : navigate(crumb.path)}
                className="text-gray-400 hover:text-gray-600 transition-colors font-['Inter']"
              >
                {crumb.label}
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          ))}
          <span className="text-black font-semibold font-['Inter']">
            Booking Confirmation
          </span>
        </div>




        {/* Membership Form Section */}
        <div className="mb-12">
          <h2 className="font-['Poppins'] font-semibold text-[40px] mb-12">
            Now let&apos;s make you a Yakuza Member.
          </h2>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Product Summary */}
            <div className="space-y-6">
              {/* Product Image and Details */}
              <div className="bg-[#F8F9F9] rounded-lg p-8 flex items-center justify-center">
                <img 
                  src={product.image || product.images?.[0]} 
                  alt={product.name}
                  className="w-full max-w-[300px] h-auto object-contain"
                />
              </div>

              {/* Variant and Color */}
              <div className="space-y-2">
                {selectedVariant && (
                  <p className="font-['Inter'] text-[16px]">
                    <span className="font-medium">Variant :</span> {selectedVariant.name}
                  </p>
                )}
                {selectedColor && (
                  <p className="font-['Inter'] text-[16px] flex items-center gap-2">
                    <span className="font-medium">Colour :</span> 
                    <span>{selectedColor}</span>
                    <span className="w-5 h-5 rounded-full bg-black border border-gray-300"></span>
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-6">
                <h3 className="font-['Poppins'] font-semibold text-[24px] mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[16px]">Subtotal</span>
                    <span className="font-['Inter'] text-[16px]">₹{currentPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[16px]">Subtotal</span>
                    <span className="font-['Inter'] text-[16px]">₹{currentPrice?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[16px]">Subtotal</span>
                    <span className="font-['Inter'] text-[16px]">₹{currentPrice?.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="font-['Poppins'] text-[18px]">Total</span>
                      <span className="font-['Poppins'] text-[18px]">₹{currentPrice?.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-orange-600 mt-4">
                    <Gift className="w-5 h-5" />
                    <span className="font-['Inter'] text-[14px]">You are saving ₹207.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Delivery Form */}
            <div>
              <h3 className="font-['Poppins'] font-semibold text-[28px] mb-6">
                Delivery Details
              </h3>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Phone Number */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-['Inter'] text-[14px]">Phone No*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="345698765" 
                            {...field}
                            className="font-['Inter']"
                          />
                        </FormControl>
                        <FormDescription className="font-['Inter'] text-[12px] text-muted-foreground">
                          A carrier might contact you to confirm delivery
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Name Section */}
                  <div>
                    <h4 className="font-['Inter'] font-medium text-[16px] mb-4">
                      Enter your name and address:
                    </h4>

                    <div className="space-y-4">
                      {/* First Name */}
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-['Inter'] text-[14px]">First Name*</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="" 
                                {...field}
                                className="font-['Inter']"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Last Name */}
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-['Inter'] text-[14px]">Last Name*</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="" 
                                {...field}
                                className="font-['Inter']"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Address */}
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-['Inter'] text-[14px]">Address*</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input 
                                  placeholder="Start typing a street address or postcode" 
                                  {...field}
                                  className="pl-10 font-['Inter']"
                                />
                              </div>
                            </FormControl>
                            <FormDescription className="font-['Inter'] text-[12px] text-muted-foreground">
                              We do not ship to P.O. boxes
                            </FormDescription>
                            <button
                              type="button"
                              onClick={() => setManualAddress(true)}
                              className="font-['Inter'] text-[14px] underline hover:no-underline mt-2"
                            >
                              Enter address manually.
                            </button>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email */}
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-['Inter'] text-[14px]">Email*</FormLabel>
                            <FormControl>
                              <Input 
                                type="email"
                                placeholder="alex@gmail.com" 
                                {...field}
                                className="font-['Inter']"
                              />
                            </FormControl>
                            <FormDescription className="font-['Inter'] text-[12px] text-muted-foreground">
                              A confirmation email will be sent after checkout.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black text-white h-[60px] font-['Poppins'] font-medium text-[16px] hover:bg-black/90"
                  >
                    Complete Booking
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Next Steps - Removed, replaced with form */}
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;

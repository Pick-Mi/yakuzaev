import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Gift, Phone, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Country codes data
const countryCodes = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
];

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, selectedVariant, selectedColor, bookingAmount = 999, breadcrumbs = [] } = location.state || {};
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signInWithPhone, verifyOTP } = useAuth();

  const validatePhoneNumber = (fullPhone: string): string | null => {
    // Remove all non-digit characters except +
    const cleaned = fullPhone.replace(/[^\d+]/g, '');
    
    // Check if it starts with + and has at least 10 digits
    if (!cleaned.startsWith('+')) {
      return 'Phone number must start with country code (e.g., +1)';
    }
    
    // Extract digits only (without +)
    const digits = cleaned.substring(1);
    
    if (digits.length < 10 || digits.length > 15) {
      return 'Phone number must be between 10-15 digits';
    }
    
    return null;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Combine country code with phone number
    const fullPhone = countryCode + phoneNumber;
    const validationError = validatePhoneNumber(fullPhone);
    if (validationError) {
      toast.error(validationError);
      setLoading(false);
      return;
    }

    try {
      const { error } = await signInWithPhone(fullPhone);

      if (error) {
        toast.error(error.message || "Phone Authentication Error");
      } else {
        toast.success("OTP Sent! Please check your phone for the verification code.");
        setStep('otp');
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fullPhone = countryCode + phoneNumber;
      const { error } = await verifyOTP(fullPhone, otp);

      if (error) {
        toast.error(error.message || "Verification Error");
      } else {
        toast.success("Phone verified successfully! Proceeding with booking...");
        // Continue with booking flow after verification
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

            {/* Right Side - Mobile Login Card */}
            <div>
              <Card className="shadow-xl border-0 bg-gradient-card">
                <CardHeader className="space-y-2">
                  <CardTitle className="text-2xl font-bold">
                    {step === 'phone' ? 'Sign In with Phone' : 'Enter Verification Code'}
                  </CardTitle>
                  <CardDescription>
                    {step === 'phone' ? 'Enter your mobile number to get started' : 
                     `We sent a verification code to ${countryCode}${phoneNumber}`}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {step === 'phone' ? (
                    <>
                      {/* Phone Number Form */}
                      <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="flex gap-2">
                            {/* Country Code Selector */}
                            <Select value={countryCode} onValueChange={setCountryCode}>
                              <SelectTrigger className="w-32 bg-background/50 backdrop-blur-sm border-input/50">
                                <SelectValue placeholder="Country" />
                              </SelectTrigger>
                              <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50 z-50">
                                {countryCodes.map((country) => (
                                  <SelectItem key={country.code} value={country.code} className="hover:bg-accent/50">
                                    <div className="flex items-center gap-2">
                                      <span>{country.flag}</span>
                                      <span>{country.code}</span>
                                      <span className="text-xs text-muted-foreground">{country.country}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            
                            {/* Phone Number Input */}
                            <div className="relative flex-1">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="1234567890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="pl-10"
                                required
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            We'll send you a verification code via SMS
                          </p>
                        </div>
                        
                        <Button 
                          type="submit" 
                          variant="hero" 
                          className="w-full" 
                          disabled={loading}
                        >
                          {loading ? 'Sending...' : 'Send Verification Code'}
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      {/* OTP Verification Form */}
                      <form onSubmit={handleOTPSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="otp">Verification Code</Label>
                          <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="otp"
                              type="text"
                              placeholder="Enter 6-digit code"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              className="pl-10 text-center text-lg tracking-widest"
                              maxLength={6}
                              required
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          variant="hero" 
                          className="w-full" 
                          disabled={loading || otp.length !== 6}
                        >
                          {loading ? 'Verifying...' : 'Verify Code'}
                        </Button>
                      </form>
                      
                      {/* Back to phone */}
                      <div className="text-center text-sm">
                        <span className="text-muted-foreground">
                          Didn't receive the code?
                        </span>{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline font-medium"
                          onClick={() => {
                            setStep('phone');
                            setOtp('');
                            setPhoneNumber('');
                          }}
                        >
                          Try different number
                        </button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
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

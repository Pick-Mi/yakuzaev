import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, Gift, Phone, MessageSquare, Search } from "lucide-react";
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
  const [isVerified, setIsVerified] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [showManualAddress, setShowManualAddress] = useState(false);
  
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
        toast.success("Phone verified successfully!");
        setIsVerified(true);
        setStep('phone');
        setOtp('');
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




        {/* Delivery Details Section */}
        <div className="mb-12">
          <h2 className="font-['Poppins'] font-semibold text-[40px] mb-12">
            Delivery Details
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

            {/* Right Side - Phone Verification */}
            <div className="space-y-6">
              {step === 'phone' ? (
                <>
                  {isVerified ? (
                    /* Verified Phone Display */
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Phone No*</Label>
                        <div className="flex gap-3">
                          <div className="flex-1 h-14 border-2 border-border rounded-lg px-4 flex items-center justify-between">
                            <span className="text-lg">{countryCode} {phoneNumber}</span>
                            <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                          onClick={() => {
                            const confirmed = window.confirm(
                              "Are you sure you want to change your verified phone number? You will need to verify the new number again."
                            );
                            if (confirmed) {
                              setIsVerified(false);
                              setPhoneNumber('');
                              setOtp('');
                            }
                          }}
                        >
                          Change number
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Phone Number Form */
                    <form onSubmit={handlePhoneSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone No*</Label>
                        <div className="flex gap-3">
                          {/* Country Code Selector */}
                          <Select value={countryCode} onValueChange={setCountryCode}>
                            <SelectTrigger className="w-44 h-14 border-2 border-border rounded-lg">
                              <SelectValue placeholder="Country" />
                            </SelectTrigger>
                            <SelectContent className="z-50">
                              {countryCodes.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  <div className="flex items-center gap-2">
                                    <span>{country.flag}</span>
                                    <span>{country.code}</span>
                                    <span className="text-sm text-muted-foreground">{country.country}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {/* Phone Number Input */}
                          <div className="relative flex-1">
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="1234567890"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="h-14 border-2 border-border rounded-lg text-lg"
                              required
                            />
                          </div>

                          {/* Verify Button */}
                          <Button 
                            type="submit" 
                            className="h-14 px-8 bg-black text-white hover:bg-black/90 rounded-lg font-medium"
                            disabled={loading}
                          >
                            {loading ? 'Sending...' : 'Verify'}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          We'll send you a verification code via SMS
                        </p>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <>
                  {/* OTP Verification Form */}
                  <form onSubmit={handleOTPSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-sm text-muted-foreground">Verification Code*</Label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Input
                            id="otp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="h-14 border-2 border-border rounded-lg text-lg text-center tracking-widest"
                            maxLength={6}
                            required
                          />
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="h-14 px-8 bg-black text-white hover:bg-black/90 rounded-lg font-medium"
                          disabled={loading || otp.length !== 6}
                        >
                          {loading ? 'Verifying...' : 'Verify'}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                          Enter the code we sent to {countryCode}{phoneNumber}
                        </p>
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline font-medium"
                          onClick={() => {
                            setStep('phone');
                            setOtp('');
                          }}
                        >
                          Change number
                        </button>
                      </div>
                    </div>
                  </form>
                  
                  {/* Resend code option */}
                  <div className="text-sm text-center">
                    <span className="text-muted-foreground">
                      Didn't receive the code?
                    </span>{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline font-medium"
                      onClick={() => handlePhoneSubmit({ preventDefault: () => {} } as React.FormEvent)}
                    >
                      Resend code
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Delivery Form - Show after phone verification */}
          {isVerified && (
            <div className="mt-12 space-y-8">
              {/* Enter your name and address */}
              <div>
                <h3 className="text-[20px] font-semibold mb-6">
                  Enter your name and address:
                </h3>

                <div className="space-y-6 max-w-md">
                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm">First Name*</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="h-12 border border-border rounded"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm">Last Name*</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="h-12 border border-border rounded"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm">Address*</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="Start typing a street address or postcode"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="h-12 pl-10 border border-border rounded"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      We do not ship to P.O. boxes
                    </p>
                    <button
                      type="button"
                      className="text-sm underline hover:no-underline"
                      onClick={() => setShowManualAddress(!showManualAddress)}
                    >
                      Enter address manually.
                    </button>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">Email*</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="alex@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 border border-border rounded"
                        required
                      />
                      {email && email.includes('@') && (
                        <span className="absolute right-3 top-3.5 w-2 h-2 bg-green-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A confirmation email will be sent after checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps - Removed, replaced with form */}
      </main>

      <Footer />
    </div>
  );
};

export default BookingConfirmation;

import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Gift, Phone, MessageSquare, Search, Upload, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Country codes data
const countryCodes = [{
  code: '+91',
  country: 'India',
  flag: '🇮🇳'
}, {
  code: '+1',
  country: 'United States',
  flag: '🇺🇸'
}, {
  code: '+44',
  country: 'United Kingdom',
  flag: '🇬🇧'
}, {
  code: '+86',
  country: 'China',
  flag: '🇨🇳'
}, {
  code: '+81',
  country: 'Japan',
  flag: '🇯🇵'
}, {
  code: '+49',
  country: 'Germany',
  flag: '🇩🇪'
}, {
  code: '+33',
  country: 'France',
  flag: '🇫🇷'
}, {
  code: '+39',
  country: 'Italy',
  flag: '🇮🇹'
}, {
  code: '+7',
  country: 'Russia',
  flag: '🇷🇺'
}, {
  code: '+55',
  country: 'Brazil',
  flag: '🇧🇷'
}, {
  code: '+61',
  country: 'Australia',
  flag: '🇦🇺'
}, {
  code: '+82',
  country: 'South Korea',
  flag: '🇰🇷'
}, {
  code: '+34',
  country: 'Spain',
  flag: '🇪🇸'
}, {
  code: '+52',
  country: 'Mexico',
  flag: '🇲🇽'
}, {
  code: '+31',
  country: 'Netherlands',
  flag: '🇳🇱'
}];

// Indian states list
const indianStates = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

// Cities by state (sample data - expand as needed)
const citiesByState: {
  [key: string]: string[];
} = {
  'Delhi': ['New Delhi', 'Central Delhi', 'South Delhi', 'North Delhi', 'East Delhi', 'West Delhi'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli', 'Belgaum'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
  'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala']
};
const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    product,
    selectedVariant,
    selectedColor,
    bookingAmount = 999,
    purchaseType = 'book',
    breadcrumbs = []
  } = location.state || {};
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [email, setEmail] = useState('');
  const [showManualAddress, setShowManualAddress] = useState(false);
  const [useLocationDetection, setUseLocationDetection] = useState(true);
  const [documentType, setDocumentType] = useState('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [uploadedDocument, setUploadedDocument] = useState<File | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [addressMatchChecked, setAddressMatchChecked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [userDetails, setUserDetails] = useState('');
  const {
    signInWithPhone,
    verifyOTP,
    user
  } = useAuth();

  // Calculate pricing
  const deliveryFee = 0;
  const productPrice = bookingAmount || 999;
  const subtotal = productPrice;
  const discountAmount = promoDiscount;
  const totalAmount = subtotal + deliveryFee - discountAmount;

  // Apply promo code
  const applyPromoCode = () => {
    const validPromoCodes: {
      [key: string]: number;
    } = {
      'SAVE10': subtotal * 0.1,
      'SAVE500': 500,
      'FIRST1000': 1000,
      'WELCOME': 200
    };
    const upperPromo = promoCode.toUpperCase();
    if (validPromoCodes[upperPromo]) {
      setPromoDiscount(validPromoCodes[upperPromo]);
      setPromoApplied(true);
      toast.success(`Promo code applied! You saved ₹${validPromoCodes[upperPromo]}`);
    } else {
      toast.error('Invalid promo code');
    }
  };
  const removePromoCode = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
  };

  // Detect current location
  const detectCurrentLocation = async () => {
    setDetectingLocation(true);
    try {
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by your browser');
        return;
      }
      navigator.geolocation.getCurrentPosition(async position => {
        const {
          latitude,
          longitude
        } = position.coords;

        // Use a reverse geocoding API - here using Nominatim (free)
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.address) {
            const addressData = data.address;

            // Extract and set location details
            setPincode(addressData.postcode || '');
            setCity(addressData.city || addressData.town || addressData.village || '');
            setState(addressData.state || '');

            // Build full address string from location data
            const addressParts = [];
            if (addressData.house_number) addressParts.push(addressData.house_number);
            if (addressData.road) addressParts.push(addressData.road);
            if (addressData.suburb) addressParts.push(addressData.suburb);
            const detectedAddress = addressParts.join(', ') || data.display_name || '';
            setAddress(detectedAddress);
            toast.success('Location detected successfully!');
          } else {
            toast.error('Unable to fetch location details');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          toast.error('Failed to fetch location details');
        }
        setDetectingLocation(false);
      }, error => {
        console.error('Geolocation error:', error);
        toast.error('Unable to detect location. Please enable location access.');
        setDetectingLocation(false);
      });
    } catch (error) {
      console.error('Location detection error:', error);
      toast.error('Failed to detect location');
      setDetectingLocation(false);
    }
  };
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
      const {
        error
      } = await signInWithPhone(fullPhone);
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
      const {
        error
      } = await verifyOTP(fullPhone, otp);
      if (error) {
        toast.error(error.message || "Verification Error");
      } else {
        toast.success("Phone verified successfully!");
        setIsVerified(true);
        setStep('phone');
        setOtp('');

        // Load existing profile data if available
        await loadProfileData();
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const loadProfileData = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }
      if (data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setAddress(data.street_address || '');
        setDocumentType(data.document_type || 'aadhaar');
        setAadhaarNumber(data.document_number || '');
        setConsentChecked(data.consent_given || false);
        setAddressMatchChecked(data.address_matches_id || false);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };
  const handleSaveDetails = async () => {
    if (!user) {
      toast.error('Please verify your phone number first');
      return;
    }
    if (!firstName || !lastName || !address || !email || !city || !state || !pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!consentChecked) {
      toast.error('Please consent to data processing');
      return;
    }
    setSaving(true);
    try {
      let documentUrl = null;

      // Upload document if provided (optional)
      if (uploadedDocument) {
        try {
          const fileExt = uploadedDocument.name.split('.').pop();
          const fileName = `${user.id}_${Date.now()}.${fileExt}`;
          const filePath = `id-documents/${fileName}`;
          const {
            error: uploadError
          } = await supabase.storage.from('site-assets').upload(filePath, uploadedDocument);
          if (uploadError) {
            console.error('Document upload error:', uploadError);
            toast.error('Document upload failed, but continuing with order...');
          } else {
            const {
              data: urlData
            } = supabase.storage.from('site-assets').getPublicUrl(filePath);
            documentUrl = urlData.publicUrl;
          }
        } catch (uploadError) {
          console.error('Document upload exception:', uploadError);
          toast.error('Document upload failed, but continuing with order...');
        }
      }

      // Save/update profile with all address details
      const {
        error: profileError
      } = await supabase.from('profiles').upsert({
        user_id: user.id,
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone: countryCode + phoneNumber,
        street_address: address,
        city: city,
        state_province: state,
        postal_code: pincode,
        country: 'India',
        document_type: documentType,
        document_number: aadhaarNumber || null,
        document_file_url: documentUrl,
        consent_given: consentChecked,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });
      if (profileError) {
        console.error('Profile save error:', profileError);
        toast.error('Failed to save details: ' + profileError.message);
        setSaving(false);
        return;
      }

      // Create order data
      const orderData = {
        customer_id: user.id,
        total_amount: totalAmount,
        status: 'pending',
        payment_status: 'pending',
        order_items_data: [{
          product_id: product.id,
          product_name: product.name,
          variant: selectedVariant?.name || '',
          color: selectedColor || '',
          quantity: 1,
          unit_price: productPrice,
          total_price: productPrice
        }],
        customer_details: {
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`,
          email: email,
          phone: countryCode + phoneNumber,
          mobile: countryCode + phoneNumber
        },
        delivery_address: {
          street_address: address,
          city: city,
          state_province: state,
          postal_code: pincode,
          country: 'India'
        },
        shipping_charge: deliveryFee,
        tax_amount: 0,
        discount_amount: discountAmount,
        order_summary: {
          product_price: productPrice,
          delivery_fee: deliveryFee,
          discount: discountAmount,
          promo_code: promoApplied ? promoCode : null,
          total: totalAmount
        },
        payment_method: 'payu',
        order_source: 'web',
        order_type: purchaseType === 'book' ? 'booking' : 'purchase'
      };

      // Create order in database
      const {
        data: order,
        error: orderError
      } = await supabase.from('orders').insert([orderData]).select().single();
      if (orderError) {
        console.error('Order creation error:', orderError);
        toast.error('Failed to create order: ' + orderError.message);
        setSaving(false);
        return;
      }

      // Initiate PayU payment
      const orderId = order.id;
      const productInfo = `${product.name} - ${selectedVariant?.name || 'Standard'} - ${selectedColor || 'Black'}`;
      const {
        data: payuData,
        error: payuError
      } = await supabase.functions.invoke('payu-payment', {
        body: {
          action: 'initiate_payment',
          paymentData: {
            orderId: orderId,
            amount: totalAmount,
            productInfo: productInfo,
            firstName: `${firstName} ${lastName}`,
            email: email,
            phone: countryCode + phoneNumber,
            surl: `https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/payu-webhook`,
            furl: `https://tqhwoizjlvjdiuemirsy.supabase.co/functions/v1/payu-webhook`,
            udf1: user.id,
            // Store user ID for verification
            udf2: orderId // Store order ID for verification
          }
        }
      });
      if (payuError || !payuData) {
        console.error('PayU initialization error:', payuError);
        toast.error('Failed to initialize payment: ' + (payuError?.message || 'Unknown error'));
        setSaving(false);
        return;
      }
      if (!payuData.success || !payuData.paymentParams || !payuData.payuUrl) {
        console.error('Invalid PayU response:', payuData);
        toast.error('Invalid payment response from server');
        setSaving(false);
        return;
      }

      // Create and submit the PayU form
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payuData.payuUrl;
      Object.entries(payuData.paymentParams).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value as string;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      toast.error('An error occurred while processing');
      console.error('Save error:', error);
      setSaving(false);
    }
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    return isVerified && firstName.trim() !== '' && lastName.trim() !== '' && email.trim() !== '' && address.trim() !== '' && city.trim() !== '' && state.trim() !== '' && pincode.trim() !== '' && consentChecked;
  };
  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);
  useEffect(() => {
    if (isVerified && user) {
      loadProfileData();
    }
  }, [isVerified, user]);
  if (!product) {
    return null;
  }
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  return <div className="min-h-screen bg-white flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
        <Header />
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl pt-32">
        {/* Breadcrumb */}
        <div className="md:px-4 md:py-3 md:mb-6 flex items-center gap-2 text-[14px] overflow-x-auto fixed md:relative top-24 md:top-0 left-0 md:left-auto right-0 md:right-auto z-40 md:z-auto bg-white px-4 py-3">
          {breadcrumbs.map((crumb: any, index: number) => <div key={index} className="flex items-center gap-2">
              <button onClick={() => typeof crumb.path === 'number' ? navigate(crumb.path) : navigate(crumb.path)} className="text-gray-400 hover:text-gray-600 transition-colors font-['Inter']">
                {crumb.label}
              </button>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>)}
          <span className="text-black font-semibold font-['Inter']">Order Confirmation</span>
        </div>




        {/* Main Content - Two Column Layout */}
        <div className="mb-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Product Summary */}
            <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              {/* Product Image and Details */}
              <div className="bg-[#F8F9F9] rounded-2xl flex items-center justify-center">
                <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-fill" />
              </div>

              {/* Selection Summary - Show for both booking and buy */}
              {(purchaseType === 'book' || purchaseType === 'buy') && <div className="space-y-3">
                  <Card className="border-0 bg-[#F8F9F9] rounded-none">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className={`${purchaseType === 'book' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'} hover:bg-green-50 px-6 py-2 text-sm font-medium rounded`}>
                          {purchaseType === 'book' ? 'Booking' : 'Buy a Bike'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/product-config', {
                      state: {
                        product,
                        selectedVariant,
                        selectedColor,
                        breadcrumbs
                      }
                    })} className="text-blue-600 hover:text-blue-700 hover:bg-transparent h-auto p-0 font-medium text-base">
                          Change
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Variant and Color - Outside Card */}
                  <div className="space-y-2">
                    {selectedVariant && <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Variant:</span>
                        <span className="text-sm font-medium">{selectedVariant.name}</span>
                      </div>}

                    {selectedColor && <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Color:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{selectedColor}</span>
                          <span className="w-4 h-4 rounded-full bg-black border border-gray-300"></span>
                        </div>
                      </div>}
                  </div>
                </div>}

              {/* Order Summary */}
              <div className="border-t pt-6">
                <h3 className="font-['Poppins'] font-semibold text-[24px] mb-6">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  {/* Product Price */}
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[16px] text-muted-foreground">
                      {purchaseType === 'book' ? 'Booking Amount' : 'Product Price'}
                    </span>
                    <span className="font-['Inter'] text-[16px]">₹{productPrice.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Delivery Fee */}
                  <div className="flex justify-between items-center">
                    <span className="font-['Inter'] text-[16px] text-muted-foreground">Delivery Fee</span>
                    <span className="font-['Inter'] text-[16px]">₹{deliveryFee.toLocaleString('en-IN')}</span>
                  </div>

                  {/* Promo Code Section */}
                  <div className="py-3 border-t border-b">
                    <div className="space-y-2">
                      <Label htmlFor="promoCode" className="text-sm font-medium">Have a Promo Code?</Label>
                      <div className="flex gap-2">
                        <Input id="promoCode" type="text" placeholder="Enter promo code" value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} className="h-10 flex-1" disabled={promoApplied} />
                        {!promoApplied ? <Button type="button" onClick={applyPromoCode} disabled={!promoCode.trim()} variant="outline" className="h-10 px-4">
                            Apply
                          </Button> : <Button type="button" onClick={removePromoCode} variant="outline" className="h-10 px-4">
                            Remove
                          </Button>}
                      </div>
                      {promoApplied && <p className="text-sm text-green-600 font-medium">
                          ✓ Promo code applied: {promoCode}
                        </p>}
                    </div>
                  </div>

                  {/* Discount */}
                  {discountAmount > 0 && <div className="flex justify-between items-center text-green-600">
                      <span className="font-['Inter'] text-[16px]">Discount</span>
                      <span className="font-['Inter'] text-[16px]">-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>}

                  {/* Total */}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="font-['Poppins'] text-[20px]">
                        {purchaseType === 'book' ? 'Booking Total' : 'Total Amount'}
                      </span>
                      <span className="font-['Poppins'] text-[20px] text-primary">₹{totalAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {purchaseType === 'book' ? 'Booking amount to be paid via PayU • Remaining at delivery' : 'Full amount to be paid via PayU'}
                    </p>
                  </div>

                  {discountAmount > 0 && <div className="flex items-center gap-2 text-green-600 mt-4">
                      <Gift className="w-5 h-5" />
                      <span className="font-['Inter'] text-[14px]">You are saving ₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>}
                </div>
              </div>
            </div>

            {/* Right Side - Delivery Details Form */}
            <div className="space-y-6">
              <h2 className="font-['Poppins'] font-semibold text-[32px] text-center">
                Delivery Details
              </h2>

              {/* Phone Number Section */}
              <div className="space-y-4">
                {step === 'phone' ? <>
                    {isVerified ? (/* Verified Phone Display */
                <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Phone No*</Label>
                        <div className="flex gap-3">
                          <div className="flex-1 h-12 border border-border rounded px-4 flex items-center justify-between">
                            <span className="text-base">{countryCode} {phoneNumber}</span>
                            <span className="flex items-center gap-2 text-green-600 text-sm font-medium">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            A carrier might contact you to confirm delivery
                          </p>
                          <button type="button" className="text-xs text-primary hover:underline" onClick={() => {
                      const confirmed = window.confirm("Are you sure you want to change your verified phone number? You will need to verify the new number again.");
                      if (confirmed) {
                        setIsVerified(false);
                        setPhoneNumber('');
                        setOtp('');
                      }
                    }}>
                            Change
                          </button>
                        </div>
                      </div>) : (/* Phone Number Form */
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm text-muted-foreground">Phone No*</Label>
                          <div className="flex gap-3">
                            {/* Country Code Selector */}
                            <Select value={countryCode} onValueChange={setCountryCode}>
                              <SelectTrigger className="w-32 h-12 border border-border rounded">
                                <SelectValue placeholder="Country" />
                              </SelectTrigger>
                              <SelectContent className="z-50 bg-white">
                                {countryCodes.map(country => <SelectItem key={country.code} value={country.code}>
                                    <div className="flex items-center gap-2">
                                      <span>{country.flag}</span>
                                      <span>{country.code}</span>
                                    </div>
                                  </SelectItem>)}
                              </SelectContent>
                            </Select>
                            
                            {/* Phone Number Input */}
                            <div className="relative flex-1">
                              <Input id="phone" type="tel" placeholder="3456987650" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="h-12 border border-border rounded" required />
                            </div>

                            {/* Verify Button */}
                            <Button type="submit" className="h-12 px-6 bg-black text-white hover:bg-black/90 rounded font-medium" disabled={loading}>
                              {loading ? 'Sending...' : 'Verify'}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            A carrier might contact you to confirm delivery
                          </p>
                        </div>
                      </form>)}
                  </> : <>
                    {/* OTP Verification Form */}
                    <form onSubmit={handleOTPSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm text-muted-foreground">Verification Code*</Label>
                        <div className="flex gap-3">
                          <div className="relative flex-1">
                            <Input id="otp" type="text" placeholder="Enter 6-digit code" value={otp} onChange={e => setOtp(e.target.value)} className="h-12 border border-border rounded text-lg text-center tracking-widest" maxLength={6} required />
                          </div>
                          
                          <Button type="submit" className="h-12 px-6 bg-black text-white hover:bg-black/90 rounded font-medium" disabled={loading || otp.length !== 6}>
                            {loading ? 'Verifying...' : 'Verify'}
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            Enter the code we sent to {countryCode}{phoneNumber}
                          </p>
                          <button type="button" className="text-xs text-primary hover:underline font-medium" onClick={() => {
                        setStep('phone');
                        setOtp('');
                      }}>
                            Change number
                          </button>
                        </div>
                      </div>
                    </form>
                    
                    {/* Resend code option */}
                    <div className="text-xs text-center">
                      <span className="text-muted-foreground">
                        Didn't receive the code?
                      </span>{' '}
                      <button type="button" className="text-primary hover:underline font-medium" onClick={() => handlePhoneSubmit({
                    preventDefault: () => {}
                  } as React.FormEvent)}>
                        Resend code
                      </button>
                    </div>
                  </>}
              </div>

              {/* Name and Address Form - Always visible, disabled until verified */}
              <div className="space-y-6">
                  <h3 className="text-[18px] font-semibold">
                    Enter your name and address:
                  </h3>

                  {/* First Name */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm text-muted-foreground">First Name*</Label>
                    <Input id="firstName" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} className="h-12 border border-border rounded" required disabled={!isVerified} />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm text-muted-foreground">Last Name*</Label>
                    <Input id="lastName" type="text" value={lastName} onChange={e => setLastName(e.target.value)} className="h-12 border border-border rounded" required disabled={!isVerified} />
                  </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm text-muted-foreground">Address*</Label>
                  
                  {/* Location Detection Toggle */}
                  <div className="flex gap-3 mb-4">
                    <Button type="button" variant={useLocationDetection ? "default" : "outline"} onClick={() => {
                    setUseLocationDetection(true);
                    detectCurrentLocation();
                  }} disabled={!isVerified || detectingLocation} className="flex-1 rounded-none">
                      <MapPin className="w-4 h-4 mr-2" />
                      {detectingLocation ? 'Detecting...' : 'Detect Location'}
                    </Button>
                    <Button type="button" variant={!useLocationDetection ? "default" : "outline"} onClick={() => setUseLocationDetection(false)} disabled={!isVerified} className="flex-1 rounded-none">
                      Enter Manually
                    </Button>
                  </div>

                  {useLocationDetection ? <div className="space-y-4">
                      {/* Pincode (Auto-filled, Read-only) */}
                      <div className="relative">
                        <Input id="pincode-auto" type="text" placeholder="Pincode" value={pincode} className="h-12 border border-border rounded bg-muted" required disabled={!isVerified} readOnly />
                      </div>

                      {/* City (Auto-filled, Read-only) */}
                      <div className="relative">
                        <Input id="city-auto" type="text" placeholder="City" value={city} className="h-12 border border-border rounded bg-muted" required disabled={!isVerified} readOnly />
                      </div>

                      {/* State (Auto-filled, Read-only) */}
                      <div className="relative">
                        <Input id="state-auto" type="text" placeholder="State" value={state} className="h-12 border border-border rounded bg-muted" required disabled={!isVerified} readOnly />
                      </div>

                      {/* Street Address (Editable) */}
                      <div className="relative">
                        <Input id="address" type="text" placeholder="House No, Building Name, Street" value={address} onChange={e => setAddress(e.target.value)} className="h-12 border border-border rounded" required disabled={!isVerified} />
                      </div>
                    </div> : <div className="space-y-4">
                      {/* Pincode */}
                      <div className="relative">
                        <Input id="pincode" type="text" placeholder="Enter Pincode" value={pincode} onChange={e => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setPincode(value);

                      // Auto-detect city and state based on pincode (simplified example)
                      if (value.length === 6) {
                        // This is a simplified example - in production, use a real pincode API
                        const pincodeData: {
                          [key: string]: {
                            city: string;
                            state: string;
                          };
                        } = {
                          '110001': {
                            city: 'New Delhi',
                            state: 'Delhi'
                          },
                          '400001': {
                            city: 'Mumbai',
                            state: 'Maharashtra'
                          },
                          '560001': {
                            city: 'Bangalore',
                            state: 'Karnataka'
                          },
                          '600001': {
                            city: 'Chennai',
                            state: 'Tamil Nadu'
                          },
                          '700001': {
                            city: 'Kolkata',
                            state: 'West Bengal'
                          }
                        };
                        const data = pincodeData[value];
                        if (data) {
                          setCity(data.city);
                          setState(data.state);
                        }
                      }
                    }} className="h-12 border border-border rounded" required disabled={!isVerified} maxLength={6} />
                      </div>

                      {/* City (Dropdown with auto-fill) */}
                      <div className="relative">
                        <Select value={city} onValueChange={setCity} disabled={!isVerified}>
                          <SelectTrigger className="h-12 border border-border rounded">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            {(state && citiesByState[state] || Object.values(citiesByState).flat()).map(cityName => <SelectItem key={cityName} value={cityName}>
                                {cityName}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* State (Dropdown with auto-fill) */}
                      <div className="relative">
                        <Select value={state} onValueChange={setState} disabled={!isVerified}>
                          <SelectTrigger className="h-12 border border-border rounded">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            {indianStates.map(stateName => <SelectItem key={stateName} value={stateName}>
                                {stateName}
                              </SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Street Address */}
                      <div className="relative">
                        <Input id="address" type="text" placeholder="House No, Building Name, Street" value={address} onChange={e => setAddress(e.target.value)} className="h-12 border border-border rounded" required disabled={!isVerified} />
                      </div>
                    </div>}
                  
                  <p className="text-xs text-muted-foreground">
                    We do not ship to P.O. boxes
                  </p>
                </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-muted-foreground">Email*</Label>
                    <div className="relative">
                      <Input id="email" type="email" placeholder="alex@gmail.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12 border border-border rounded" required disabled={!isVerified} />
                      {email && email.includes('@') && <span className="absolute right-3 top-4 w-2 h-2 bg-green-500 rounded-full"></span>}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      A confirmation email will be sent after checkout.
                    </p>
                  </div>

                  {/* ID Verification Section */}
                  <div className="space-y-6 pt-8 border-t">
                    <div>
                      <h3 className="text-[18px] font-semibold mb-2">
                        ID Verification for Registration
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Provide your valid ID information to verify your booking and enable vehicle registration. Your details help us ensure a secure and compliant delivery experience.
                      </p>
                    </div>


                    {/* Document Type Dropdown */}
                    <div className="space-y-2">
                      <Label htmlFor="documentType" className="text-sm text-muted-foreground">Document Type</Label>
                      <Select value={documentType} onValueChange={setDocumentType} disabled={!isVerified}>
                        <SelectTrigger className="h-12 border border-border rounded">
                          <SelectValue placeholder="Select document type" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-white">
                          <SelectItem value="aadhaar">Aadhaar Card</SelectItem>
                          <SelectItem value="pan">PAN Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="driving_license">Driving License</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Aadhaar Number */}
                    <div className="space-y-2">
                      <Label htmlFor="aadhaarNumber" className="text-sm text-muted-foreground">Aadhaar Number</Label>
                      <Input id="aadhaarNumber" type="text" placeholder="Enter Aadhaar number" value={aadhaarNumber} onChange={e => setAadhaarNumber(e.target.value)} className="h-12 border border-border rounded" disabled={!isVerified} maxLength={12} />
                    </div>

                    {/* Consent Checkbox */}
                    <div className="flex items-start gap-3">
                      <Checkbox id="consent" checked={consentChecked} onCheckedChange={checked => setConsentChecked(checked as boolean)} disabled={!isVerified} className="mt-1" />
                      <label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        I have read and consent to Yakuza EV and its authorized logistics partners processing my information in accordance with the [Privacy Policy] and [Terms of Use].
                      </label>
                    </div>
                  </div>

                  {/* Upload ID Section */}
                  <div className="space-y-6 pt-6">
                    <div>
                      <h3 className="text-[18px] font-semibold mb-2">
                        Upload ID
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Ensure that your name, photograph, and ID number are clearly visible on the uploaded image to avoid processing delays.
                      </p>
                    </div>

                    {/* Upload Area */}
                    <div className={`border-2 border-dashed border-border rounded-lg p-8 ${!isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <label htmlFor="document-upload" className={`flex flex-col items-center justify-center ${isVerified ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                        <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                        <span className="text-sm font-medium text-foreground">
                          {uploadedDocument ? uploadedDocument.name : 'Click to Upload Document'}
                        </span>
                        <span className="text-xs text-muted-foreground mt-1">
                          JPG or PNG format
                        </span>
                        <input id="document-upload" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setUploadedDocument(file);
                        toast.success('Document uploaded successfully');
                      }
                    }} className="hidden" disabled={!isVerified} />
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Only .jpg and .jpeg files are allowed.
                    </p>

                  </div>
                </div>
              

              {/* Shipping Section */}
              <div className="space-y-6 pt-8 border-t">
                <h3 className="text-[24px] font-semibold">
                  Shipping
                </h3>

                {/* Selected Address Display */}
                {(address || city || state) && <div className="p-4 bg-accent/30 rounded-lg border border-border">
                    <p className="text-sm font-medium mb-2">Delivery Address:</p>
                    <p className="text-sm text-muted-foreground">
                      {firstName} {lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {address}
                      {city && `, ${city}`}
                      {state && `, ${state}`}
                      {pincode && ` - ${pincode}`}
                    </p>
                    {phoneNumber && <p className="text-sm text-muted-foreground">
                        Phone: {countryCode} {phoneNumber}
                      </p>}
                  </div>}

                <div className="space-y-4">
                  <p className="text-[18px] text-muted-foreground">
                    ₹ 1,250.00 Delivery Fee
                  </p>

                  <div className="space-y-2">
                    <p className="text-base font-medium">Yakuza Shipment #1</p>
                    <p className="text-sm text-muted-foreground">
                      Expected Arrival: Tue, 14 Oct – Tue, 21 Oct
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is a verified domestic shipment handled by Yakuza's certified logistics partner.
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center">
                    By clicking Place Order, you agree to the Yakuza EV{' '}
                    <a href="/terms" className="underline hover:no-underline">
                      Terms & Conditions
                    </a>
                  </p>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="pt-6">
                <Button onClick={handleSaveDetails} disabled={!isFormValid() || saving} className="w-full h-14 bg-black text-white hover:bg-black/90 rounded font-medium text-[18px] disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Processing...' : 'Pay with PayU'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps - Removed, replaced with form */}
      </main>

      <Footer />
    </div>;
};
export default BookingConfirmation;
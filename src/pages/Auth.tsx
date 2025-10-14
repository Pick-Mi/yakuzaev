import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import authScooterImage from '@/assets/auth-scooter.png';
import { useIsMobile } from '@/hooks/use-mobile';

const COUNTRIES = [
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+1', name: 'USA', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
];

const Auth = () => {
  const location = useLocation();
  const shouldShowSignUp = location.state?.showSignUp || false;
  
  const [step, setStep] = useState<'phone' | 'otp' | 'email' | 'profile'>('phone');
  const [isSignUp, setIsSignUp] = useState(shouldShowSignUp);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showProfileSuccessDialog, setShowProfileSuccessDialog] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  
  const { signInWithPhone, verifyOTP, signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    // Don't auto-redirect if we're showing the success dialog or in OTP flow
    if (user && !showSuccessDialog && !showProfileSuccessDialog && step !== 'otp') {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from, showSuccessDialog, showProfileSuccessDialog, step]);

  useEffect(() => {
    if (otpCooldown > 0) {
      const timer = setTimeout(() => setOtpCooldown(otpCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCooldown]);

  const validatePhoneNumber = (fullPhone: string): string | null => {
    const cleaned = fullPhone.replace(/[^\d+]/g, '');
    if (!cleaned.startsWith('+')) {
      return 'Phone number must start with country code (e.g., +1)';
    }
    const digits = cleaned.substring(1);
    if (digits.length < 10 || digits.length > 15) {
      return 'Phone number must be between 10-15 digits';
    }
    return null;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCooldown > 0) {
      toast({
        title: "Please Wait",
        description: `You can request a new OTP in ${otpCooldown} seconds.`,
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    const fullPhone = countryCode + phoneNumber;
    const validationError = validatePhoneNumber(fullPhone);
    if (validationError) {
      toast({
        title: "Invalid Phone Number",
        description: validationError,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await signInWithPhone(fullPhone);

      if (error) {
        // Check if it's a rate limit error
        if (error.message.includes('security purposes') || error.message.includes('rate')) {
          const waitTime = 60; // Default to 60 seconds
          setOtpCooldown(waitTime);
          toast({
            title: "Too Many Requests",
            description: `Please wait ${waitTime} seconds before requesting another OTP.`,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Phone Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        setOtpCooldown(60); // Set 60 second cooldown after successful send
        toast({
          title: "OTP Sent!",
          description: "Please check your phone for the verification code.",
        });
        setStep('otp');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
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
        toast({
          title: "Incorrect OTP",
          description: "The verification code you entered is incorrect. Please try again.",
          variant: "destructive",
        });
        setOtp(''); // Clear OTP input
        setLoading(false);
        return;
      }

      // Get the authenticated user session
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        // Update profile with phone number
        await supabase
          .from('profiles')
          .update({ phone: fullPhone })
          .eq('user_id', session.session.user.id);

        // Check if user already has a complete profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name, email')
          .eq('user_id', session.session.user.id)
          .single();

        // If profile exists with required fields, redirect to home
        if (profile && profile.first_name && profile.email) {
          toast({
            title: "Welcome Back!",
            description: "You have been signed in successfully.",
          });
          navigate(from, { replace: true });
          return;
        }
      }

      // New user - show success dialog and redirect to profile setup
      setShowSuccessDialog(true);
    } catch (error: any) {
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setOtp(''); // Clear OTP input
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Profile submit started', { firstName, lastName, profileEmail });
    
    if (!firstName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your first name",
        variant: "destructive",
      });
      return;
    }

    if (!profileEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("No user session found");
      }

      console.log('Updating profile for user:', session.session.user.id);

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: profileEmail.trim(),
        })
        .eq('user_id', session.session.user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      console.log('Profile updated successfully, showing dialog');
      // Show success dialog instead of navigating directly
      setShowProfileSuccessDialog(true);
    } catch (error: any) {
      console.error('Profile submit error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isSignUp 
        ? await signUpWithEmail(email, password)
        : await signInWithEmail(email, password);

      if (error) {
        toast({
          title: isSignUp ? "Sign Up Error" : "Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        if (isSignUp) {
          toast({
            title: "Account Created!",
            description: "Please check your email to verify your account.",
          });
        } else {
          toast({
            title: "Welcome!",
            description: "You have been signed in successfully.",
          });
          navigate(from, { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google Sign In Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <AlertDialogHeader>
              <AlertDialogTitle className="text-3xl font-normal text-gray-900">
                Successfully
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600 pt-2">
                Your mobile number {countryCode}{phoneNumber} has been verified successfully!
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* CTA Button */}
            <AlertDialogFooter className="w-full pt-4">
              <Button
                onClick={() => {
                  setShowSuccessDialog(false);
                  navigate('/profile-setup', { replace: true });
                }}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-base font-medium"
              >
                Set up your basic information
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Profile Success Dialog */}
      <AlertDialog open={showProfileSuccessDialog} onOpenChange={setShowProfileSuccessDialog}>
        <AlertDialogContent className="max-w-md p-8">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Success Icon */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            
            {/* Title */}
            <AlertDialogHeader>
              <AlertDialogTitle className="text-3xl font-normal text-gray-900">
                Successfully
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base text-gray-600 pt-2">
                Your journey with Yakuza starts here – successfully signed up.
              </AlertDialogDescription>
            </AlertDialogHeader>
            
            {/* CTA Button */}
            <AlertDialogFooter className="w-full pt-4">
              <Button
                onClick={() => {
                  setShowProfileSuccessDialog(false);
                  navigate(from, { replace: true });
                }}
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-base font-medium"
              >
                Explore Product
              </Button>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>

    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Mobile View - Bottom Sheet Style */}
      {isMobile ? (
        <div className="fixed inset-0 flex flex-col z-50">
          {/* Header spacer */}
          <div className="h-[120px] flex-shrink-0" />
          
          {/* Backdrop overlay */}
          <div className="flex-1 relative bg-black/50 backdrop-blur-sm overflow-hidden">
            {/* Background image */}
            <img 
              src={authScooterImage} 
              alt="Scooter" 
              className="w-full h-full object-cover opacity-30"
            />
          </div>
          
          {/* Bottom Sheet Popup */}
          <div className="bg-white shadow-2xl animate-slide-in-bottom relative">
            {/* Close button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute right-6 top-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            <div className="p-8 pb-12 space-y-6">
              {/* Title and Description - Only for phone step */}
              {step === 'phone' && (
                <div className="space-y-3 pr-8">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Create a Quick Note
                  </h1>
                  <p className="text-gray-600 text-base leading-relaxed">
                    You don't have an account yet. Create one to save your notes securely across devices.
                  </p>
                </div>
              )}

              {/* Phone Form Only */}
              {step === 'phone' && (
                <div className="space-y-6">
                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex gap-3 items-center bg-white border-2 border-gray-300 rounded-xl px-4 py-4 hover:border-gray-400 focus-within:border-gray-900 transition-colors">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[90px] border-0 bg-transparent p-0 h-auto gap-1 focus:ring-0 focus:ring-offset-0">
                            <SelectValue>
                              <div className="flex items-center gap-1 text-gray-900">
                                <span className="text-2xl">{COUNTRIES.find(c => c.code === countryCode)?.flag || '🇮🇳'}</span>
                                <span className="font-semibold text-base">{countryCode}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{country.flag}</span>
                                  <span>{country.name}</span>
                                  <span className="text-muted-foreground">{country.code}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="border-0 bg-transparent p-0 h-auto text-base font-normal focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
                          required
                        />
                      </div>
                    </div>
                    
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Desktop View - Original Layout */
        <div className="flex min-h-[calc(100vh-120px)] mt-[120px] lg:p-[70px]">
          {/* Left Side - Image Background (Desktop) */}
          <div className="hidden lg:block lg:w-1/2 bg-black relative overflow-hidden">
            <img 
              src={authScooterImage} 
              alt="Scooter" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Right Side - Auth Form */}
          <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8 relative z-10">
              {/* Title and Description */}
              <div className="space-y-4">
                <h1 className="text-4xl font-normal text-gray-900">
                  {step === 'email' ? (isSignUp ? 'Create Account' : 'Welcome Back') :
                   step === 'phone' ? 'Create a Quick Note' :
                   step === 'profile' ? 'Complete Your Profile' : 'Verify Your Number'}
                </h1>
                <p className="text-gray-600 text-base leading-relaxed">
                  {step === 'email' ? (isSignUp ? 'Create your account to get started' : 'Sign in to your account') :
                   step === 'phone' ? "You don't have an account yet. Create one to save your notes securely across devices." :
                   step === 'profile' ? 'Please provide your name to continue' :
                   `We sent a verification code to ${countryCode}${phoneNumber}`}
                </p>
              </div>

              {/* Forms */}
              {step === 'email' ? (
                <div className="space-y-6">
                  <Button
                    variant="outline"
                    className="w-full h-12 text-base rounded-none"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Continue with Google
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-4 text-gray-500">Or</span>
                    </div>
                  </div>

                  <form onSubmit={handleEmailSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 text-sm">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200 text-base rounded-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 text-sm">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-12 bg-gray-50 border-gray-200 text-base pr-10 rounded-none"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium rounded-none"
                      disabled={loading}
                    >
                      {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : 
                       (isSignUp ? 'Create Account' : 'Sign In')}
                    </Button>
                  </form>

                  <div className="text-center text-sm text-gray-600">
                    <span>
                      {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </span>{' '}
                    <button
                      type="button"
                      className="text-gray-900 hover:underline font-medium"
                      onClick={() => setIsSignUp(!isSignUp)}
                    >
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setStep('phone')}
                    >
                      Or sign in with phone number
                    </button>
                  </div>
                </div>
              ) : step === 'phone' ? (
                <div className="space-y-6">
                  <form onSubmit={handlePhoneSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex gap-3 items-center bg-gray-50 border border-gray-200 rounded-none px-4 py-3">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[140px] border-0 bg-transparent p-0 h-auto gap-2 focus:ring-0 focus:ring-offset-0">
                            <SelectValue>
                              <div className="flex items-center gap-2 text-gray-900">
                                <span className="text-xl">{COUNTRIES.find(c => c.code === countryCode)?.flag || '🇮🇳'}</span>
                                <span className="font-medium">{countryCode}</span>
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {COUNTRIES.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{country.flag}</span>
                                  <span>{country.name}</span>
                                  <span className="text-muted-foreground">{country.code}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter Phone Number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="border-0 bg-transparent p-0 h-auto text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                          required
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium rounded-none"
                      disabled={loading || otpCooldown > 0}
                    >
                      {loading ? 'Sending...' : otpCooldown > 0 ? `Wait ${otpCooldown}s` : 'Next'}
                    </Button>
                  </form>

                  <div className="text-center text-xs text-gray-500">
                    By continuing, you agree to{' '}
                    <Link to="/terms" className="underline hover:text-gray-700">T&C</Link>
                    {' & '}
                    <Link to="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
                  </div>

                </div>
              ) : step === 'profile' ? (
                <div className="space-y-6">
                  <form onSubmit={handleProfileSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-700 text-sm">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200 text-base rounded-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-700 text-sm">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200 text-base rounded-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profileEmail" className="text-gray-700 text-sm">Email *</Label>
                      <Input
                        id="profileEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="h-12 bg-gray-50 border-gray-200 text-base rounded-none"
                        required
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium rounded-none"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Continue'}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-normal text-gray-900">Verify Phone Number</h2>
                    <p className="text-gray-600 text-sm">
                      Check Your SMS messages. We've sent you the PIN at {countryCode}{phoneNumber.substring(0, 3)}******{phoneNumber.substring(phoneNumber.length - 2)}
                    </p>
                    <button
                      type="button"
                      className="text-blue-600 text-sm font-medium hover:underline"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to change your mobile number? You will need to enter a new number and verify it again.')) {
                          setStep('phone');
                          setOtp('');
                        }
                      }}
                    >
                      Change Mobile Number
                    </button>
                  </div>

                  <form onSubmit={handleOTPSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="otp" className="text-gray-700 text-sm font-medium">OTP</Label>
                      <div className="flex gap-3">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <div key={index} className="flex-1">
                            <Input
                              type="text"
                              maxLength={1}
                              value={otp[index] || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.match(/^[0-9]$/)) {
                                  const newOtp = otp.split('');
                                  newOtp[index] = value;
                                  setOtp(newOtp.join(''));
                                  // Auto-focus next input
                                  if (index < 5 && e.target.parentElement?.parentElement) {
                                    const nextInput = e.target.parentElement.parentElement.children[index + 1]?.querySelector('input') as HTMLInputElement;
                                    nextInput?.focus();
                                  }
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Backspace' && !otp[index] && index > 0 && e.target instanceof HTMLInputElement) {
                                  const prevInput = (e.target.parentElement?.parentElement?.children[index - 1] as HTMLElement)?.querySelector('input') as HTMLInputElement;
                                  prevInput?.focus();
                                }
                              }}
                              className="w-full h-12 text-center text-xl bg-gray-50 border-gray-200 rounded-none"
                              required={index === 0}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium rounded-none"
                      disabled={loading || otp.length < 6}
                    >
                      {loading ? 'Verifying...' : 'Verify'}
                    </Button>
                  </form>

                  <div className="text-center text-sm text-gray-600">
                    Didn't receive SMS?{' '}
                    <button
                      type="button"
                      className="text-blue-600 font-medium hover:underline"
                      onClick={handlePhoneSubmit}
                    >
                      Resend Code
                    </button>
                  </div>

                  <div className="text-center text-xs text-gray-500 pt-4">
                    By continuing, you agree to{' '}
                    <Link to="/terms" className="underline hover:text-gray-700">T&C</Link>
                    {' & '}
                    <Link to="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {!isMobile && <Footer />}
    </div>
    </>
  );
};

export default Auth;

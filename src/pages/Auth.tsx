import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Chrome, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  const { signInWithPhone, verifyOTP, signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

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
        toast({
          title: "Phone Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
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
          title: "Verification Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', session.session.user.id)
            .single();

          if (!profile || !profile.first_name) {
            setFirstName(profile?.first_name || '');
            setLastName(profile?.last_name || '');
            setStep('profile');
            setLoading(false);
            return;
          }
        }

        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate(from, { replace: true });
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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your first name",
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

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
        .eq('user_id', session.session.user.id);

      if (error) throw error;

      toast({
        title: "Welcome!",
        description: "Your profile has been saved successfully.",
      });
      navigate(from, { replace: true });
    } catch (error: any) {
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
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-h-[calc(100vh-120px)] mt-[120px]">
        {/* Left Side - Dark Background */}
        <div className="hidden lg:block lg:w-1/2 bg-black"></div>
        
        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
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
                  className="w-full h-12 text-base"
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
                      className="h-12 bg-gray-50 border-gray-200 text-base"
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
                        className="h-12 bg-gray-50 border-gray-200 text-base pr-10"
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
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium"
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
                    <div className="flex gap-3 items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-900">
                        <span className="text-xl">🇮🇳</span>
                        <span className="font-medium">{countryCode}</span>
                      </div>
                      
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
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Next'}
                  </Button>
                </form>

                <div className="text-center text-xs text-gray-500">
                  By continuing, you agree to{' '}
                  <Link to="/terms" className="underline hover:text-gray-700">T&C</Link>
                  {' & '}
                  <Link to="/privacy" className="underline hover:text-gray-700">Privacy Policy</Link>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setStep('email')}
                  >
                    Or sign in with email
                  </button>
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
                      className="h-12 bg-gray-50 border-gray-200 text-base"
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
                      className="h-12 bg-gray-50 border-gray-200 text-base"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Continue'}
                  </Button>
                </form>
              </div>
            ) : (
              <div className="space-y-6">
                <form onSubmit={handleOTPSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-gray-700 text-sm">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="h-12 bg-gray-50 border-gray-200 text-base text-center text-2xl tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white text-base font-medium"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setStep('phone')}
                  >
                    use phone number instead
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-900"
                    onClick={() => setStep('email')}
                  >
                    use email instead
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Phone, Chrome, MessageSquare, Mail, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

const Auth = () => {
  const location = useLocation();
  const shouldShowSignUp = location.state?.showSignUp || false;
  
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('phone');
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
        // Check if profile exists
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', session.session.user.id)
            .single();

          // If no first_name, show profile form
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
      <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
         <div className="w-full max-w-md">
        
        <Card className="shadow-xl border-0 bg-gradient-card">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl font-bold">
              {step === 'email' ? (isSignUp ? 'Create Account' : 'Welcome Back') :
               step === 'phone' ? 'Sign In with Phone' :
               step === 'profile' ? 'Complete Your Profile' : 'Enter Verification Code'}
            </CardTitle>
            <CardDescription>
              {step === 'email' ? (isSignUp ? 'Create your account to get started' : 'Sign in to your account') :
               step === 'phone' ? 'Enter your mobile number to get started' :
               step === 'profile' ? 'Please provide your name to continue' :
               `We sent a verification code to ${countryCode}${phoneNumber}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 'email' ? (
              <>
                {/* Google Sign In */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <Chrome className="w-4 h-4" />
                  Continue with Google
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : 
                     (isSignUp ? 'Create Account' : 'Sign In')}
                  </Button>
                </form>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  </span>{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                    onClick={() => setIsSignUp(!isSignUp)}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setStep('phone')}
                  >
                    Or sign in with phone number
                  </button>
                </div>
              </>
            ) : step === 'phone' ? (
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

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setStep('email')}
                  >
                    Or sign in with email
                  </button>
                </div>
              </>
            ) : step === 'profile' ? (
              <>
                {/* Profile Completion Form */}
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Enter your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="hero" 
                    className="w-full" 
                    disabled={loading || !firstName.trim()}
                  >
                    {loading ? 'Saving...' : 'Continue'}
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
                  {' or '}
                  <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                    onClick={() => setStep('email')}
                  >
                    use email instead
                  </button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
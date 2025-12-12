import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.svg";
import { Mail } from "lucide-react";

type Step = "welcome" | "email" | "otp" | "signing-in" | "form";

const DealerApplicationFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("dealer_application_email", user.email || "");
      navigate("/dealer-application-form");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setCurrentStep("signing-in");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dealer-application-form`,
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error);
        toast.error(error.message || 'Failed to sign in with Google. Please try again.');
        setCurrentStep("welcome");
        setIsSigningIn(false);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong. Please try again.');
      setCurrentStep("welcome");
      setIsSigningIn(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSendingOtp(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-email-otp', {
        body: { email: email.toLowerCase() }
      });

      if (error) {
        console.error('Error sending OTP:', error);
        toast.error('Failed to send verification code. Please try again.');
        setIsSendingOtp(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setIsSendingOtp(false);
        return;
      }

      sessionStorage.setItem("dealer_application_email", email);
      toast.success(`Verification code sent to ${email}`);
      setCurrentStep("otp");
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-email-otp', {
        body: { email: email.toLowerCase(), otp }
      });

      if (error) {
        console.error('Error verifying OTP:', error);
        toast.error('Failed to verify code. Please try again.');
        setIsVerifying(false);
        return;
      }

      if (data?.error) {
        toast.error(data.error);
        setIsVerifying(false);
        return;
      }

      toast.success("Email verified successfully!");
      navigate("/dealer-application-form");
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const renderWelcome = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-normal leading-tight">
            Submit your business<br />details for onboarding?
          </h1>
          <p className="text-lg text-muted-foreground">
            We'll set you up and running in four 6 steps!
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <Button 
            className="w-full px-8 h-12 text-base bg-black text-white hover:bg-black/90 rounded-none"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button 
            variant="outline"
            className="w-full px-8 h-12 text-base rounded-none border-black"
            onClick={() => setCurrentStep("email")}
          >
            <Mail className="w-5 h-5 mr-2" />
            Continue with Email
          </Button>
        </div>
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white p-8 md:p-12 shadow-sm">
        <div className="text-center space-y-3 mb-8">
          <h2 className="text-2xl md:text-3xl font-normal">
            Enter your email ID to log in.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We'll send you a verification code to confirm your email address.
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-normal">
              Email ID
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background"
              required
            />
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Button 
              type="submit"
              disabled={isSendingOtp}
              className="px-10 h-12 bg-black text-white hover:bg-black/90 rounded-none"
            >
              {isSendingOtp ? "Sending..." : "Send Verification Code"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => setCurrentStep("welcome")}
              className="text-sm"
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-12 md:p-16 shadow-sm">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-2xl md:text-3xl font-normal">
            Verify your email
          </h2>
          <p className="text-sm">
            We emailed you a six digit code to <span className="font-medium">{email}</span>
            <br />
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={() => setCurrentStep("email")}
            >
              Change
            </Button>{" "}
            enter the code below to confirm your email address.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex justify-center gap-3">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} className="w-12 h-12 text-xl" />
                <InputOTPSlot index={1} className="w-12 h-12 text-xl" />
                <InputOTPSlot index={2} className="w-12 h-12 text-xl" />
                <InputOTPSlot index={3} className="w-12 h-12 text-xl" />
                <InputOTPSlot index={4} className="w-12 h-12 text-xl" />
                <InputOTPSlot index={5} className="w-12 h-12 text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center text-sm">
            If you didn't receive a code ?{" "}
            <Button
              type="button"
              variant="link"
              disabled={isSendingOtp}
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={async () => {
                setOtp("");
                await handleEmailSubmit({ preventDefault: () => {} } as React.FormEvent);
              }}
            >
              {isSendingOtp ? "Sending..." : "Resend"}
            </Button>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleOTPVerify}
              disabled={isVerifying || otp.length !== 6}
              className="px-12 h-12 bg-black text-white hover:bg-black/90 rounded-none"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSigningIn = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="text-lg text-muted-foreground">
          Redirecting to Google Sign-in...
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <img src={logo} alt="Yakuza" className="h-8" />
          <p className="text-sm text-muted-foreground">
            Copyright © 2025 Yakuza
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {currentStep === "welcome" && renderWelcome()}
        {currentStep === "email" && renderEmailStep()}
        {currentStep === "otp" && renderOTPStep()}
        {currentStep === "signing-in" && renderSigningIn()}
      </main>

      {/* Copyright Footer */}
      <footer className="py-6">
      </footer>
    </div>
  );
};

export default DealerApplicationFlow;

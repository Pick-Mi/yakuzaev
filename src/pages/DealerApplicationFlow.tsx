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

type Step = "welcome" | "email" | "otp";

const DealerApplicationFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (user) {
      sessionStorage.setItem("dealer_application_email", user.email || "");
      navigate("/dealer-application-form");
    }
  }, [user, navigate]);

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
            We'll set you up and running in 6 steps!
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <Button 
            className="px-12 h-12 text-base bg-black text-white hover:bg-black/90 rounded-none"
            onClick={() => setCurrentStep("email")}
          >
            Get Started
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
      </main>

      {/* Copyright Footer */}
      <footer className="py-6">
      </footer>
    </div>
  );
};

export default DealerApplicationFlow;

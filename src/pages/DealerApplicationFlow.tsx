import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Settings, User } from "lucide-react";
import logo from "@/assets/logo.svg";

type Step = "welcome" | "email" | "otp" | "form";

const DealerApplicationFlow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Test OTP for development
  const TEST_OTP = "123456";

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Store email in session storage for later use
    sessionStorage.setItem("dealer_application_email", email);
    
    toast.success(`OTP sent to ${email}`);
    toast.info(`Test OTP: ${TEST_OTP}`, { duration: 10000 });
    setCurrentStep("otp");
  };

  const handleOTPVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsVerifying(true);

    // For testing, accept the test OTP
    if (otp === TEST_OTP) {
      toast.success("Email verified successfully!");
      setCurrentStep("form");
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
    
    setIsVerifying(false);
  };

  const renderWelcome = () => (
    <div className="min-h-[80vh] flex items-start pt-32 px-4">
      <div className="max-w-4xl w-full space-y-6">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-normal leading-tight">
            Submit your business<br />details for onboarding?
          </h1>
          <p className="text-lg text-muted-foreground">
            We'll set you up and running in four 6 steps!
          </p>
        </div>

        <Button 
          className="px-8 h-12 text-base bg-black text-white hover:bg-black/90 rounded-none"
          onClick={() => setCurrentStep("email")}
        >
          Let's Do it
        </Button>
      </div>
    </div>
  );

  const renderEmailStep = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Verify Your Email</h2>
          <p className="text-muted-foreground">
            Enter your email address to receive a verification code
          </p>
        </div>

        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full h-12 bg-black text-white hover:bg-black/90"
          >
            Send Verification Code
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setCurrentStep("welcome")}
          >
            Back
          </Button>
        </form>
      </div>
    </div>
  );

  const renderOTPStep = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Enter Verification Code</h2>
          <p className="text-muted-foreground">
            We've sent a 6-digit code to {email}
          </p>
          <p className="text-sm font-mono bg-muted p-2 rounded mt-4">
            Test OTP: {TEST_OTP}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button 
            onClick={handleOTPVerify}
            disabled={isVerifying || otp.length !== 6}
            className="w-full h-12 bg-black text-white hover:bg-black/90"
          >
            {isVerifying ? "Verifying..." : "Verify Code"}
          </Button>

          <div className="text-center space-y-2">
            <Button
              type="button"
              variant="link"
              onClick={() => handleEmailSubmit(new Event("submit") as any)}
            >
              Resend Code
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setCurrentStep("email")}
            >
              Change Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormStep = () => {
    // Redirect to actual application form page
    navigate("/dealer-application-form");
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <img src={logo} alt="Yakuza" className="h-8" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16">
        {currentStep === "welcome" && renderWelcome()}
        {currentStep === "email" && renderEmailStep()}
        {currentStep === "otp" && renderOTPStep()}
        {currentStep === "form" && renderFormStep()}
      </main>

      {/* Copyright Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground">
        Copyright © 2025 Yakuza
      </footer>
    </div>
  );
};

export default DealerApplicationFlow;

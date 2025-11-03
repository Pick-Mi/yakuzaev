import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
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
  const TEST_OTP = "1234";

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
    if (otp.length !== 4) {
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-6 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-normal leading-tight">
            Submit your business<br />details for onboarding?
          </h1>
          <p className="text-lg text-muted-foreground">
            We'll set you up and running in four 6 steps!
          </p>
        </div>

        <div className="flex justify-center">
          <Button 
            className="px-8 h-12 text-base bg-black text-white hover:bg-black/90 rounded-none"
            onClick={() => setCurrentStep("email")}
          >
            Let's Do it
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
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.<br />
            Lorem Ipsum has been the industry's standard dummy text
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
              placeholder="Placeholder"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background"
              required
            />
          </div>

          <div className="flex flex-col items-center gap-4 pt-4">
            <Button 
              type="submit"
              className="px-10 h-12 bg-black text-white hover:bg-black/90 rounded-none"
            >
              Continue
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
            Verify your Authenticator app
          </h2>
          <p className="text-sm">
            We emailed you a four digit code to <span className="font-medium">{email}</span>
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
              maxLength={4}
              value={otp}
              onChange={(value) => setOtp(value)}
            >
              <InputOTPGroup className="gap-3">
                <InputOTPSlot index={0} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={1} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={2} className="w-14 h-14 text-xl" />
                <InputOTPSlot index={3} className="w-14 h-14 text-xl" />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="text-center text-sm">
            If you didn't receive a code ?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-blue-600 hover:text-blue-700"
              onClick={() => handleEmailSubmit(new Event("submit") as any)}
            >
              Resend
            </Button>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleOTPVerify}
              disabled={isVerifying || otp.length !== 4}
              className="px-12 h-12 bg-black text-white hover:bg-black/90 rounded-none"
            >
              {isVerifying ? "Verifying..." : "Verify"}
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
        {currentStep === "form" && renderFormStep()}
      </main>

      {/* Copyright Footer */}
      <footer className="py-6">
      </footer>
    </div>
  );
};

export default DealerApplicationFlow;

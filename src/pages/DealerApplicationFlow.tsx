import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Become a Dealer Partner
          </h1>
          <p className="text-lg text-muted-foreground">
            Join our growing network of dealers and help us revolutionize electric mobility
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="p-6 border rounded-lg">
            <div className="text-3xl font-bold mb-2">500+</div>
            <p className="text-sm text-muted-foreground">Active Dealers</p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="text-3xl font-bold mb-2">₹50L+</div>
            <p className="text-sm text-muted-foreground">Avg. Revenue</p>
          </div>
          <div className="p-6 border rounded-lg">
            <div className="text-3xl font-bold mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">Support</p>
          </div>
        </div>

        <Button 
          size="lg"
          className="px-12 h-14 text-lg bg-black text-white hover:bg-black/90"
          onClick={() => setCurrentStep("email")}
        >
          Get Started
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {currentStep === "welcome" && renderWelcome()}
        {currentStep === "email" && renderEmailStep()}
        {currentStep === "otp" && renderOTPStep()}
        {currentStep === "form" && renderFormStep()}
      </main>
      <Footer />
    </div>
  );
};

export default DealerApplicationFlow;

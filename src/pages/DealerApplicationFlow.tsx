import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.svg";

type Step = "welcome" | "verifying" | "form";

const DealerApplicationFlow = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (user) {
      // User is authenticated, store email and proceed to form
      sessionStorage.setItem("dealer_application_email", user.email || "");
      setCurrentStep("form");
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setCurrentStep("verifying");

    try {
      const { error } = await signInWithGoogle();

      if (error) {
        console.error('Error signing in with Google:', error);
        toast.error('Failed to sign in with Google. Please try again.');
        setCurrentStep("welcome");
        setIsSigningIn(false);
        return;
      }

      // The OAuth flow will redirect, so we don't need to do anything else here
      // The useEffect above will handle the redirect after successful auth
    } catch (err) {
      console.error('Error:', err);
      toast.error('Something went wrong. Please try again.');
      setCurrentStep("welcome");
    } finally {
      setIsSigningIn(false);
    }
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

        <div className="flex flex-col items-center gap-4">
          <Button 
            className="px-8 h-12 text-base bg-black text-white hover:bg-black/90 rounded-none"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? "Signing in..." : "Let's Do it"}
          </Button>
          <p className="text-sm text-muted-foreground">
            Sign in with Google to continue
          </p>
        </div>
      </div>
    </div>
  );

  const renderVerifying = () => (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white p-8 md:p-12 shadow-sm text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-black border-t-transparent rounded-full animate-spin" />
          <h2 className="text-2xl md:text-3xl font-normal">
            Verifying your account...
          </h2>
          <p className="text-sm text-muted-foreground">
            Please complete the Google sign-in in the popup window.
          </p>
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
        {currentStep === "verifying" && renderVerifying()}
        {currentStep === "form" && renderFormStep()}
      </main>

      {/* Copyright Footer */}
      <footer className="py-6">
      </footer>
    </div>
  );
};

export default DealerApplicationFlow;

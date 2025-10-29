import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

const steps = [
  "Basic Info",
  "Choose Location",
  "Investment & Space",
  "Business Background",
  "Upload Docs",
  "Confirm & Submit"
];

const DealerApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    city: "",
    state: "",
    pincode: "",
    areaType: "",
    preferredLocation: "",
    investmentCapacity: "",
    spaceAvailable: "",
    businessName: "",
    yearsInBusiness: "",
    businessType: "",
    experience: "",
    documents: [] as File[],
    agreeToTerms: false,
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and get back to you soon.",
    });
    navigate("/become-dealer");
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/become-dealer")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Dealer Info
        </button>

        {/* Progress Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="flex items-center w-full">
                  {index > 0 && (
                    <div className={`flex-1 h-0.5 ${index <= currentStep ? 'bg-foreground' : 'bg-border'}`} />
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      index === currentStep
                        ? 'bg-foreground'
                        : index < currentStep
                        ? 'bg-foreground'
                        : 'bg-transparent border-2 border-border'
                    }`}
                  >
                    {index < currentStep && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 ${index < currentStep ? 'bg-foreground' : 'bg-border'}`} />
                  )}
                </div>
                <span className={`text-xs sm:text-sm mt-2 text-center ${
                  index === currentStep ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-2">
            Join It. Power It. Own It.
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Choose Your Dealership
          </p>

          {/* Step 0: Basic Info */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => updateFormData("firstName", e.target.value)}
                  />
                  <Input
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => updateFormData("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="contact@yakuzaev.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mobile No</label>
                <Input
                  type="tel"
                  placeholder="+91 1234567890"
                  value={formData.mobile}
                  onChange={(e) => updateFormData("mobile", e.target.value)}
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                />
                <label className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="text-primary underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-primary underline">Privacy Policy</a>.
                </label>
              </div>
            </div>
          )}

          {/* Step 1: Choose Location */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <p className="text-center text-muted-foreground mb-6">Choose Your Dealership Location</p>
              
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Select value={formData.state} onValueChange={(value) => updateFormData("state", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your State" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="arunachal-pradesh">Arunachal Pradesh</SelectItem>
                    <SelectItem value="assam">Assam</SelectItem>
                    <SelectItem value="bihar">Bihar</SelectItem>
                    <SelectItem value="chhattisgarh">Chhattisgarh</SelectItem>
                    <SelectItem value="goa">Goa</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="haryana">Haryana</SelectItem>
                    <SelectItem value="himachal-pradesh">Himachal Pradesh</SelectItem>
                    <SelectItem value="jharkhand">Jharkhand</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="madhya-pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="manipur">Manipur</SelectItem>
                    <SelectItem value="meghalaya">Meghalaya</SelectItem>
                    <SelectItem value="mizoram">Mizoram</SelectItem>
                    <SelectItem value="nagaland">Nagaland</SelectItem>
                    <SelectItem value="odisha">Odisha</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="sikkim">Sikkim</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="telangana">Telangana</SelectItem>
                    <SelectItem value="tripura">Tripura</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City / Town</label>
                <Input
                  placeholder="Enter your perferred city or town"
                  value={formData.city}
                  onChange={(e) => updateFormData("city", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Pincode</label>
                <Input
                  placeholder="123456"
                  value={formData.pincode}
                  onChange={(e) => updateFormData("pincode", e.target.value)}
                  maxLength={6}
                  className="max-w-[200px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Area Type</label>
                <Select value={formData.areaType} onValueChange={(value) => updateFormData("areaType", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select area type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="urban">Urban</SelectItem>
                    <SelectItem value="semi-urban">Semi-Urban</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-start gap-2 pt-4">
                <Checkbox
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => updateFormData("agreeToTerms", checked)}
                />
                <label className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <a href="#" className="text-primary underline">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-primary underline">Privacy Policy</a>.
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Investment & Space */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Investment Capacity (INR)</label>
                <Input
                  placeholder="Enter investment amount"
                  value={formData.investmentCapacity}
                  onChange={(e) => updateFormData("investmentCapacity", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Space Available (sq. ft.)</label>
                <Input
                  placeholder="Enter available space"
                  value={formData.spaceAvailable}
                  onChange={(e) => updateFormData("spaceAvailable", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 3: Business Background */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <Input
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={(e) => updateFormData("businessName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Years in Business</label>
                <Input
                  placeholder="Enter years"
                  value={formData.yearsInBusiness}
                  onChange={(e) => updateFormData("yearsInBusiness", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Type</label>
                <Input
                  placeholder="e.g., Automotive, Retail"
                  value={formData.businessType}
                  onChange={(e) => updateFormData("businessType", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Relevant Experience</label>
                <Textarea
                  placeholder="Describe your relevant experience"
                  value={formData.experience}
                  onChange={(e) => updateFormData("experience", e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 4: Upload Docs */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Documents</label>
                <p className="text-sm text-muted-foreground mb-4">
                  Please upload relevant business documents, licenses, and certifications
                </p>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      updateFormData("documents", Array.from(files));
                    }
                  }}
                />
                {formData.documents.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.documents.length} file(s) selected
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Confirm & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Review Your Application</h3>
              
              <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.email}<br />
                    {formData.mobile}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Location</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.city}, {formData.state}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Investment & Space</h4>
                  <p className="text-sm text-muted-foreground">
                    Investment: ₹{formData.investmentCapacity}<br />
                    Space: {formData.spaceAvailable} sq. ft.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Business Background</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.businessName}<br />
                    {formData.yearsInBusiness} years in {formData.businessType}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 0 && (
              <Button
                onClick={handlePrevious}
                className="px-8 bg-black text-white hover:bg-black/90"
              >
                Pervious
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="ml-auto px-8 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DealerApplication;

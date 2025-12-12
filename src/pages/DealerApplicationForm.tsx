import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Upload, LogOut } from "lucide-react";
import logo from "@/assets/logo.svg";
import { supabase } from "@/integrations/supabase/client";

const steps = [
  "Basic Info",
  "Choose Location",
  "Investment & Space",
  "Business Background",
  "Upload Docs",
  "Review"
];

const DealerApplication = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [existingEnquiryId, setExistingEnquiryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
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
    spaceOwnership: "",
    sitePhotos: [] as File[],
    investmentCapacity: "",
    spaceAvailable: "",
    hasExistingBusiness: "",
    businessName: "",
    yearsInBusiness: "",
    businessType: "",
    experience: "",
    documents: [] as File[],
    gstNumber: "",
  });

  // Load existing application data for this email
  const loadExistingData = useCallback(async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('dealer_enquiries')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading existing data:', error);
        return;
      }

      if (data) {
        console.log('Found existing application:', data);
        setExistingEnquiryId(data.id);
        setFormData({
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          email: data.email || email,
          mobile: data.phone || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          areaType: data.area_type || "",
          preferredLocation: data.preferred_location || "",
          spaceOwnership: data.space_ownership || "",
          sitePhotos: [],
          investmentCapacity: data.investment_capacity || "",
          spaceAvailable: data.space_available || "",
          hasExistingBusiness: data.has_existing_business || "",
          businessName: data.business_name || "",
          yearsInBusiness: data.years_in_business || "",
          businessType: data.business_type || "",
          experience: "",
          documents: [],
          gstNumber: data.gst_number || "",
        });
        toast({
          title: "Welcome back!",
          description: "We've restored your previous application progress.",
        });
      } else {
        // Set email for new application
        setFormData(prev => ({ ...prev, email }));
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Get verified email from session storage on mount
  useEffect(() => {
    const storedEmail = sessionStorage.getItem("dealer_application_email");
    if (storedEmail) {
      setUserEmail(storedEmail);
      const emailName = storedEmail.split("@")[0];
      const displayName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
      setUserName(displayName);
      loadExistingData(storedEmail);
    } else {
      setIsLoading(false);
    }
  }, [loadExistingData]);

  // Save form data to database (as draft)
  const saveFormData = useCallback(async () => {
    if (!userEmail) return;

    const saveData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: userEmail.toLowerCase(),
      phone: formData.mobile,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      area_type: formData.areaType,
      preferred_location: formData.preferredLocation,
      space_ownership: formData.spaceOwnership,
      space_available: formData.spaceAvailable,
      investment_capacity: formData.investmentCapacity,
      has_existing_business: formData.hasExistingBusiness,
      business_name: formData.businessName,
      years_in_business: formData.yearsInBusiness,
      business_type: formData.businessType,
      gst_number: formData.gstNumber,
      status: 'draft',
      updated_at: new Date().toISOString(),
    };

    try {
      if (existingEnquiryId) {
        // Update existing record
        const { error } = await supabase
          .from('dealer_enquiries')
          .update(saveData)
          .eq('id', existingEnquiryId);

        if (error) {
          console.error('Error updating draft:', error);
        }
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('dealer_enquiries')
          .insert([saveData])
          .select('id')
          .single();

        if (error) {
          console.error('Error creating draft:', error);
        } else if (data) {
          setExistingEnquiryId(data.id);
        }
      }
    } catch (err) {
      console.error('Error saving form data:', err);
    }
  }, [userEmail, formData, existingEnquiryId]);

  const handleNext = async () => {
    // Save data before moving to next step
    await saveFormData();

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (nextStep > maxStepReached) {
        setMaxStepReached(nextStep);
      }
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const submissionData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email || userEmail,
        phone: formData.mobile,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        area_type: formData.areaType,
        preferred_location: formData.preferredLocation,
        space_ownership: formData.spaceOwnership,
        space_available: formData.spaceAvailable,
        investment_capacity: formData.investmentCapacity,
        has_existing_business: formData.hasExistingBusiness,
        business_name: formData.businessName,
        years_in_business: formData.yearsInBusiness,
        business_type: formData.businessType,
        gst_number: formData.gstNumber,
        status: 'pending',
        site_photos: formData.sitePhotos.map(f => f.name),
        documents: formData.documents.map(f => f.name),
        updated_at: new Date().toISOString(),
      };

      if (existingEnquiryId) {
        // Update existing record to pending
        const { error } = await supabase
          .from('dealer_enquiries')
          .update(submissionData)
          .eq('id', existingEnquiryId);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('dealer_enquiries')
          .insert([submissionData]);

        if (error) throw error;
      }

      toast({
        title: "Application Submitted Successfully!",
        description: "We'll review your application and get back to you soon.",
      });
      navigate("/become-dealer");
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      sessionStorage.removeItem("dealer_application_email");
      toast({
        title: "Logged out successfully",
      });
      navigate("/dealer-application-flow");
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => navigate('/')} className="cursor-pointer">
              <img src={logo} alt="Yakuza" className="h-8" />
            </button>

            {/* Step Indicators */}
            <div className="hidden md:flex items-center gap-4">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2"
                >
                  <button
                    onClick={() => {
                      if (index <= maxStepReached) {
                        setCurrentStep(index);
                      }
                    }}
                    disabled={index > maxStepReached}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      index === currentStep
                        ? 'bg-orange-500 text-white'
                        : index <= maxStepReached
                        ? 'bg-gray-900 text-white hover:bg-gray-700 cursor-pointer'
                        : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {index + 1}
                  </button>
                  <span
                    className={`text-sm ${
                      index === currentStep 
                        ? 'text-foreground font-medium' 
                        : 'hidden'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2 md:gap-3">
              <button className="p-2 hover:bg-muted rounded-full">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path strokeWidth="2" d="M12 16v-4m0-4h.01" />
                </svg>
              </button>
              <span className="hidden sm:block text-sm font-medium">
                {userName || userEmail.split("@")[0] || "User"}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium hover:bg-blue-700 transition-colors">
                    {(userName || userEmail || "U").charAt(0).toUpperCase()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background z-50">
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-6xl px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          </div>
        ) : (
        <>
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
            </div>
          )}

          {/* Step 2: Investment & Space */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <p className="text-center text-muted-foreground mb-6">
                Share your available space and investment capability. This helps us match you with the right dealership model.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-2">Do you own or rent the proposed space</label>
                <Select value={formData.spaceOwnership} onValueChange={(value) => updateFormData("spaceOwnership", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select ownership type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Site Photos</label>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById('site-photos')?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mb-3" strokeWidth={1.5} />
                  <span className="text-muted-foreground">Upload a Document</span>
                  <input
                    id="site-photos"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        updateFormData("sitePhotos", Array.from(files));
                      }
                    }}
                  />
                </div>
                {formData.sitePhotos.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.sitePhotos.length} photo(s) selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Available Space (sq. ft.)</label>
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
              <p className="text-muted-foreground mb-6">
                Tell us a bit about your business experience and industry exposure. This helps us understand your readiness for managing an EV dealership.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-2">Do you currently run a business</label>
                <Select value={formData.hasExistingBusiness} onValueChange={(value) => updateFormData("hasExistingBusiness", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type of Business</label>
                <Select value={formData.businessType} onValueChange={(value) => updateFormData("businessType", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="automobile-dealership">Automobile Dealership</SelectItem>
                    <SelectItem value="automobile-service">Automobile Service Center</SelectItem>
                    <SelectItem value="retail">Retail Business</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="distribution">Distribution</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Name</label>
                <Input
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={(e) => updateFormData("businessName", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Years of Business Experience</label>
                <Input
                  placeholder="e.g., 5 years"
                  value={formData.yearsInBusiness}
                  onChange={(e) => updateFormData("yearsInBusiness", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 4: Upload Docs */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <p className="text-muted-foreground mb-6">
                Please upload valid identification and business-related documents to help us verify your application. All uploads are securely stored and reviewed by our dealership team.
              </p>
              
              <div>
                <label className="block text-sm font-medium mb-2">Upload Document Photos</label>
                <p className="text-sm text-muted-foreground mb-3">Aadhar Card / PAN Card / Driving License</p>
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => document.getElementById('identity-docs')?.click()}
                >
                  <Upload className="w-12 h-12 text-muted-foreground mb-3" strokeWidth={1.5} />
                  <span className="text-muted-foreground">Upload a Document</span>
                  <input
                    id="identity-docs"
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        updateFormData("documents", Array.from(files));
                      }
                    }}
                  />
                </div>
                {formData.documents.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {formData.documents.length} document(s) selected
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GST Number</label>
                <Input
                  placeholder="1234567890"
                  value={formData.gstNumber}
                  onChange={(e) => updateFormData("gstNumber", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-8">
              <p className="text-center text-muted-foreground mb-6">
                Please review your application details before submitting
              </p>
              
              {/* Personal Details */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Personal Details</h3>
                <div className="space-y-4">
                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Name</legend>
                    <div className="text-sm">{formData.firstName} {formData.lastName}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Email</legend>
                    <div className="text-sm">{formData.email}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Mobile No</legend>
                    <div className="text-sm">{formData.mobile}</div>
                  </fieldset>
                </div>
              </div>

              {/* Dealer Location */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Dealer Location</h3>
                <div className="space-y-4">
                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">State</legend>
                    <div className="text-sm">{formData.state || "Not selected"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">City / Town</legend>
                    <div className="text-sm">{formData.city || "Not provided"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3 max-w-[200px]">
                    <legend className="text-xs text-muted-foreground px-2">Pincode</legend>
                    <div className="text-sm">{formData.pincode || "Not provided"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Area Type</legend>
                    <div className="text-sm">{formData.areaType || "Not selected"}</div>
                  </fieldset>
                </div>
              </div>

              {/* Investment & Space */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Investment & Space</h3>
                <div className="space-y-4">
                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Space Ownership</legend>
                    <div className="text-sm">{formData.spaceOwnership || "Not selected"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Available Space</legend>
                    <div className="text-sm">{formData.spaceAvailable ? `${formData.spaceAvailable} sq. ft.` : "Not provided"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Site Photos</legend>
                    <div className="text-sm">
                      {formData.sitePhotos.length > 0 
                        ? `${formData.sitePhotos.length} photo(s) uploaded` 
                        : "No photos uploaded"}
                    </div>
                  </fieldset>
                </div>
              </div>

              {/* Business Background */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Business Background</h3>
                <div className="space-y-4">
                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Current Business</legend>
                    <div className="text-sm">{formData.hasExistingBusiness || "Not selected"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Business Type</legend>
                    <div className="text-sm">{formData.businessType || "Not selected"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Business Name</legend>
                    <div className="text-sm">{formData.businessName || "Not provided"}</div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Years in Business</legend>
                    <div className="text-sm">{formData.yearsInBusiness || "Not provided"}</div>
                  </fieldset>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Documents</h3>
                <div className="space-y-4">
                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">Identity Documents</legend>
                    <div className="text-sm">
                      {formData.documents.length > 0 
                        ? `${formData.documents.length} document(s) uploaded`
                        : "No documents uploaded"}
                    </div>
                  </fieldset>

                  <fieldset className="border border-border rounded-md p-3">
                    <legend className="text-xs text-muted-foreground px-2">GST Number</legend>
                    <div className="text-sm">{formData.gstNumber || "Not provided"}</div>
                  </fieldset>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-12 h-12 text-base rounded-none ${
                currentStep === 0 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="px-12 h-12 text-base bg-black text-white hover:bg-black/90 rounded-none"
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-12">
          <p className="text-sm text-muted-foreground">Copyright © 2025 Yakuza</p>
        </footer>
        </>
        )}
      </main>
    </div>
  );
};

export default DealerApplication;

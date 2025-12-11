import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Share2, CheckCircle2 } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaTelegram, FaFacebook, FaWhatsapp } from "react-icons/fa6";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const applicationSchema = z.object({
  salutation: z.string().min(1, "Salutation is required"),
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email address"),
  countryCode: z.string().default("+91"),
  mobileNumber: z.string().min(10, "Valid mobile number required").max(15),
  gender: z.string().min(1, "Gender is required"),
  experienceYears: z.string().min(1, "Experience is required"),
  currentEmployer: z.string().optional(),
  currentCtc: z.string().optional(),
  expectedCtc: z.string().optional(),
  noticePeriod: z.string().optional(),
  skillSet: z.string().optional(),
  howFoundVacancy: z.string().optional(),
  currentLocation: z.string().optional(),
  preferredLocation: z.string().optional(),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const JobApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const jobData = {
    title: "Technical Support",
    type: "Full-time",
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ApplicationForm>({
    resolver: zodResolver(applicationSchema),
  });

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
        toast.error("Only PDF and DOC files are allowed");
        return;
      }
      setResumeFile(file);
      
      // Parse resume with AI
      setIsParsingResume(true);
      toast.info("Scanning resume with AI...");
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
            body: formData,
          }
        );
        
        const result = await response.json();
        
        if (result.success && result.data) {
          const data = result.data;
          
          // Auto-fill form fields (they remain editable)
          if (data.firstName) setValue("firstName", data.firstName);
          if (data.lastName) setValue("lastName", data.lastName);
          if (data.email) setValue("email", data.email);
          if (data.mobileNumber) setValue("mobileNumber", data.mobileNumber);
          if (data.gender) setValue("gender", data.gender);
          if (data.experienceYears) setValue("experienceYears", data.experienceYears);
          if (data.currentEmployer) setValue("currentEmployer", data.currentEmployer);
          if (data.currentCtc) setValue("currentCtc", data.currentCtc);
          if (data.expectedCtc) setValue("expectedCtc", data.expectedCtc);
          if (data.noticePeriod) setValue("noticePeriod", data.noticePeriod);
          if (data.skillSet) setValue("skillSet", data.skillSet);
          if (data.currentLocation) setValue("currentLocation", data.currentLocation);
          
          toast.success("Resume scanned! Fields auto-filled (you can edit them)");
        } else {
          toast.warning("Resume uploaded but couldn't extract data. Please fill manually.");
        }
      } catch (error) {
        console.error('Error parsing resume:', error);
        toast.warning("Resume uploaded but AI scan failed. Please fill manually.");
      } finally {
        setIsParsingResume(false);
      }
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);

    try {
      let resumeUrl = null;
      let resumeUploadFailed = false;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('site-assets')
            .upload(`resumes/${fileName}`, resumeFile);

          if (uploadError) {
            console.error('Resume upload error:', uploadError);
            resumeUploadFailed = true;
            toast.warning("Resume upload failed. Submitting application without resume.");
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('site-assets')
              .getPublicUrl(`resumes/${fileName}`);
            
            resumeUrl = publicUrl;
          }
        } catch (storageError: any) {
          console.error('Storage error:', storageError);
          resumeUploadFailed = true;
          toast.warning("Resume upload failed due to storage permissions. Submitting application without resume.");
        }
      }

      // Insert job application (proceed even if resume upload failed)
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user?.id || null,
          job_id: id || 'unknown',
          job_title: jobData.title,
          salutation: data.salutation,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          mobile_number: data.mobileNumber,
          country_code: data.countryCode,
          gender: data.gender,
          resume_url: resumeUrl,
          experience_years: data.experienceYears,
          current_employer: data.currentEmployer,
          current_ctc: data.currentCtc,
          expected_ctc: data.expectedCtc,
          notice_period: data.noticePeriod,
          skill_set: data.skillSet,
          how_found_vacancy: data.howFoundVacancy,
          current_location: data.currentLocation,
          preferred_location: data.preferredLocation,
        });

      if (insertError) throw insertError;

      if (resumeUploadFailed) {
        toast.success("Application submitted successfully, but without resume. Please contact HR to submit your resume separately.");
      }
      
      setShowSuccessDialog(true);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Fixed Job Info Section */}
      <div className="fixed top-16 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{jobData.title}</h1>
              <p className="text-muted-foreground mt-1">{jobData.type}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex gap-3">
                <button type="button" className="text-foreground hover:text-primary transition-colors" aria-label="Share on X">
                  <FaXTwitter className="w-5 h-5" />
                </button>
                <button type="button" className="text-blue-600 hover:text-blue-700 transition-colors" aria-label="Share on LinkedIn">
                  <FaLinkedin className="w-5 h-5" />
                </button>
                <button type="button" className="text-blue-500 hover:text-blue-600 transition-colors" aria-label="Share on Telegram">
                  <FaTelegram className="w-5 h-5" />
                </button>
                <button type="button" className="text-blue-600 hover:text-blue-700 transition-colors" aria-label="Share on Facebook">
                  <FaFacebook className="w-5 h-5" />
                </button>
                <button type="button" className="text-green-600 hover:text-green-700 transition-colors" aria-label="Share on WhatsApp">
                  <FaWhatsapp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-1" style={{ backgroundColor: '#F8F9F9' }}>
        <div className="max-w-7xl mx-auto px-10 pt-40 pb-12">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Mobile/Tablet - Autofill Card at Top */}
            <div className="lg:hidden bg-white dark:bg-neutral-950 p-8 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Autofill Application</h2>
              <p className="text-sm text-muted-foreground">Upload your resume/CV and let AI auto-fill your application.</p>
              
              <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/20 min-h-[200px] flex flex-col items-center justify-center">
                <input
                  type="file"
                  id="resume-mobile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                  disabled={isParsingResume}
                />
                <label htmlFor="resume-mobile" className={`${isParsingResume ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  <Upload className={`mx-auto h-12 w-12 text-muted-foreground mb-4 ${isParsingResume ? 'animate-pulse' : ''}`} />
                  <p className="text-sm text-foreground mb-1 font-medium">
                    {isParsingResume ? "Scanning resume with AI..." : "Upload your resume / CV"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {resumeFile ? resumeFile.name : "Word File / PDF file"}
                  </p>
                  {resumeFile && !isParsingResume && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      ✓ Resume scanned - fields auto-filled
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personal Details, Job Info, and CTA */}
              <div className="space-y-8">
                {/* Personal Details */}
                <div className="bg-white dark:bg-neutral-950 p-8 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Personal Details</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="salutation">Salutation</Label>
                      <Select onValueChange={(value) => setValue("salutation", value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Ms">Ms</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Dr">Dr</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.salutation && <p className="text-sm text-destructive">{errors.salutation.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input {...register("firstName")} placeholder="Enter first name" className="bg-background" />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input {...register("lastName")} placeholder="Enter last name" className="bg-background" />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email ID</Label>
                      <Input {...register("email")} type="email" placeholder="Enter email" className="bg-background" />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobileNumber">Mobile Number</Label>
                      <div className="flex gap-2">
                        <Select defaultValue="+91" onValueChange={(value) => setValue("countryCode", value)}>
                          <SelectTrigger className="w-24 bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            <SelectItem value="+91">+91</SelectItem>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input {...register("mobileNumber")} placeholder="Enter mobile number" className="flex-1 bg-background" />
                      </div>
                      {errors.mobileNumber && <p className="text-sm text-destructive">{errors.mobileNumber.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select onValueChange={(value) => setValue("gender", value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Job Information */}
                <div className="bg-white dark:bg-neutral-950 p-8 space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Job Information</h2>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experienceYears">Experience in Years</Label>
                      <Select onValueChange={(value) => setValue("experienceYears", value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="1-2">1-2 years</SelectItem>
                          <SelectItem value="2-5">2-5 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.experienceYears && <p className="text-sm text-destructive">{errors.experienceYears.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentEmployer">Current Employer</Label>
                      <Input {...register("currentEmployer")} placeholder="Enter current employer" className="bg-background" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentCtc">Current CTC (In Lakhs Per Annum)</Label>
                      <Input {...register("currentCtc")} placeholder="Enter current CTC" className="bg-background" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expectedCtc">Expected CTC (In Lakhs Per Annum)</Label>
                      <Input {...register("expectedCtc")} placeholder="Enter expected CTC" className="bg-background" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="noticePeriod">Notice Period</Label>
                      <Input {...register("noticePeriod")} placeholder="Enter notice period" className="bg-background" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skillSet">Skill Set</Label>
                      <Input {...register("skillSet")} placeholder="HTML, CSS, JavaScript" className="bg-background" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="howFoundVacancy">How did you come across this vacancy?</Label>
                      <Input {...register("howFoundVacancy")} placeholder="Enter your response" className="bg-background" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentLocation">Current Location</Label>
                      <Input {...register("currentLocation")} placeholder="Enter current location" className="bg-background" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredLocation">Preferred Location</Label>
                      <Select onValueChange={(value) => setValue("preferredLocation", value)}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                          <SelectItem value="Chennai">Chennai</SelectItem>
                          <SelectItem value="Mumbai">Mumbai</SelectItem>
                          <SelectItem value="Singapore">Singapore</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                >
                  {isSubmitting ? "Submitting..." : "Apply"}
                </Button>
              </div>

              {/* Right Column - Autofill Application (Sticky) - Desktop Only */}
              <div className="hidden lg:block bg-white dark:bg-neutral-950 p-8 space-y-6 sticky top-60 self-start">
                <h2 className="text-xl font-semibold text-foreground">Autofill Application</h2>
                <p className="text-sm text-muted-foreground">Upload your resume/CV and let AI auto-fill your application.</p>
                
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/20 min-h-[300px] flex flex-col items-center justify-center">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={isParsingResume}
                  />
                  <label htmlFor="resume" className={`${isParsingResume ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <Upload className={`mx-auto h-12 w-12 text-muted-foreground mb-4 ${isParsingResume ? 'animate-pulse' : ''}`} />
                    <p className="text-sm text-foreground mb-1 font-medium">
                      {isParsingResume ? "Scanning resume with AI..." : "Upload your resume / CV"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resumeFile ? resumeFile.name : "Word File / PDF file"}
                    </p>
                    {resumeFile && !isParsingResume && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        ✓ Resume scanned - fields auto-filled
                      </p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </form>

          {/* Join Our Team Section */}
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Join Our Team</h2>
            <div className="space-y-4 text-foreground/80">
              <p>
                We're always looking for passionate, creative, and dedicated professionals to join our growing family. 
                Whether you're a designer, developer, marketer, or strategist — your next career move could start here.
              </p>
              <p>
                We're not just building designs — we're shaping experiences. If you're passionate, curious, and ready 
                to take challenges that spark your creativity, this is the place for you. Drop your details below and 
                let's build something amazing together.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center text-2xl">Application Submitted Successfully!</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Thank you for applying. We have received your application and will review it shortly. You will be contacted if your profile matches our requirements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-center sm:justify-center">
            <Button 
              onClick={() => {
                setShowSuccessDialog(false);
                navigate("/careers");
              }}
              className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              Back to Careers
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default JobApplication;

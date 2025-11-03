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
import { Upload, Share2 } from "lucide-react";
import { FaXTwitter, FaLinkedin, FaTelegram, FaFacebook, FaWhatsapp } from "react-icons/fa6";

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

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      toast.success("Resume uploaded successfully");
    }
  };

  const onSubmit = async (data: ApplicationForm) => {
    if (!user) {
      toast.error("Please login to apply");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);

    try {
      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('site-assets')
          .upload(`resumes/${fileName}`, resumeFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(`resumes/${fileName}`);
        
        resumeUrl = publicUrl;
      }

      // Insert job application
      const { error: insertError } = await supabase
        .from('job_applications')
        .insert({
          user_id: user.id,
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

      toast.success("Application submitted successfully!");
      navigate("/careers");
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
      <div className="fixed top-24 left-0 right-0 bg-white dark:bg-neutral-950 border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{jobData.title}</h1>
              <p className="text-muted-foreground mt-1">{jobData.type}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share The Job</span>
              </div>
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
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-52 pb-12">

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Two Column Layout for Personal Details and Autofill */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Details - Left Column */}
              <div className="bg-white dark:bg-neutral-950 rounded-lg p-8 space-y-6">
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

              {/* Autofill Application - Right Column */}
              <div className="bg-white dark:bg-neutral-950 rounded-lg p-8 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Autofill Application</h2>
                <p className="text-sm text-muted-foreground">Upload your resume/CV in seconds with the autofill option.</p>
                
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center bg-muted/20">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-foreground mb-1 font-medium">Upload you resume / CV</p>
                    <p className="text-xs text-muted-foreground">
                      {resumeFile ? resumeFile.name : "Word File / PDF file"}
                    </p>
                  </label>
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div className="bg-white dark:bg-neutral-950 rounded-lg p-8 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Job Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="space-y-2 md:col-span-2">
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

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              {isSubmitting ? "Submitting..." : "Apply"}
            </Button>
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
      <Footer />
    </div>
  );
};

export default JobApplication;

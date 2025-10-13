import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProfileSetup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim()) {
      toast({
        title: "First name required",
        description: "Please enter your first name",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast({
        title: "Valid email required",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (!country.trim()) {
      toast({
        title: "Country required",
        description: "Please select your country/region",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Agreement required",
        description: "Please agree to the Privacy Policy and Terms of Use",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          country: country.trim(),
          gender: gender || null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "Your journey with Yakuza starts here – successfully signed up.",
      });

      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Profile setup error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      
      
      <div className="flex-1 flex items-center justify-center p-4 pt-32 pb-16">
        <div className="w-full max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 md:p-12">
            <h1 className="text-4xl font-bold mb-8">Create Account</h1>

            {/* Personal Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm">First Name*</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder=""
                    required
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm">Last Name*</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder=""
                    className="border-border"
                  />
                </div>
              </div>
            </div>

            {/* Email / Country */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Email / Country</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">Email Address*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=""
                    required
                    className="border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm">Country/Region*</Label>
                  <Input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder=""
                    required
                    className="border-border"
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Gender</h2>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label 
                htmlFor="terms" 
                className="text-sm font-normal leading-relaxed cursor-pointer"
              >
                I agree to yakuza{' '}
                <a href="/privacy-policy" className="underline">Privacy Policy</a>. and{' '}
                <a href="/terms-of-use" className="underline">Terms of Use</a>.
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-black hover:bg-black/90 text-white h-12 text-base"
              disabled={loading || !firstName.trim() || !email.trim() || !country.trim() || !agreedToTerms}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfileSetup;

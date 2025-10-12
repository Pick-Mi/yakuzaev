import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';

const ProfileSetup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('India');
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
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          country: country,
          gender: gender || null,
        })
        .eq('user_id', user?.id);

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
      {/* Simple Fixed Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50 flex items-center px-6">
        <span className="text-lg font-semibold">Profile Setup</span>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 pt-32">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl font-bold mb-8">Create Account</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email / Country */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Email / Country</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country/Region*</Label>
                  <Input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Gender</h2>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Female</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={gender === 'other'}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span>Other</span>
                </label>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4"
              />
              <Label htmlFor="terms" className="cursor-pointer font-normal">
                I agree to yakuza{' '}
                <a href="/privacy-policy" className="underline">Privacy Policy</a>.{' '}
                and{' '}
                <a href="/terms-of-use" className="underline">Terms of Use.</a>
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90"
              disabled={loading || !firstName.trim() || !lastName.trim() || !email.trim() || !agreedToTerms}
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

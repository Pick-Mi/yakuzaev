import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Save, User, MapPin, CreditCard, Bell, Shield, Package, ChevronRight, LogOut, Edit } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { refreshProfile } = useProfile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(searchParams.get("section") || "profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDialog, setEditDialog] = useState<{open: boolean, field: string, value: string}>({
    open: false,
    field: "",
    value: ""
  });
  const [phoneDialog, setPhoneDialog] = useState({
    open: false,
    phone: "",
    otp: "",
    otpSent: false,
    verifying: false
  });
  
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    customer_type: "individual",
    avatar_url: "",
    
    // Address fields
    street_address: "",
    apartment_unit: "",
    city: "",
    state_province: "",
    postal_code: "",
    country: "India",
    address_type: "home",
    
    // Billing address
    billing_street_address: "",
    billing_apartment_unit: "",
    billing_city: "",
    billing_state_province: "",
    billing_postal_code: "",
    billing_country: "India",
    
    // Payment & preferences
    preferred_payment_method: "",
    customer_notes: "",
    email_notifications: true,
    sms_notifications: true,
    marketing_consent: false,
    newsletter_subscription: false,
    
    // Status fields (read-only)
    customer_status: "",
    is_verified: false,
    total_orders: 0,
    total_spent: 0,
    loyalty_points: 0
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        // Ensure all string fields have default values to prevent controlled/uncontrolled input warnings
        setProfile({
          ...data,
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          street_address: data.street_address || "",
          apartment_unit: data.apartment_unit || "",
          city: data.city || "",
          state_province: data.state_province || "",
          postal_code: data.postal_code || "",
          country: data.country || "India",
          billing_street_address: data.billing_street_address || "",
          billing_apartment_unit: data.billing_apartment_unit || "",
          billing_city: data.billing_city || "",
          billing_state_province: data.billing_state_province || "",
          billing_postal_code: data.billing_postal_code || "",
          billing_country: data.billing_country || "India",
          preferred_payment_method: data.preferred_payment_method || "",
          customer_notes: data.customer_notes || "",
          avatar_url: data.avatar_url || "",
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...profile
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Refresh the profile data to ensure the display name is updated in header
      await refreshProfile();
      await fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 pt-40 pb-8">
          <p className="text-center text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSearchParams({ section });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const openEditDialog = (field: string, value: string) => {
    setEditDialog({ open: true, field, value });
  };

  const closeEditDialog = () => {
    setEditDialog({ open: false, field: "", value: "" });
  };

  const saveFieldEdit = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .update({ [editDialog.field]: editDialog.value })
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfile(prev => ({ ...prev, [editDialog.field]: editDialog.value }));
      
      toast({
        title: "Success",
        description: "Information updated successfully",
      });

      closeEditDialog();
      await refreshProfile();
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Error",
        description: "Failed to update information",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const openPhoneDialog = () => {
    setPhoneDialog({ open: true, phone: "", otp: "", otpSent: false, verifying: false });
  };

  const closePhoneDialog = () => {
    setPhoneDialog({ open: false, phone: "", otp: "", otpSent: false, verifying: false });
  };

  const sendOTP = async () => {
    if (!phoneDialog.phone || phoneDialog.phone.length < 10) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setPhoneDialog(prev => ({ ...prev, verifying: true }));
    
    try {
      const { error } = await supabase.functions.invoke('send-otp', {
        body: { phoneNumber: phoneDialog.phone }
      });

      if (error) throw error;

      setPhoneDialog(prev => ({ ...prev, otpSent: true, verifying: false }));
      
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the verification code",
      });
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
      setPhoneDialog(prev => ({ ...prev, verifying: false }));
    }
  };

  const verifyAndUpdatePhone = async () => {
    if (!phoneDialog.otp || phoneDialog.otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setPhoneDialog(prev => ({ ...prev, verifying: true }));
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-otp', {
        body: { 
          phoneNumber: phoneDialog.phone,
          otp: phoneDialog.otp
        }
      });

      if (error) throw error;

      if (data?.verified) {
        // Update phone number in profile
        const { error: updateError } = await (supabase as any)
          .from('profiles')
          .update({ phone: phoneDialog.phone })
          .eq('user_id', user?.id);

        if (updateError) throw updateError;

        setProfile(prev => ({ ...prev, phone: phoneDialog.phone }));
        
        toast({
          title: "Success",
          description: "Phone number updated successfully",
        });

        closePhoneDialog();
        await refreshProfile();
      } else {
        toast({
          title: "Invalid OTP",
          description: "The verification code is incorrect",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPhoneDialog(prev => ({ ...prev, verifying: false }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 pt-40 pb-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <nav className="flex flex-col gap-[5px]">
              {/* Account Settings Section */}
              <div className="bg-white mb-6">
                <div className="flex items-center gap-3 px-6 py-4 border-b">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-semibold text-lg text-gray-700">ACCOUNT SETTINGS</span>
                </div>
                
                <div className="space-y-0">
                  <button
                    onClick={() => handleSectionChange("profile")}
                    className={`w-full text-left px-6 py-4 transition-colors ${
                      activeSection === "profile" ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Profile information
                  </button>
                  <button
                    onClick={() => handleSectionChange("address")}
                    className={`w-full text-left px-6 py-4 transition-colors ${
                      activeSection === "address" ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Manage Addresses
                  </button>
                  <button
                    onClick={() => handleSectionChange("pan")}
                    className={`w-full text-left px-6 py-4 transition-colors ${
                      activeSection === "pan" ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    ID Proof
                  </button>
                </div>
              </div>

              {/* My Orders */}
              <button
                onClick={() => navigate("/orders")}
                className="w-full flex items-center justify-between px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors group mb-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-orange-500" />
                  </div>
                  <span className="font-semibold text-lg text-gray-700">MY ORDERS</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-orange-500" />
                </div>
                <span className="font-semibold text-lg text-gray-700">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 space-y-6">

          {/* Profile Details Section */}
          {activeSection === "profile" && (
            <div className="space-y-6 bg-white p-8 rounded-none">
              <h1 className="text-3xl font-bold mb-8">Personal Information</h1>
              
              {/* Avatar and Name Section */}
              <div className="mb-8">
                <div className="relative w-40 h-40 mb-4">
                  <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <User className="w-20 h-20 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <button className="absolute top-2 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50">
                    <Save className="w-5 h-5 text-gray-700" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold">
                  {profile.first_name} {profile.last_name ? profile.last_name.charAt(0) : ''}
                </h2>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <button 
                  onClick={openPhoneDialog}
                  className="bg-gray-50 p-6 rounded-none text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="font-semibold text-lg mb-2">Phone Number</div>
                  <div className="text-gray-600 text-lg">{profile.phone || 'Not provided'}</div>
                </button>

                {/* Email */}
                <button 
                  onClick={() => openEditDialog("email", profile.email)}
                  className="border-2 border-blue-500 p-6 rounded-none bg-white text-left hover:bg-blue-50 transition-colors"
                >
                  <div className="font-semibold text-lg mb-2 border-b-2 border-dashed border-gray-300 pb-2">Email</div>
                  <div className="text-blue-600 text-lg border-b-2 border-dashed border-gray-300 pb-2">{profile.email || 'Not provided'}</div>
                </button>

                {/* Country */}
                <button 
                  onClick={() => openEditDialog("country", profile.country)}
                  className="bg-gray-50 p-6 rounded-none text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="font-semibold text-lg mb-2">Country</div>
                  <div className="text-gray-600 text-lg">{profile.country || 'India'}</div>
                </button>

                {/* Gender */}
                <button 
                  onClick={() => openEditDialog("gender", profile.gender)}
                  className="bg-gray-50 p-6 rounded-none text-left hover:bg-gray-100 transition-colors"
                >
                  <div className="font-semibold text-lg mb-2">Gender</div>
                  <div className="text-gray-600 text-lg capitalize">{profile.gender || 'Not specified'}</div>
                </button>
              </div>

              {/* Note Section */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">Note:</span> This account is needed for login and can't be disconnected{' '}
                  <a href="/contact" className="text-orange-500 hover:text-orange-600 font-semibold">Contact us</a>{' '}
                  for more info. We are working on improving this experience
                </p>
              </div>
            </div>
          )}

          {/* Address Details Section */}
          {activeSection === "address" && (
            <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Primary Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street_address">Street Address</Label>
                    <Input
                      id="street_address"
                      value={profile.street_address}
                      onChange={(e) => handleInputChange("street_address", e.target.value)}
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apartment_unit">Apartment/Unit</Label>
                    <Input
                      id="apartment_unit"
                      value={profile.apartment_unit}
                      onChange={(e) => handleInputChange("apartment_unit", e.target.value)}
                      placeholder="Apt, suite, unit, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={profile.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state_province">State/Province</Label>
                      <Input
                        id="state_province"
                        value={profile.state_province}
                        onChange={(e) => handleInputChange("state_province", e.target.value)}
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        value={profile.postal_code}
                        onChange={(e) => handleInputChange("postal_code", e.target.value)}
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profile.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address_type">Address Type</Label>
                    <Select value={profile.address_type} onValueChange={(value) => handleInputChange("address_type", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select address type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="shipping">Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="billing_street_address">Street Address</Label>
                    <Input
                      id="billing_street_address"
                      value={profile.billing_street_address}
                      onChange={(e) => handleInputChange("billing_street_address", e.target.value)}
                      placeholder="Enter billing street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="billing_apartment_unit">Apartment/Unit</Label>
                    <Input
                      id="billing_apartment_unit"
                      value={profile.billing_apartment_unit}
                      onChange={(e) => handleInputChange("billing_apartment_unit", e.target.value)}
                      placeholder="Apt, suite, unit, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing_city">City</Label>
                      <Input
                        id="billing_city"
                        value={profile.billing_city}
                        onChange={(e) => handleInputChange("billing_city", e.target.value)}
                        placeholder="Enter billing city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing_state_province">State/Province</Label>
                      <Input
                        id="billing_state_province"
                        value={profile.billing_state_province}
                        onChange={(e) => handleInputChange("billing_state_province", e.target.value)}
                        placeholder="Enter billing state"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="billing_postal_code">Postal Code</Label>
                      <Input
                        id="billing_postal_code"
                        value={profile.billing_postal_code}
                        onChange={(e) => handleInputChange("billing_postal_code", e.target.value)}
                        placeholder="Enter billing postal code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billing_country">Country</Label>
                      <Input
                        id="billing_country"
                        value={profile.billing_country}
                        onChange={(e) => handleInputChange("billing_country", e.target.value)}
                        placeholder="Enter billing country"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>
          )}

          {/* PAN Card Section */}
          {activeSection === "pan" && (
            <Card>
              <CardHeader>
                <CardTitle>PAN Card Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">PAN card information management coming soon.</p>
              </CardContent>
            </Card>
          )}
          </main>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onOpenChange={closeEditDialog}>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle>Edit {editDialog.field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {editDialog.field === "gender" ? (
                <Select 
                  value={editDialog.value} 
                  onValueChange={(value) => setEditDialog(prev => ({ ...prev, value }))}
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  className="rounded-none"
                  type={editDialog.field === "email" ? "email" : "text"}
                  value={editDialog.value}
                  onChange={(e) => setEditDialog(prev => ({ ...prev, value: e.target.value }))}
                  placeholder={`Enter ${editDialog.field.replace(/_/g, ' ')}`}
                />
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={closeEditDialog} className="rounded-none">
                Cancel
              </Button>
              <Button onClick={saveFieldEdit} disabled={saving} className="rounded-none">
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Phone Number Edit Dialog with OTP */}
        <Dialog open={phoneDialog.open} onOpenChange={closePhoneDialog}>
          <DialogContent className="rounded-none">
            <DialogHeader>
              <DialogTitle>Change Phone Number</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {!phoneDialog.otpSent ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-phone">New Phone Number</Label>
                    <Input
                      id="new-phone"
                      className="rounded-none"
                      type="tel"
                      value={phoneDialog.phone}
                      onChange={(e) => setPhoneDialog(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter new phone number"
                    />
                  </div>
                  <Button 
                    onClick={sendOTP} 
                    disabled={phoneDialog.verifying}
                    className="w-full rounded-none"
                  >
                    {phoneDialog.verifying ? "Sending..." : "Send OTP"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      className="rounded-none"
                      type="text"
                      maxLength={6}
                      value={phoneDialog.otp}
                      onChange={(e) => setPhoneDialog(prev => ({ ...prev, otp: e.target.value }))}
                      placeholder="Enter 6-digit OTP"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    OTP sent to {phoneDialog.phone}
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setPhoneDialog(prev => ({ ...prev, otpSent: false, otp: "" }))}
                      className="rounded-none"
                    >
                      Change Number
                    </Button>
                    <Button 
                      onClick={verifyAndUpdatePhone} 
                      disabled={phoneDialog.verifying}
                      className="flex-1 rounded-none"
                    >
                      {phoneDialog.verifying ? "Verifying..." : "Verify & Update"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;

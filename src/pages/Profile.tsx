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
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Save, User, MapPin, CreditCard, Bell, Shield, Package, ChevronRight, LogOut, Edit, Trash2, MoreVertical } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  state: string;
  city: string;
  locality: string;
  address: string;
  address_type: string;
  is_default: boolean;
}

const Profile = () => {
  const { user, signOut } = useAuth();
  const { refreshProfile } = useProfile();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();
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
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [nameDialog, setNameDialog] = useState({
    open: false,
    first_name: "",
    last_name: ""
  });
  const [addressDialog, setAddressDialog] = useState({
    open: false,
    editId: null as string | null,
    name: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    locality: "",
    address: "",
    address_type: "home"
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

  const fetchAddresses = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('user_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchAddresses();
    }
  }, [user]);

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

  const handleSaveName = async () => {
    if (!user) return;

    if (!nameDialog.first_name.trim()) {
      toast({
        title: "Validation Error",
        description: "First name is required",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: nameDialog.first_name.trim(),
          last_name: nameDialog.last_name.trim()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        first_name: nameDialog.first_name.trim(),
        last_name: nameDialog.last_name.trim()
      }));

      setNameDialog({ open: false, first_name: "", last_name: "" });

      toast({
        title: "Success",
        description: "Name updated successfully",
      });

      await refreshProfile();
    } catch (error) {
      console.error('Error updating name:', error);
      toast({
        title: "Error",
        description: "Failed to update name",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
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


  const openAddressDialog = (address?: Address) => {
    if (address) {
      setAddressDialog({
        open: true,
        editId: address.id,
        name: address.name,
        phone: address.phone,
        pincode: address.pincode,
        state: address.state,
        city: address.city,
        locality: address.locality,
        address: address.address,
        address_type: address.address_type
      });
    } else {
      setAddressDialog({
        open: true,
        editId: null,
        name: "",
        phone: "",
        pincode: "",
        state: "",
        city: "",
        locality: "",
        address: "",
        address_type: "home"
      });
    }
  };

  const closeAddressDialog = () => {
    setAddressDialog({
      open: false,
      editId: null,
      name: "",
      phone: "",
      pincode: "",
      state: "",
      city: "",
      locality: "",
      address: "",
      address_type: "home"
    });
  };

  const saveAddress = async () => {
    if (!addressDialog.name || !addressDialog.phone || !addressDialog.address) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const addressData = {
        user_id: user?.id,
        name: addressDialog.name,
        phone: addressDialog.phone,
        pincode: addressDialog.pincode,
        state: addressDialog.state,
        city: addressDialog.city,
        locality: addressDialog.locality,
        address: addressDialog.address,
        address_type: addressDialog.address_type
      };

      if (addressDialog.editId) {
        const { error } = await (supabase as any)
          .from('user_addresses')
          .update(addressData)
          .eq('id', addressDialog.editId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        const { error } = await (supabase as any)
          .from('user_addresses')
          .insert(addressData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      closeAddressDialog();
      await fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const { error } = await (supabase as any)
        .from('user_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully",
      });

      await fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className={`container mx-auto ${isMobile ? 'px-0 pt-[120px]' : 'px-4 pt-40'} pb-8`}>
        {isMobile ? (
          // Mobile Layout
          <div className="space-y-0">
            {/* Profile Header */}
            <div className="bg-gray-100 px-4 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile.first_name} {profile.last_name || ''}
                  </h1>
                  <button className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    Explore <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-500" />
                  )}
                </div>
              </div>
            </div>

            {/* Tab Buttons */}
            <div className="grid grid-cols-2 gap-4 px-4 py-6 bg-white">
              <button
                onClick={() => handleSectionChange("address")}
                className={`py-4 px-6 border-2 text-lg font-medium transition-colors ${
                  activeSection === "address" 
                    ? "border-orange-500 text-orange-500" 
                    : "border-gray-300 text-gray-900"
                }`}
              >
                Manage Addresses
              </button>
              <button
                onClick={() => handleSectionChange("pan")}
                className={`py-4 px-6 border-2 text-lg font-medium transition-colors ${
                  activeSection === "pan" 
                    ? "border-orange-500 text-orange-500" 
                    : "border-gray-300 text-gray-900"
                }`}
              >
                ID Proof
              </button>
            </div>

            {/* MY ORDERS */}
            <button
              onClick={() => navigate("/orders")}
              className="w-full flex items-center justify-between px-4 py-6 bg-white border-t border-b border-gray-200"
            >
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-bold text-gray-900">MY ORDERS</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {/* Content Area */}
            <div className="px-4 py-6 bg-white min-h-[300px]">
              {activeSection === "address" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Manage Addresses</h2>
                  {addresses.map((address) => (
                    <div key={address.id} className="bg-gray-50 p-4 relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 uppercase">{address.address_type}</span>
                        <div className="flex gap-2">
                          <button onClick={() => openAddressDialog(address)} className="text-blue-600 p-1">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteAddress(address.id)} className="text-red-600 p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mb-2">
                        <h3 className="font-bold text-gray-900">{address.name} {address.phone}</h3>
                      </div>
                      <div className="text-sm text-gray-700">
                        <p>{address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}</p>
                      </div>
                    </div>
                  ))}
                  <button 
                    className="flex items-center gap-2 text-orange-500 font-semibold"
                    onClick={() => openAddressDialog()}
                  >
                    <span className="text-xl">+</span>
                    <span>ADD A NEW ADDRESS</span>
                  </button>
                </div>
              )}
              
              {activeSection === "pan" && (
                <div>
                  <h2 className="text-xl font-bold mb-4">ID Proof</h2>
                  <p className="text-gray-600">PAN card information management coming soon.</p>
                </div>
              )}
            </div>

            {/* Logout Button - Fixed at bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-6"
              >
                <LogOut className="w-6 h-6 text-orange-500" />
                <span className="text-lg font-bold text-gray-900">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          // Desktop Layout
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
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {profile.first_name} {profile.last_name || ''}
                  </h2>
                  <button 
                    onClick={() => setNameDialog({
                      open: true,
                      first_name: profile.first_name,
                      last_name: profile.last_name
                    })}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
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
            <div className="space-y-6 bg-white p-8 rounded-none">
              <h1 className="text-3xl font-bold mb-8">Manage Addresses</h1>
              
              {/* Address List */}
              {addresses.map((address) => (
                <div key={address.id} className="bg-gray-50 p-6 rounded-none relative mb-4">
                  {/* Header with badge and menu */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700 uppercase">{address.address_type}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openAddressDialog(address)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteAddress(address.id)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Name and Phone */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {address.name} {address.phone}
                    </h3>
                  </div>

                  {/* Full Address */}
                  <div className="text-gray-700">
                    <p>
                      {address.address}, {address.locality}, {address.city}, {address.state} - {address.pincode}    {address.phone}
                    </p>
                  </div>
                </div>
              ))}

              {/* Add New Address Button */}
              <button 
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold mt-6"
                onClick={() => openAddressDialog()}
              >
                <span className="text-2xl">+</span>
                <span>ADD A NEW ADDRESS</span>
              </button>
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
        )}

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

        {/* Add/Edit Address Dialog */}
        <Dialog open={addressDialog.open} onOpenChange={closeAddressDialog}>
          <DialogContent className="rounded-none max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-orange-500 text-xl">
                {addressDialog.editId ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Use Current Location Button */}
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-none">
                <MapPin className="w-5 h-5 mr-2" />
                Use my current location
              </Button>

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    className="rounded-none"
                    placeholder="Name"
                    value={addressDialog.name}
                    onChange={(e) => setAddressDialog(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    className="rounded-none"
                    placeholder="10-digit mobile number"
                    value={addressDialog.phone}
                    onChange={(e) => setAddressDialog(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    className="rounded-none"
                    placeholder="Pincode"
                    value={addressDialog.pincode}
                    onChange={(e) => setAddressDialog(prev => ({ ...prev, pincode: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    className="rounded-none"
                    placeholder="State"
                    value={addressDialog.state}
                    onChange={(e) => setAddressDialog(prev => ({ ...prev, state: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    className="rounded-none"
                    placeholder="City / District"
                    value={addressDialog.city}
                    onChange={(e) => setAddressDialog(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    className="rounded-none"
                    placeholder="Locality"
                    value={addressDialog.locality}
                    onChange={(e) => setAddressDialog(prev => ({ ...prev, locality: e.target.value }))}
                  />
                </div>
              </div>

              {/* Full Address */}
              <div className="space-y-2">
                <Textarea
                  className="rounded-none min-h-32"
                  placeholder="Address"
                  value={addressDialog.address}
                  onChange={(e) => setAddressDialog(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              {/* Address Type */}
              <RadioGroup 
                value={addressDialog.address_type} 
                onValueChange={(value) => setAddressDialog(prev => ({ ...prev, address_type: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="home" id="home" />
                  <Label htmlFor="home" className="cursor-pointer">Home (All Day Delivery)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="work" />
                  <Label htmlFor="work" className="cursor-pointer">Work ( Delivery Between 10 AM – 05 PM )</Label>
                </div>
              </RadioGroup>
            </div>

            <DialogFooter className="flex gap-2">
              <Button 
                onClick={saveAddress} 
                disabled={saving}
                className="flex-1 bg-orange-500 hover:bg-orange-600 rounded-none"
              >
                {saving ? "SAVING..." : "SAVE"}
              </Button>
              <Button 
                variant="outline" 
                onClick={closeAddressDialog}
                className="flex-1 rounded-none"
              >
                CANCEL
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Name Dialog */}
        <Dialog open={nameDialog.open} onOpenChange={(open) => !open && setNameDialog({ open: false, first_name: "", last_name: "" })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Name</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={nameDialog.first_name}
                  onChange={(e) => setNameDialog(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Enter first name"
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={nameDialog.last_name}
                  onChange={(e) => setNameDialog(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Enter last name"
                  maxLength={50}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setNameDialog({ open: false, first_name: "", last_name: "" })}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveName} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Profile;

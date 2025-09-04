import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { ArrowLeft, Save, User, MapPin, CreditCard, Bell, Shield } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    customer_type: "individual",
    
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
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
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
        .update(profile)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
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
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
        </div>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Address
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Details Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={profile.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_type">Account Type</Label>
                  <Select value={profile.customer_type} onValueChange={(value) => handleInputChange("customer_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Badge variant={profile.is_verified ? "default" : "secondary"}>
                      {profile.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Verification Status</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{profile.total_orders}</p>
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">${profile.total_spent}</p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{profile.loyalty_points}</p>
                    <p className="text-sm text-muted-foreground">Loyalty Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Address Details Tab */}
          <TabsContent value="address" className="space-y-6">
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
          </TabsContent>

          {/* Payment Details Tab */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="preferred_payment_method">Preferred Payment Method</Label>
                  <Select value={profile.preferred_payment_method} onValueChange={(value) => handleInputChange("preferred_payment_method", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preferred payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="netbanking">Net Banking</SelectItem>
                      <SelectItem value="wallet">Digital Wallet</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_notes">Notes</Label>
                  <Textarea
                    id="customer_notes"
                    value={profile.customer_notes}
                    onChange={(e) => handleInputChange("customer_notes", e.target.value)}
                    placeholder="Add any special notes or preferences..."
                    className="min-h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="email_notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive order updates and important information via email</p>
                  </div>
                  <Switch
                    id="email_notifications"
                    checked={profile.email_notifications}
                    onCheckedChange={(checked) => handleInputChange("email_notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="sms_notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive order updates and delivery information via SMS</p>
                  </div>
                  <Switch
                    id="sms_notifications"
                    checked={profile.sms_notifications}
                    onCheckedChange={(checked) => handleInputChange("sms_notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="marketing_consent">Marketing Communications</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional offers and marketing emails</p>
                  </div>
                  <Switch
                    id="marketing_consent"
                    checked={profile.marketing_consent}
                    onCheckedChange={(checked) => handleInputChange("marketing_consent", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label htmlFor="newsletter_subscription">Newsletter Subscription</Label>
                    <p className="text-sm text-muted-foreground">Subscribe to our newsletter for updates and news</p>
                  </div>
                  <Switch
                    id="newsletter_subscription"
                    checked={profile.newsletter_subscription}
                    onCheckedChange={(checked) => handleInputChange("newsletter_subscription", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={saveProfile} 
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
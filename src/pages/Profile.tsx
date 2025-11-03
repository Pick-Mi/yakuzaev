import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { User, MapPin, CreditCard, Package, LogOut, AlertTriangle } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    country: "India",
    gender: "",
  });

  const [editedProfile, setEditedProfile] = useState(profile);

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
        const profileData = {
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || user?.email || "",
          phone: data.phone || "",
          country: data.country || "India",
          gender: data.gender || "",
        };
        setProfile(profileData);
        setEditedProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await (supabase as any)
        .from('profiles')
        .upsert({
          user_id: user?.id,
          ...editedProfile
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setProfile(editedProfile);
      setEditMode(false);

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
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete user account
      const { error } = await supabase.auth.admin.deleteUser(user!.id);
      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });

      await signOut();
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 pt-40 pb-8">
          <p className="text-center text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: "profile", label: "Profile Details", icon: User },
    { id: "address", label: "Delivery Addresses", icon: MapPin },
    { id: "identification", label: "Identification Details", icon: CreditCard },
    { id: "orders", label: "My Orders", icon: Package, onClick: () => navigate("/orders") },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8 pt-[100px] bg-white">
        <div className="flex gap-8 bg-white">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0 bg-white">
            <h1 className="text-2xl font-bold mb-6">Account</h1>
            <nav className="space-y-1 bg-white">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick || (() => setActiveSection(item.id))}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeSection === item.id && !item.onClick
                        ? "bg-white border-l-4 border-orange-500 font-medium"
                        : "hover:bg-white"
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
                <span className="text-sm">Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-white">
            {activeSection === "profile" && (
              <div className="space-y-8 bg-white">
                {/* Personal Information */}
                <div className="border border-gray-200 p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-semibold">Personal Information</h2>
                    {!editMode ? (
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(true)}
                        className="rounded-none"
                      >
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditedProfile(profile);
                            setEditMode(false);
                          }}
                          className="rounded-none"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          className="rounded-none bg-black hover:bg-gray-800"
                        >
                          Save
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="col-span-2">
                      <Label className="text-sm text-gray-600 mb-2 block">Full Name</Label>
                      {editMode ? (
                        <div className="flex gap-2">
                          <Input
                            value={editedProfile.first_name}
                            onChange={(e) => setEditedProfile({ ...editedProfile, first_name: e.target.value })}
                            placeholder="First Name"
                            className="rounded-none bg-white border border-gray-300"
                          />
                          <Input
                            value={editedProfile.last_name}
                            onChange={(e) => setEditedProfile({ ...editedProfile, last_name: e.target.value })}
                            placeholder="Last Name"
                            className="rounded-none bg-white border border-gray-300"
                          />
                        </div>
                      ) : (
                        <p className="text-base font-medium">{profile.first_name} {profile.last_name}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Phone Number</Label>
                      {editMode ? (
                        <Input
                          value={editedProfile.phone}
                          onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                          placeholder="Phone Number"
                          className="rounded-none bg-white border border-gray-300"
                        />
                      ) : (
                        <p className="text-base font-medium">{profile.phone || "Not provided"}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Email</Label>
                      <p className="text-base font-medium">{profile.email}</p>
                    </div>

                    {/* Password */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Password</Label>
                      <p className="text-base font-medium">••••••</p>
                    </div>

                    {/* Country */}
                    <div>
                      <Label className="text-sm text-gray-600 mb-2 block">Country</Label>
                      {editMode ? (
                        <Input
                          value={editedProfile.country}
                          onChange={(e) => setEditedProfile({ ...editedProfile, country: e.target.value })}
                          placeholder="Country"
                          className="rounded-none bg-white border border-gray-300"
                        />
                      ) : (
                        <p className="text-base font-medium">{profile.country}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="col-span-2">
                      <Label className="text-sm text-gray-600 mb-2 block">Gender</Label>
                      {editMode ? (
                        <select
                          value={editedProfile.gender}
                          onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 bg-white rounded-none"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-base font-medium capitalize">{profile.gender || "Not specified"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Delete Account Section */}
                <div className="border border-gray-200 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h2 className="text-xl font-semibold text-orange-500">Delete Account</h2>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">We're sorry to see you go!</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Deleting your account will permanently remove your profile, order history, saved addresses, and wallet balance. Once deleted, your data cannot be recovered.
                  </p>

                  <h4 className="font-semibold mb-2">Before You Continue</h4>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-4">
                    <li>All past orders and invoices will be permanently deleted.</li>
                    <li>Any unused coupons or wallet credits will be lost.</li>
                    <li>You won't be able to access your purchase history after deletion.</li>
                  </ul>

                  <p className="text-sm text-gray-700 mb-4">
                    <strong>Are You Sure You Want to Delete Your Account?</strong>
                    <br />
                    If you still wish to proceed, click "<span className="text-red-600 font-semibold">Delete My Account</span>" below.
                    <br />
                    We value your time with us and hope to see you again in the future.
                  </p>

                  <Button
                    onClick={() => setDeleteDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-none"
                  >
                    Delete My Account
                  </Button>
                </div>
              </div>
            )}

            {activeSection === "address" && (
              <div className="border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold mb-4">Delivery Addresses</h2>
                <p className="text-gray-600">No addresses added yet.</p>
              </div>
            )}

            {activeSection === "identification" && (
              <div className="border border-gray-200 p-8">
                <h2 className="text-2xl font-semibold mb-4">Identification Details</h2>
                <p className="text-gray-600">No identification documents added yet.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Confirm Account Deletion</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 py-4">
            Are you absolutely sure you want to delete your account? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white rounded-none"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

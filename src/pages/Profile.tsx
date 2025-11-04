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
import { User, MapPin, CreditCard, Package, LogOut, AlertTriangle, Plus, Pencil, Trash2 } from "lucide-react";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [deleteAddressDialogOpen, setDeleteAddressDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState(false);
  const [idProof, setIdProof] = useState({
    document_type: "",
    document_number: "",
    document_file_url: "",
  });
  
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    state: "",
    city: "",
    locality: "",
    address: "",
    address_type: "home",
    is_default: false,
  });
  
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
      fetchAddresses();
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
        
        // Set ID proof data
        setIdProof({
          document_type: data.document_type || "",
          document_number: data.document_number || "",
          document_file_url: data.document_file_url || "",
        });
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

  const fetchAddresses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  const handleAddressSubmit = async () => {
    try {
      if (editingAddress) {
        const { error } = await supabase
          .from('user_addresses')
          .update(addressForm)
          .eq('id', editingAddress.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('user_addresses')
          .insert({
            ...addressForm,
            user_id: user?.id,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Address added successfully",
        });
      }

      setAddressDialogOpen(false);
      setEditingAddress(null);
      setAddressForm({
        name: "",
        phone: "",
        pincode: "",
        state: "",
        city: "",
        locality: "",
        address: "",
        address_type: "home",
        is_default: false,
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive"
      });
    }
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name,
      phone: address.phone,
      pincode: address.pincode,
      state: address.state,
      city: address.city,
      locality: address.locality,
      address: address.address,
      address_type: address.address_type,
      is_default: address.is_default || false,
    });
    setAddressDialogOpen(true);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;

    try {
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', addressToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Address deleted successfully",
      });

      setDeleteAddressDialogOpen(false);
      setAddressToDelete(null);
      fetchAddresses();
    } catch (error) {
      console.error('Error deleting address:', error);
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive"
      });
    }
  };

  const handleIdProofUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only JPG, PNG, and PDF files are allowed",
        variant: "destructive"
      });
      return;
    }

    setUploadingId(true);

    try {
      // Delete old file if exists
      if (idProof.document_file_url) {
        const oldPath = idProof.document_file_url.split('/').slice(-2).join('/');
        await supabase.storage.from('id-documents').remove([oldPath]);
      }

      // Upload new file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('id-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('id-documents')
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          document_file_url: publicUrl,
          document_type: idProof.document_type || 'other',
          document_number: idProof.document_number,
        })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      setIdProof({ ...idProof, document_file_url: publicUrl });

      toast({
        title: "Success",
        description: "ID proof uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading ID proof:', error);
      toast({
        title: "Error",
        description: "Failed to upload ID proof",
        variant: "destructive"
      });
    } finally {
      setUploadingId(false);
    }
  };

  const handleDeleteIdProof = async () => {
    if (!idProof.document_file_url) return;

    try {
      // Delete file from storage
      const filePath = idProof.document_file_url.split('/').slice(-2).join('/');
      await supabase.storage.from('id-documents').remove([filePath]);

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          document_file_url: null,
          document_type: null,
          document_number: null,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setIdProof({
        document_type: "",
        document_number: "",
        document_file_url: "",
      });

      toast({
        title: "Success",
        description: "ID proof deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting ID proof:', error);
      toast({
        title: "Error",
        description: "Failed to delete ID proof",
        variant: "destructive"
      });
    }
  };

  const handleSaveIdProof = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          document_type: idProof.document_type,
          document_number: idProof.document_number,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "ID proof details updated successfully",
      });
    } catch (error) {
      console.error('Error saving ID proof:', error);
      toast({
        title: "Error",
        description: "Failed to save ID proof details",
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
      <div className="container mx-auto px-4 py-8 mt-20 bg-white">
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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Delivery Addresses</h2>
                  <Button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressForm({
                        name: "",
                        phone: "",
                        pincode: "",
                        state: "",
                        city: "",
                        locality: "",
                        address: "",
                        address_type: "home",
                        is_default: false,
                      });
                      setAddressDialogOpen(true);
                    }}
                    className="bg-black hover:bg-gray-800 rounded-none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <p className="text-gray-600">No addresses added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="border border-gray-200 p-4 rounded-none relative"
                      >
                        {address.is_default && (
                          <span className="absolute top-4 right-4 bg-black text-white text-xs px-2 py-1">
                            Default
                          </span>
                        )}
                        <div className="mb-2">
                          <span className="font-semibold">{address.name}</span>
                          <span className="ml-2 text-sm text-gray-600 capitalize">
                            ({address.address_type})
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{address.address}</p>
                        <p className="text-sm text-gray-700">
                          {address.locality}, {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                        
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                            className="rounded-none"
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAddressToDelete(address.id);
                              setDeleteAddressDialogOpen(true);
                            }}
                            className="rounded-none text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "identification" && (
              <div className="border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Identification Details</h2>
                  <Button
                    onClick={() => setEditMode(true)}
                    className="bg-black hover:bg-gray-800 rounded-none"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Document
                  </Button>
                </div>

                {!idProof.document_file_url && !editMode ? (
                  <p className="text-gray-600">No identification documents added yet.</p>
                ) : idProof.document_file_url && !editMode ? (
                  <div className="border border-gray-200 p-4 rounded-none">
                    <div className="mb-2">
                      <span className="font-semibold capitalize">
                        {idProof.document_type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      Document Number: {idProof.document_number || "Not provided"}
                    </p>
                    <a
                      href={idProof.document_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditMode(true)}
                        className="rounded-none"
                      >
                        <Pencil className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteIdProof}
                        className="rounded-none text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm mb-2 block">Document Type</Label>
                      <select
                        value={idProof.document_type}
                        onChange={(e) => setIdProof({ ...idProof, document_type: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 bg-white rounded-none"
                      >
                        <option value="">Select Document Type</option>
                        <option value="aadhaar">Aadhaar Card</option>
                        <option value="pan">PAN Card</option>
                        <option value="passport">Passport</option>
                        <option value="driving_license">Driving License</option>
                        <option value="voter_id">Voter ID</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Document Number</Label>
                      <Input
                        value={idProof.document_number}
                        onChange={(e) => setIdProof({ ...idProof, document_number: e.target.value })}
                        placeholder="Enter document number"
                        className="rounded-none"
                      />
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Upload Document</Label>
                      <p className="text-xs text-gray-500 mb-2">
                        Accepted formats: JPG, PNG, PDF (Max 5MB)
                      </p>
                      
                      {idProof.document_file_url ? (
                        <div className="border border-gray-200 p-4 rounded-none mb-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium mb-1">Document Uploaded</p>
                              <a
                                href={idProof.document_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                              >
                                View Document
                              </a>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById('id-proof-upload')?.click()}
                              className="rounded-none"
                              disabled={uploadingId}
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Replace
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('id-proof-upload')?.click()}
                          className="rounded-none w-full"
                          disabled={uploadingId}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {uploadingId ? "Uploading..." : "Upload Document"}
                        </Button>
                      )}
                      
                      <input
                        id="id-proof-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,application/pdf"
                        onChange={handleIdProofUpload}
                        className="hidden"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(false)}
                        className="rounded-none"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          handleSaveIdProof();
                          setEditMode(false);
                        }}
                        className="bg-black hover:bg-gray-800 rounded-none"
                      >
                        Save Details
                      </Button>
                    </div>
                  </div>
                )}
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

      {/* Add/Edit Address Dialog */}
      <Dialog open={addressDialogOpen} onOpenChange={setAddressDialogOpen}>
        <DialogContent className="rounded-none max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div>
              <Label className="text-sm mb-2 block">Full Name *</Label>
              <Input
                value={addressForm.name}
                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                placeholder="Full Name"
                className="rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">Phone Number *</Label>
              <Input
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                placeholder="10-digit mobile number"
                className="rounded-none"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-sm mb-2 block">Address *</Label>
              <Input
                value={addressForm.address}
                onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                placeholder="House No., Building Name"
                className="rounded-none"
              />
            </div>

            <div className="col-span-2">
              <Label className="text-sm mb-2 block">Locality *</Label>
              <Input
                value={addressForm.locality}
                onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })}
                placeholder="Road name, Area, Colony"
                className="rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">City *</Label>
              <Input
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                placeholder="City"
                className="rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">State *</Label>
              <Input
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                placeholder="State"
                className="rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">Pincode *</Label>
              <Input
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                placeholder="6-digit pincode"
                className="rounded-none"
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">Address Type *</Label>
              <select
                value={addressForm.address_type}
                onChange={(e) => setAddressForm({ ...addressForm, address_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-none"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm">Set as default address</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddressDialogOpen(false);
                setEditingAddress(null);
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddressSubmit}
              className="bg-black hover:bg-gray-800 rounded-none"
            >
              {editingAddress ? "Update Address" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Address Confirmation Dialog */}
      <Dialog open={deleteAddressDialogOpen} onOpenChange={setDeleteAddressDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700 py-4">
            Are you sure you want to delete this address? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteAddressDialogOpen(false);
                setAddressToDelete(null);
              }}
              className="rounded-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAddress}
              className="bg-red-600 hover:bg-red-700 text-white rounded-none"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

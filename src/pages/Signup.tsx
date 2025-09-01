import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Upload, User } from "lucide-react";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: searchParams.get("email") || "",
    password: "",
    fullName: searchParams.get("name") || "",
    phoneNumber: "",
    dateOfBirth: "",
    ageRange: "",
    nationalIdType: "",
    nationalIdNumber: "",
    country: "Nigeria",
    state: "",
    lga: "",
    address: "",
    isDiaspora: false,
    profilePictureUrl: ""
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    // Check if user is already logged in and has complete profile
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (profile && profile.full_name && profile.phone_number) {
          navigate("/");
        }
      }
    };
    checkAuth();
  }, [navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleIdDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdDocument(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userId: string;
      
      // Check if user is already signed up (Google OAuth case)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        userId = session.user.id;
      } else {
        // Create new user
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              full_name: formData.fullName
            }
          }
        });

        if (error) {
          throw error;
        }

        if (!data.user) {
          throw new Error("Failed to create user");
        }

        userId = data.user.id;
      }

      // Upload profile picture if provided
      let profilePictureUrl = "";
      if (profileImage) {
        setUploadingImage(true);
        const profilePath = await uploadFile(profileImage, "nnypapublic", userId);
        const { data: { publicUrl } } = supabase.storage
          .from("nnypapublic")
          .getPublicUrl(profilePath);
        profilePictureUrl = publicUrl;
      }

      // Upload ID document if provided
      let idDocumentUrl = "";
      if (idDocument) {
        const idPath = await uploadFile(idDocument, "nnypadocuments", userId);
        idDocumentUrl = idPath;
      }

      // Create or update profile
      const profileData = {
        user_id: userId,
        email: formData.email,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth || null,
        age_range: formData.ageRange || null,
        national_id_type: formData.nationalIdType || null,
        national_id_number: formData.nationalIdNumber || null,
        country: formData.country,
        state: formData.state || null,
        lga: formData.lga || null,
        address: formData.address || null,
        is_diaspora: formData.isDiaspora,
        profile_picture_url: profilePictureUrl || null
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        throw profileError;
      }

      toast({
        title: "Success",
        description: session ? "Profile updated successfully!" : "Account created successfully! Please check your email to confirm your account.",
      });

      navigate("/");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
    "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
    "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun",
    "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-sm">
            NYEDA - Ministry of Youth Development Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={previewUrl} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadingImage ? "Uploading..." : "Upload Profile Picture"}
                    </span>
                  </Button>
                </Label>
                <Input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  disabled={!!searchParams.get("email")}
                />
              </div>

              {!searchParams.get("email") && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ageRange">Age Range</Label>
                <Select value={formData.ageRange} onValueChange={(value) => setFormData(prev => ({ ...prev, ageRange: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="26-35">26-35</SelectItem>
                    <SelectItem value="36-45">36-45</SelectItem>
                    <SelectItem value="46-55">46-55</SelectItem>
                    <SelectItem value="56+">56+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Identity Information */}
              <div className="space-y-2">
                <Label htmlFor="nationalIdType">ID Type</Label>
                <Select value={formData.nationalIdType} onValueChange={(value) => setFormData(prev => ({ ...prev, nationalIdType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nin">National Identity Number (NIN)</SelectItem>
                    <SelectItem value="bvn">Bank Verification Number (BVN)</SelectItem>
                    <SelectItem value="drivers_license">Driver's License</SelectItem>
                    <SelectItem value="voters_card">Voter's Card</SelectItem>
                    <SelectItem value="international_passport">International Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalIdNumber">ID Number</Label>
                <Input
                  id="nationalIdNumber"
                  value={formData.nationalIdNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, nationalIdNumber: e.target.value }))}
                />
              </div>

              {/* Location Information */}
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {nigerianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lga">Local Government Area</Label>
                <Input
                  id="lga"
                  value={formData.lga}
                  onChange={(e) => setFormData(prev => ({ ...prev, lga: e.target.value }))}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                rows={2}
              />
            </div>

            {/* ID Document Upload */}
            <div className="space-y-2">
              <Label htmlFor="id-document">Upload ID Document *</Label>
              <Input
                id="id-document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleIdDocumentChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Upload a clear copy of your identification document (PDF, JPG, PNG)
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {searchParams.get("email") ? "Complete Profile" : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
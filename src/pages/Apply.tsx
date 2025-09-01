import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, FileText, Building, Globe, DollarSign, Users, Target } from "lucide-react";
import { User, Session } from "@supabase/supabase-js";

const Apply = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    business_name: "",
    business_type: "",
    business_description: "",
    business_sector: "",
    registration_number: "",
    number_of_employees: "",
    annual_revenue_range: "",
    business_address: "",
    business_state: "",
    business_lga: "",
    website_url: "",
    years_in_operation: "",
    business_goals: "",
    expected_impact: "",
    funding_requirements: "",
    employment_plan: "",
    social_media_links: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: ""
    }
  });

  // File uploads
  const [files, setFiles] = useState({
    cac_document: null as File | null,
    business_plan: null as File | null,
    financial_statements: null as File | null,
    id_document: null as File | null
  });

  const businessTypes = [
    "Sole Proprietorship", "Partnership", "Limited Liability Company", "Public Limited Company", 
    "Cooperative Society", "Non-Governmental Organization", "Social Enterprise"
  ];

  const businessSectors = [
    "Agriculture", "Technology", "Manufacturing", "Services", "Trade & Commerce", 
    "Healthcare", "Education", "Transportation", "Construction", "Tourism & Hospitality",
    "Creative Industries", "Financial Services", "Energy & Renewable Resources"
  ];

  const employeeRanges = [
    "1-5", "6-10", "11-25", "26-50", "51-100", "101-500", "500+"
  ];

  const revenueRanges = [
    "Below ₦1 Million", "₦1M - ₦5M", "₦5M - ₦10M", "₦10M - ₦50M", 
    "₦50M - ₦100M", "₦100M - ₦500M", "Above ₦500M"
  ];

  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo",
    "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa",
    "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
  ];

  useEffect(() => {
    // Check authentication
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_media_links: {
        ...prev.social_media_links,
        [platform]: value
      }
    }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      // Upload files
      const fileUrls: any = {};

      if (files.cac_document) {
        const cacPath = `${user.id}/cac_document_${Date.now()}.${files.cac_document.name.split('.').pop()}`;
        await uploadFile(files.cac_document, 'nnypadocuments', cacPath);
        fileUrls.cac_document_url = cacPath;
      }

      if (files.business_plan) {
        const planPath = `${user.id}/business_plan_${Date.now()}.${files.business_plan.name.split('.').pop()}`;
        await uploadFile(files.business_plan, 'nnypadocuments', planPath);
        fileUrls.business_plan_url = planPath;
      }

      if (files.financial_statements) {
        const financialPath = `${user.id}/financial_statements_${Date.now()}.${files.financial_statements.name.split('.').pop()}`;
        await uploadFile(files.financial_statements, 'nnypadocuments', financialPath);
        fileUrls.financial_statements_url = financialPath;
      }

      if (files.id_document) {
        const idPath = `${user.id}/id_document_${Date.now()}.${files.id_document.name.split('.').pop()}`;
        await uploadFile(files.id_document, 'nnypadocuments', idPath);
        fileUrls.applicant_id_document_url = idPath;
      }

      // Submit application
      const { error } = await supabase
        .from('endorsement_applications')
        .insert({
          ...formData,
          user_id: user.id,
          years_in_operation: parseInt(formData.years_in_operation) || 0,
          social_media_links: formData.social_media_links,
          ...fileUrls
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your endorsement application has been submitted successfully!",
      });

      navigate("/dashboard");

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">NYEDA Application</h1>
              <p className="text-sm text-muted-foreground">(National Youth Endorsement Analyzer)</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">
              Ministry of Youth Development Endorsement Application
            </CardTitle>
            <p className="text-muted-foreground">
              Complete all sections to apply for official government endorsement
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Business Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Business Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => handleInputChange("business_name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="business_type">Business Type *</Label>
                    <Select onValueChange={(value) => handleInputChange("business_type", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="business_sector">Business Sector *</Label>
                    <Select onValueChange={(value) => handleInputChange("business_sector", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessSectors.map(sector => (
                          <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="registration_number">CAC Registration Number</Label>
                    <Input
                      id="registration_number"
                      value={formData.registration_number}
                      onChange={(e) => handleInputChange("registration_number", e.target.value)}
                      placeholder="e.g., RC1234567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="business_description">Business Description *</Label>
                  <Textarea
                    id="business_description"
                    value={formData.business_description}
                    onChange={(e) => handleInputChange("business_description", e.target.value)}
                    placeholder="Describe your business activities, products/services offered..."
                    required
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Location & Operations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business_state">State *</Label>
                    <Select onValueChange={(value) => handleInputChange("business_state", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="business_lga">Local Government Area *</Label>
                    <Input
                      id="business_lga"
                      value={formData.business_lga}
                      onChange={(e) => handleInputChange("business_lga", e.target.value)}
                      placeholder="Enter LGA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="business_address">Business Address *</Label>
                  <Textarea
                    id="business_address"
                    value={formData.business_address}
                    onChange={(e) => handleInputChange("business_address", e.target.value)}
                    placeholder="Enter complete business address"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website_url">Website URL</Label>
                    <Input
                      id="website_url"
                      type="url"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange("website_url", e.target.value)}
                      placeholder="https://www.example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="years_in_operation">Years in Operation</Label>
                    <Input
                      id="years_in_operation"
                      type="number"
                      min="0"
                      value={formData.years_in_operation}
                      onChange={(e) => handleInputChange("years_in_operation", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Business Scale */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Business Scale & Performance</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number_of_employees">Number of Employees</Label>
                    <Select onValueChange={(value) => handleInputChange("number_of_employees", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee range" />
                      </SelectTrigger>
                      <SelectContent>
                        {employeeRanges.map(range => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="annual_revenue_range">Annual Revenue Range</Label>
                    <Select onValueChange={(value) => handleInputChange("annual_revenue_range", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select revenue range" />
                      </SelectTrigger>
                      <SelectContent>
                        {revenueRanges.map(range => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Goals & Impact */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Goals & Expected Impact</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="business_goals">Business Goals & Objectives</Label>
                    <Textarea
                      id="business_goals"
                      value={formData.business_goals}
                      onChange={(e) => handleInputChange("business_goals", e.target.value)}
                      placeholder="Describe your short-term and long-term business goals..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="expected_impact">Expected Social/Economic Impact</Label>
                    <Textarea
                      id="expected_impact"
                      value={formData.expected_impact}
                      onChange={(e) => handleInputChange("expected_impact", e.target.value)}
                      placeholder="How will your business contribute to youth development and national growth..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="employment_plan">Employment & Job Creation Plan</Label>
                    <Textarea
                      id="employment_plan"
                      value={formData.employment_plan}
                      onChange={(e) => handleInputChange("employment_plan", e.target.value)}
                      placeholder="How many jobs do you plan to create? What types of positions..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="funding_requirements">Funding Requirements (if any)</Label>
                    <Textarea
                      id="funding_requirements"
                      value={formData.funding_requirements}
                      onChange={(e) => handleInputChange("funding_requirements", e.target.value)}
                      placeholder="Describe any funding needs and how it will be used..."
                    />
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Social Media Presence</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={formData.social_media_links.facebook}
                      onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                      placeholder="Facebook page URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="twitter">Twitter/X</Label>
                    <Input
                      id="twitter"
                      value={formData.social_media_links.twitter}
                      onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                      placeholder="Twitter profile URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={formData.social_media_links.instagram}
                      onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                      placeholder="Instagram profile URL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      value={formData.social_media_links.linkedin}
                      onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                      placeholder="LinkedIn company page URL"
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Required Documents</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cac_document">CAC Certificate</Label>
                    <Input
                      id="cac_document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("cac_document", e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">Upload CAC registration certificate</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_plan">Business Plan</Label>
                    <Input
                      id="business_plan"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange("business_plan", e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">Upload detailed business plan (PDF/DOC)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="financial_statements">Financial Statements</Label>
                    <Input
                      id="financial_statements"
                      type="file"
                      accept=".pdf,.xlsx,.xls"
                      onChange={(e) => handleFileChange("financial_statements", e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">Upload recent financial records</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id_document">Government ID</Label>
                    <Input
                      id="id_document"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange("id_document", e.target.files?.[0] || null)}
                    />
                    <p className="text-xs text-muted-foreground">Upload National ID, Driver's License, or Passport</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading || uploading}
                  className="min-w-48"
                >
                  {uploading && <Upload className="mr-2 h-4 w-4 animate-spin" />}
                  {uploading ? "Uploading..." : loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Apply;
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
import { ArrowLeft, Upload, FileText, Building, Globe, Users, Target, CheckSquare } from "lucide-react";
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
    // Section 1: Org Overview
    org_name: "",
    org_address: "",
    contact_person: "",
    is_registered_ministry: "",
    
    // Section 2: Project/Initiative
    project_title: "",
    project_description: "",
    project_objectives: "",
    project_scope: "",
    project_duration: "",
    estimated_beneficiaries: "",
    key_outcomes: "",
    
    // Section 3: NYP Alignment
    nyp_pillar: "",
    thematic_area: "",
    nyp_objectives: []
  });

  // NYP Policy Framework Data
  const nypPolicyFramework = {
    strategic_pillars: [
      {
        title: "Economic Transformation, Entrepreneurship and Job Creation",
        thematic_areas: [
          "Youth enterprise development and Job creation",
          "Youth and Agriculture", 
          "Youth in the Digital, Green and Blue economy"
        ],
        objectives: [
          "Create 12 million jobs over 4 years",
          "Train 10 million youths in agriculture",
          "Enhance digital skills for 10 million youths annually"
        ]
      },
      {
        title: "Physical Health and Mental Wellbeing for Youths",
        thematic_areas: [
          "Physical wellbeing",
          "Mental health of Youths"
        ],
        objectives: [
          "Improve youth health services",
          "Integrate mental health education",
          "Deliver health info via digital platforms"
        ]
      },
      {
        title: "Peace, Security, Rights and Sustainable Environments",
        thematic_areas: [
          "Youths for Peace building",
          "Human rights and freedoms",
          "Youth Inclusion in Climate Change Action"
        ],
        objectives: [
          "Train 1 million youths in peacebuilding",
          "Educate on human rights and cyber safety",
          "Train 100,000 youths in green skills"
        ]
      },
      {
        title: "Gender, Social Inclusion and Equitable Opportunities for All Youth",
        thematic_areas: [
          "Inclusive programs for female, disabled, grassroots youths",
          "Targeted programs for marginalized youths"
        ],
        objectives: [
          "Promote political inclusion",
          "Ensure 40% female, 10% disabled, 40% grassroots youth participation",
          "Create opportunities for 5 million marginalized youths"
        ]
      },
      {
        title: "Quality Education and Capacity Development for Lifelong Learning",
        thematic_areas: [
          "Improve access to education",
          "Life skills training"
        ],
        objectives: [
          "Integrate life skills in schools",
          "Establish 1800 literacy centers", 
          "Support STEM education with bursaries"
        ]
      },
      {
        title: "Partnerships and Effective Policy Implementation",
        thematic_areas: [
          "Multi-sectoral collaboration",
          "Policy implementation"
        ],
        objectives: [
          "Coordinate youth initiatives with CSOs",
          "Develop youth database",
          "Conduct bi-annual youth status reports"
        ]
      }
    ]
  };

  const projectScopes = ["Nationwide", "Zonal", "State", "LGA", "Community"];
  const projectDurations = ["3 months", "6 months", "1 year", "2 years", "Other (specify)"];
  const ministryRegistrationOptions = ["Yes", "No", "In Progress"];

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

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      nyp_objectives: checked 
        ? [...prev.nyp_objectives, objective]
        : prev.nyp_objectives.filter(obj => obj !== objective)
    }));
  };

  const getSelectedPillar = () => {
    return nypPolicyFramework.strategic_pillars.find(p => p.title === formData.nyp_pillar);
  };

// Remove file upload logic for now

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

    try {
      // Submit application with NYP alignment data
      const { error } = await supabase
        .from('endorsement_applications')
        .insert({
          user_id: user.id,
          business_name: formData.org_name,
          business_description: formData.project_description,
          business_goals: formData.project_objectives,
          expected_impact: formData.key_outcomes,
          business_address: formData.org_address,
          business_state: "Nigeria", // Default for organizations
          business_lga: "N/A", // Will be in additional_certifications
          business_sector: "Youth Development", // Default for NYP alignment
          business_type: "Organization", // Default
          additional_certifications: {
            contact_person: formData.contact_person,
            is_registered_ministry: formData.is_registered_ministry,
            project_title: formData.project_title,
            project_scope: formData.project_scope,
            project_duration: formData.project_duration,
            estimated_beneficiaries: formData.estimated_beneficiaries,
            nyp_pillar: formData.nyp_pillar,
            thematic_area: formData.thematic_area,
            nyp_objectives: formData.nyp_objectives
          }
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your NYP alignment application has been submitted successfully!",
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
            <div className="flex items-center gap-3">
              <img src="/NYEDA_logo.png" alt="NYEDA Logo" className="h-8 w-8 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-primary">NYP Alignment Application</h1>
                <p className="text-sm text-muted-foreground">(National Youth Policy)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">
              National Youth Policy Alignment Application
            </CardTitle>
            <p className="text-muted-foreground">
              Align your project/initiative with the National Youth Policy framework
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Section 1: Organization Overview */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Section 1: Organization Overview</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="org_name">Organization Name *</Label>
                    <Input
                      id="org_name"
                      value={formData.org_name}
                      onChange={(e) => handleInputChange("org_name", e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact_person">Contact Person *</Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) => handleInputChange("contact_person", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="org_address">Organization Address *</Label>
                  <Textarea
                    id="org_address"
                    value={formData.org_address}
                    onChange={(e) => handleInputChange("org_address", e.target.value)}
                    placeholder="Enter complete organization address"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="is_registered_ministry">Is your Organization registered with the Ministry? (in case of NGO)</Label>
                  <Select onValueChange={(value) => handleInputChange("is_registered_ministry", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select registration status" />
                    </SelectTrigger>
                    <SelectContent>
                      {ministryRegistrationOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Section 2: Project/Initiative */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Section 2: Project/Initiative</h3>
                </div>

                <div>
                  <Label htmlFor="project_title">Title of Project/Initiative *</Label>
                  <Input
                    id="project_title"
                    value={formData.project_title}
                    onChange={(e) => handleInputChange("project_title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="project_description">Brief Description or Overview of Project *</Label>
                  <Textarea
                    id="project_description"
                    value={formData.project_description}
                    onChange={(e) => handleInputChange("project_description", e.target.value)}
                    placeholder="Provide a comprehensive overview of your project..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="project_objectives">Key Objectives</Label>
                  <Textarea
                    id="project_objectives"
                    value={formData.project_objectives}
                    onChange={(e) => handleInputChange("project_objectives", e.target.value)}
                    placeholder="List the main objectives of your project..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="project_scope">Project Scope</Label>
                    <Select onValueChange={(value) => handleInputChange("project_scope", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project scope" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectScopes.map(scope => (
                          <SelectItem key={scope} value={scope}>{scope}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="project_duration">Project Duration</Label>
                    <Select onValueChange={(value) => handleInputChange("project_duration", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectDurations.map(duration => (
                          <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimated_beneficiaries">Estimated Number of Beneficiaries</Label>
                  <Input
                    id="estimated_beneficiaries"
                    type="number"
                    value={formData.estimated_beneficiaries}
                    onChange={(e) => handleInputChange("estimated_beneficiaries", e.target.value)}
                    placeholder="Enter estimated number of beneficiaries"
                  />
                </div>

                <div>
                  <Label htmlFor="key_outcomes">Key Outcomes</Label>
                  <Textarea
                    id="key_outcomes"
                    value={formData.key_outcomes}
                    onChange={(e) => handleInputChange("key_outcomes", e.target.value)}
                    placeholder="Describe the expected key outcomes of your project..."
                  />
                </div>
              </div>

              {/* Section 3: NYP Alignment */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">Section 3: Alignment to National Youth Policy (NYP)</h3>
                </div>

                <div>
                  <Label htmlFor="nyp_pillar">Select NYP Pillar to which your project aligns *</Label>
                  <Select onValueChange={(value) => handleInputChange("nyp_pillar", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select NYP Strategic Pillar" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {nypPolicyFramework.strategic_pillars.map(pillar => (
                        <SelectItem key={pillar.title} value={pillar.title} className="text-sm">
                          {pillar.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.nyp_pillar && (
                  <div>
                    <Label htmlFor="thematic_area">Select Thematic Focus Area</Label>
                    <Select onValueChange={(value) => handleInputChange("thematic_area", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select thematic focus area" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {getSelectedPillar()?.thematic_areas.map(area => (
                          <SelectItem key={area} value={area} className="text-sm">
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.nyp_pillar && (
                  <div>
                    <Label>Select NYP Thematic Objectives (multiple selection allowed)</Label>
                    <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                      {getSelectedPillar()?.objectives.map(objective => (
                        <div key={objective} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`objective-${objective}`}
                            checked={formData.nyp_objectives.includes(objective)}
                            onChange={(e) => handleObjectiveChange(objective, e.target.checked)}
                            className="h-4 w-4 text-primary border-2 border-muted rounded focus:ring-primary"
                          />
                          <label htmlFor={`objective-${objective}`} className="text-sm text-foreground">
                            {objective}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading}
                  className="min-w-48"
                >
                  {loading ? "Submitting..." : "Submit NYP Alignment Application"}
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
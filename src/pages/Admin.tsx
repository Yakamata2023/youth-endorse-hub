import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Users, 
  MapPin, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Shield
} from "lucide-react";

interface Application {
  id: string;
  business_name: string;
  business_type: string;
  business_sector: string;
  application_status: string;
  nnypa_score: number | null;
  submitted_at: string;
  user_id: string;
  cac_document_url: string | null;
  business_plan_url: string | null;
  financial_statements_url: string | null;
  applicant_id_document_url: string | null;
  business_state: string;
  business_lga: string;
}

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  state: string | null;
  lga: string | null;
  country: string | null;
  is_diaspora: boolean;
  created_at: string;
  profile_picture_url: string | null;
  user_id: string;
}

interface AdminStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  totalUsers: number;
  averageScore: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    totalUsers: 0,
    averageScore: 0
  });
  const [isAdmin, setIsAdmin] = useState(false);

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

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      // Check if user is admin
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (adminData) {
        setIsAdmin(true);
        await fetchAdminData();
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges to access this page",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to verify admin status",
        variant: "destructive"
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminData = async () => {
    try {
      // Fetch applications
      const { data: applicationsData, error: appsError } = await supabase
        .from('endorsement_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (appsError) throw appsError;

      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      setApplications(applicationsData || []);
      setProfiles(profilesData || []);

      // Calculate stats
      const totalApplications = applicationsData?.length || 0;
      const pendingApplications = applicationsData?.filter(app => app.application_status === 'pending').length || 0;
      const approvedApplications = applicationsData?.filter(app => app.application_status === 'approved').length || 0;
      const rejectedApplications = applicationsData?.filter(app => app.application_status === 'rejected').length || 0;
      const totalUsers = profilesData?.length || 0;
      
      const scoresWithValues = applicationsData?.filter(app => app.nnypa_score !== null) || [];
      const averageScore = scoresWithValues.length > 0 
        ? Math.round(scoresWithValues.reduce((acc, app) => acc + (app.nnypa_score || 0), 0) / scoresWithValues.length)
        : 0;

      setStats({
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalUsers,
        averageScore
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch admin data",
        variant: "destructive"
      });
    }
  };

  const downloadFile = async (bucket: string, path: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${filename}`,
      });
    } catch (error: any) {
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string, score?: number) => {
    try {
      const updateData: any = { 
        application_status: status,
        reviewed_at: new Date().toISOString()
      };

      if (score !== undefined) {
        updateData.nnypa_score = score;
      }

      const { error } = await supabase
        .from('endorsement_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Application status changed to ${status}`,
      });

      // Refresh data
      await fetchAdminData();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
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
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">NYEDA Admin Panel</h1>
                <p className="text-sm text-muted-foreground">(National Youth Endorsement Analyzer)</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <div className="text-xs text-muted-foreground">Total Applications</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.pendingApplications}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.approvedApplications}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.rejectedApplications}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Endorsement Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Business Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell className="font-medium">{app.business_name}</TableCell>
                          <TableCell>{app.business_type}</TableCell>
                          <TableCell>{app.business_sector}</TableCell>
                          <TableCell>{app.business_state}, {app.business_lga}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(app.application_status)}>
                              {app.application_status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {app.nnypa_score ? `${app.nnypa_score}%` : 'N/A'}
                          </TableCell>
                          <TableCell>{formatDate(app.submitted_at)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {app.cac_document_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadFile('nnypadocuments', app.cac_document_url!, 'cac_certificate.pdf')}
                                >
                                  <Download className="h-3 w-3" />
                                </Button>
                              )}
                              {app.business_plan_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadFile('nnypadocuments', app.business_plan_url!, 'business_plan.pdf')}
                                >
                                  <FileText className="h-3 w-3" />
                                </Button>
                              )}
                              {app.applicant_id_document_url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => downloadFile('nnypadocuments', app.applicant_id_document_url!, 'id_document.pdf')}
                                >
                                  <Users className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateApplicationStatus(app.id, 'approved', 85)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateApplicationStatus(app.id, 'rejected')}
                              >
                                Reject
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Profile Picture</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.full_name}</TableCell>
                          <TableCell>{profile.email}</TableCell>
                          <TableCell>{profile.phone_number || 'N/A'}</TableCell>
                          <TableCell>
                            {profile.is_diaspora 
                              ? profile.country || 'Diaspora'
                              : `${profile.state || 'N/A'}, ${profile.lga || 'N/A'}`
                            }
                          </TableCell>
                          <TableCell>
                            <Badge variant={profile.is_diaspora ? "secondary" : "default"}>
                              {profile.is_diaspora ? 'Diaspora' : 'Resident'}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(profile.created_at)}</TableCell>
                          <TableCell>
                            {profile.profile_picture_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile('nnypapublic', profile.profile_picture_url!, 'profile_picture.jpg')}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Group applications by state */}
                    {applications.reduce((acc: any, app) => {
                      const state = app.business_state;
                      acc[state] = (acc[state] || 0) + 1;
                      return acc;
                    }, {}) && Object.entries(
                      applications.reduce((acc: any, app) => {
                        const state = app.business_state;
                        acc[state] = (acc[state] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort(([,a]: any, [,b]: any) => b - a).slice(0, 10).map(([state, count]: any) => (
                      <div key={state} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{state}</span>
                        <Badge variant="secondary">{count} applications</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Business Sectors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Group applications by sector */}
                    {Object.entries(
                      applications.reduce((acc: any, app) => {
                        const sector = app.business_sector;
                        acc[sector] = (acc[sector] || 0) + 1;
                        return acc;
                      }, {})
                    ).sort(([,a]: any, [,b]: any) => b - a).slice(0, 10).map(([sector, count]: any) => (
                      <div key={sector} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{sector}</span>
                        <Badge variant="secondary">{count} applications</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
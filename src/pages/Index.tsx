import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Target, 
  Users, 
  FileText, 
  ArrowRight,
  CheckCircle,
  Globe,
  BookOpen
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Official Government Platform",
      description: "Authorized by the Federal Ministry of Youth Development"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "AI-Powered Analysis",
      description: "NYEDA analyzes your application alignment with policy objectives"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "For All Nigerian Youth",
      description: "Supporting both resident and diaspora youth aged 18-45"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Streamlined Process",
      description: "Digital document submission and automated scoring"
    }
  ];

  const stats = [
    { label: "Youth Served", value: "10,000+", color: "text-primary" },
    { label: "Applications Processed", value: "5,000+", color: "text-green-600" },
    { label: "Success Rate", value: "85%", color: "text-blue-600" },
    { label: "Average Score", value: "78%", color: "text-purple-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Floating NNYP Policy Button - Removed since it's now global */}

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Ministry Info */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <p className="text-sm text-muted-foreground">
              Federal Ministry of Youth Development • Hon. Ayodele Olawande, Minister
            </p>
          </div>

          <div className="space-y-4">
            <img src="/NYEDA_logo.png" alt="ENDORSA / NYEDA Logo" className="h-16 md:h-20 mx-auto" />
            <h1 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
            >
              NYEDA
            </h1>
            <p className="text-lg text-muted-foreground">
              (National Youth Endorsement Analyzer)
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-foreground max-w-3xl mx-auto">
              Official Endorsement Platform for Nigerian Youth
            </h2>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Apply for official endorsement by the Ministry of Youth Development. 
            Your endorsement application will be analyzed in alignment with the Nigerian 
            National Youth Policy to provide instant scoring and feedback.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6"
            >
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate("/policy")}
              className="text-lg px-8 py-6"
            >
              <FileText className="mr-2 h-5 w-5" />
              View NYP (National Youth Policy)
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold mb-4">Why Choose NYEDA?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our platform bridges the gap between young entrepreneurs and government support, 
            making the endorsement process transparent, efficient, and accessible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent process to get your business endorsed
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="text-xl font-semibold">Create Account</h4>
              <p className="text-muted-foreground">
                Sign up with Google OAuth and complete your profile with national ID verification
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="text-xl font-semibold">Submit Application</h4>
              <p className="text-muted-foreground">
                Provide application details and upload required documents (CAC, business plan, etc.)
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="text-xl font-semibold">Get Results</h4>
              <p className="text-muted-foreground">
                Receive instant NYEDA scoring and detailed analysis of your policy alignment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">
                Empowering Nigerian Youth Development
              </CardTitle>
              <CardDescription className="text-base">
                This platform represents the Ministry's commitment to supporting youth entrepreneurship 
                and ensuring all endorsements align with national development goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Policy Alignment</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    Ensure your application contributes to Nigeria's youth development objectives
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Transparent Process</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    Clear scoring criteria and detailed feedback on your application
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">Digital Efficiency</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    Fast, paperless process with secure document management
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">Global Reach</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    Accessible to Nigerian youth worldwide, including diaspora
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-3xl font-bold">Ready to Get Started?</h3>
            <p className="text-lg text-muted-foreground">
              Join thousands of Nigerian youth who have successfully obtained government 
              endorsements through NYEDA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")}>
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/policy")}>
                Learn About NNYP
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <div 
            className="flex items-center justify-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <img src="/NYEDA_logo.png" alt="NYEDA Logo" className="h-6 w-6 object-contain" />
            <span className="font-semibold">NYEDA</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2024 Federal Ministry of Youth Development, Nigeria. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            National Youth Endorsement Analyzer - Empowering Youth, Building Nigeria
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
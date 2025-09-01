import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Target, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Heart,
  Lightbulb,
  Globe,
  Shield
} from "lucide-react";

const Policy = () => {
  const navigate = useNavigate();

  const policyAreas = [
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Education and Skills Development",
      description: "Enhancing educational opportunities and vocational training for Nigerian youth",
      color: "bg-blue-100 text-blue-800"
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Employment and Entrepreneurship",
      description: "Creating job opportunities and supporting youth-led businesses",
      color: "bg-green-100 text-green-800"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Health and Well-being",
      description: "Promoting physical and mental health among Nigerian youth",
      color: "bg-red-100 text-red-800"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Social Development",
      description: "Building strong communities and social cohesion",
      color: "bg-purple-100 text-purple-800"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Innovation and Technology",
      description: "Fostering technological advancement and digital literacy",
      color: "bg-orange-100 text-orange-800"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Civic Engagement",
      description: "Encouraging youth participation in governance and community development",
      color: "bg-teal-100 text-teal-800"
    }
  ];

  const objectives = [
    "Reduce youth unemployment by 50% through skills development and job creation programs",
    "Increase youth participation in governance and decision-making processes",
    "Improve access to quality education and vocational training for all Nigerian youth",
    "Promote youth entrepreneurship and support startup initiatives",
    "Enhance youth health services and promote healthy lifestyle choices",
    "Foster innovation and technological advancement among young Nigerians",
    "Strengthen youth organizations and community-based initiatives",
    "Combat social vices and promote positive youth development"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-primary">NNYP</h1>
              <p className="text-sm text-muted-foreground">
                Nigerian National Youth Policy
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Ministry Information */}
        <Card className="border-primary/20">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-4">
              <Shield className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-xl text-primary">
                  Federal Ministry of Youth Development
                </CardTitle>
                <p className="text-muted-foreground">
                  Hon. Ayodele Olawande - Minister of Youth Development
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-muted-foreground leading-relaxed">
              The National Youth Endorsement Analyzer (NYEDA) platform represents a groundbreaking 
              initiative by the Federal Ministry of Youth Development to streamline and enhance the 
              endorsement process for youth-led applications. This platform ensures that all 
              endorsement applications align with the strategic objectives of the Nigerian National Youth Policy, 
              promoting sustainable development and empowering Nigerian youth both at home and in the diaspora.
            </p>
          </CardContent>
        </Card>

        {/* Policy Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Policy Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              The Nigerian National Youth Policy (NNYP) is a comprehensive framework designed to harness 
              the potential of Nigerian youth aged 18-45 years. It provides strategic direction for youth 
              development programs and ensures coordinated efforts across all sectors to maximize youth 
              contribution to national development.
            </p>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Vision Statement</h4>
              <p className="text-sm text-muted-foreground italic">
                "To develop a generation of Nigerian youth who are self-reliant, patriotic, and 
                capable of contributing meaningfully to national development in a globally competitive environment."
              </p>
            </div>

            <div className="bg-secondary/50 p-4 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Mission Statement</h4>
              <p className="text-sm text-muted-foreground italic">
                "To provide an enabling environment for the holistic development of Nigerian youth 
                through coordinated policies, programs, and partnerships that promote their active 
                participation in nation-building."
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Policy Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Key Policy Areas</CardTitle>
            <p className="text-muted-foreground">
              The NNYP focuses on six critical areas of youth development
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {policyAreas.map((area, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${area.color}`}>
                      {area.icon}
                    </div>
                    <h4 className="font-semibold">{area.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Policy Objectives */}
        <Card>
          <CardHeader>
            <CardTitle>Strategic Objectives</CardTitle>
            <p className="text-muted-foreground">
              Key targets the policy aims to achieve by 2030
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {objectives.map((objective, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1 shrink-0">
                    {index + 1}
                  </Badge>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {objective}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Endorsement Eligibility Criteria</CardTitle>
            <p className="text-muted-foreground">
              Your business will be evaluated based on alignment with these criteria
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">Applicant Requirements</h4>
                 <ul className="text-sm text-muted-foreground space-y-1">
                   <li>• Nigerian citizen aged 18-45 years</li>
                   <li>• Valid national identification</li>
                   <li>• Registered entity (CAC or similar)</li>
                   <li>• Clear application plan and objectives</li>
                 </ul>
              </div>
               <div className="space-y-2">
                 <h4 className="font-semibold text-primary">Application Alignment</h4>
                 <ul className="text-sm text-muted-foreground space-y-1">
                   <li>• Job creation potential</li>
                   <li>• Innovation and technology adoption</li>
                   <li>• Social impact and community benefit</li>
                   <li>• Sustainability and scalability</li>
                 </ul>
               </div>
            </div>
            
            <Separator />
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Scoring System</h4>
              <p className="text-sm text-amber-700">
                Applications are scored from 0-100% based on alignment with NNYP objectives. 
                A minimum score of 70% is typically required for endorsement consideration.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold text-primary mb-4">
              Ready to Apply for Endorsement?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Submit your application for evaluation against the Nigerian National Youth Policy. 
              Our AI-powered analyzer will assess your alignment and provide detailed feedback.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/auth")}>
                Get Started
              </Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Policy;
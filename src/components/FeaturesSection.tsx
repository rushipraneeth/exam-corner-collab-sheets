
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Share2, Target, Users } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Smart Study Sheets",
      description: "Create comprehensive study materials with rich formatting, images, and interactive elements.",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "Share your study sheets with classmates and collaborate in real-time for better learning outcomes.",
    },
    {
      icon: Target,
      title: "Exam Corner",
      description: "Access targeted exam preparation materials and practice questions tailored to your subjects.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a community of students helping each other succeed through collaborative learning.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make studying more effective and collaborative
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

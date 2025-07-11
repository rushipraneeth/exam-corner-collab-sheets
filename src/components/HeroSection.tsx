
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Collaborative Study
            <span className="text-primary block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-200">
            Create, share, and collaborate on study sheets with your peers. 
            Make learning more effective with our exam corner and collaborative tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-400">
            <Button size="lg" className="gradient-primary text-white hover:opacity-90">
              <BookOpen className="mr-2 h-5 w-5" />
              Start Creating
            </Button>
            <Button size="lg" variant="outline">
              <Users className="mr-2 h-5 w-5" />
              Join Community
            </Button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-fade-in animation-delay-600">
            <div className="bg-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-border">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Smart Study Sheets</h3>
            <p className="text-muted-foreground">Create interactive study materials with ease</p>
          </div>
          
          <div className="text-center animate-fade-in animation-delay-800">
            <div className="bg-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-border">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Team Collaboration</h3>
            <p className="text-muted-foreground">Work together with classmates in real-time</p>
          </div>
          
          <div className="text-center animate-fade-in animation-delay-1000">
            <div className="bg-card rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg border border-border">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Exam Ready</h3>
            <p className="text-muted-foreground">Prepare for exams with targeted practice</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

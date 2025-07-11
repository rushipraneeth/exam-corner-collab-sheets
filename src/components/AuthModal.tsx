
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, School, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const { login, register, isLoading } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate VIT AP email format
    if (!isValidVITAPEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use your VIT AP student email address ending with @vitapstudent.ac.in",
        variant: "destructive",
      });
      return;
    }

    try {
      if (mode === "register") {
        await register(email, password, name, collegeName);
        toast({
          title: "Success!",
          description: "Account created successfully! Please check your email to verify your account.",
        });
      } else {
        await login(email, password);
        toast({
          title: "Success!",
          description: "Successfully logged in!",
        });
      }
      onClose();
      // Reset form
      setEmail("");
      setPassword("");
      setName("");
      setCollegeName("");
      setShowPassword(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isValidVITAPEmail = (email: string) => {
    // Check if email ends with @vitapstudent.ac.in
    const vitapEmailPattern = /^[a-zA-Z0-9._%+-]+@vitapstudent\.ac\.in$/;
    return vitapEmailPattern.test(email);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-foreground">
            {mode === "login" ? "Welcome Back" : "Join StudyShare"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              VIT AP Student Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.registration@vitapstudent.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Only VIT AP student emails (@vitapstudent.ac.in) are allowed
            </p>
          </div>

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="college" className="text-sm font-medium">
                College/University Name
              </Label>
              <div className="relative">
                <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="college"
                  type="text"
                  placeholder="VIT-AP University"
                  value={collegeName}
                  onChange={(e) => setCollegeName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-white hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : (mode === "login" ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="p-0 ml-1 h-auto text-primary hover:underline"
              onClick={() => onModeChange(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;


import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "./AuthModal";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/contexts/AuthContext";

const AuthButtons = () => {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // If user is logged in, show avatar instead of auth buttons
  if (user) {
    return <UserAvatar />;
  }

  const handleLogin = () => {
    setAuthMode("login");
    setShowAuthModal(true);
  };

  const handleRegister = () => {
    setAuthMode("register");
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogin}
          className="hidden sm:flex items-center space-x-2 hover:bg-primary/10 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Button>
        <Button
          size="sm"
          onClick={handleRegister}
          className="gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Sign Up
        </Button>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};

export default AuthButtons;

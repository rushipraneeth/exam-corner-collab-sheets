
import { Button } from "@/components/ui/button";
import AuthButtons from "./AuthButtons";
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-900/95 dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-primary">StudyShare</h1>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="/" className="text-gray-600 hover:text-primary transition-colors dark:text-gray-300">
            Home
          </a>
          <a href="/exam-corner" className="text-gray-600 hover:text-primary transition-colors dark:text-gray-300">
            Exam Corner
          </a>
          <a href="/my-sheets" className="text-gray-600 hover:text-primary transition-colors dark:text-gray-300">
            My Sheets
          </a>
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;


import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CreateSheetDialog from "@/components/CreateSheetDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileText, Clock, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";

interface Sheet {
  id: string;
  title: string;
  description: string | null;
  access_code: string;
  created_at: string;
  user_id: string;
}

interface CreateSheetData {
  title: string;
  code: string;
}

const MySheets = () => {
  const [mySheets, setMySheets] = useState<Sheet[]>([]);
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [userSheetCount, setUserSheetCount] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSheets();
    if (user) {
      fetchUserSheetCount();
    }
  }, [user]);

  const fetchSheets = async () => {
    try {
      setLoading(true);
      console.log('Fetching sheets, user:', user?.id);
      
      // Fetch user's own sheets if logged in
      if (user) {
        console.log('Fetching user sheets for user:', user.id);
        const { data: userSheets, error: userError } = await supabase
          .from('problem_sheets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (userError) {
          console.error('Error fetching user sheets:', userError);
          throw userError;
        }
        
        console.log('User sheets fetched:', userSheets);
        setMySheets(userSheets || []);
      }
    } catch (error) {
      console.error('Error in fetchSheets:', error);
      toast({
        title: "Error",
        description: "Failed to load sheets. Please try refreshing the page.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserSheetCount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('count_user_sheets', {
        user_uuid: user.id
      });

      if (error) throw error;
      setUserSheetCount(data || 0);
    } catch (error) {
      console.error('Error fetching user sheet count:', error);
    }
  };

  const handleCreateSheetClick = () => {
    if (!user) {
      setAuthMode("register");
      setShowAuthModal(true);
      return;
    }

    if (userSheetCount >= 3) {
      toast({
        title: "Sheet Limit Reached",
        description: "You can only create a maximum of 3 sheets. Please delete an existing sheet to create a new one.",
        variant: "destructive"
      });
      return;
    }
  };

  const handleCreateSheet = async (sheet: CreateSheetData) => {
    try {
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to create sheets",
          variant: "destructive"
        });
        return;
      }

      if (userSheetCount >= 3) {
        toast({
          title: "Sheet Limit Reached",
          description: "You can only create a maximum of 3 sheets. Please delete an existing sheet to create a new one.",
          variant: "destructive"
        });
        return;
      }

      console.log('Creating sheet:', sheet);
      const { data, error } = await supabase
        .from('problem_sheets')
        .insert({
          title: sheet.title,
          access_code: sheet.code,
          user_id: user.id,
          is_public: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating sheet:', error);
        throw error;
      }

      console.log('Sheet created:', data);
      setMySheets(prev => [data, ...prev]);
      setUserSheetCount(prev => prev + 1);
      toast({
        title: "Sheet Created",
        description: `Sheet "${sheet.title}" created successfully with code ${sheet.code}`,
      });
    } catch (error) {
      console.error('Error creating sheet:', error);
      toast({
        title: "Error",
        description: "Failed to create sheet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSheet = async (sheetId: string, sheetTitle: string) => {
    if (!user) return;

    if (!confirm(`Are you sure you want to delete "${sheetTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('Deleting sheet:', sheetId);
      const { error } = await supabase
        .from('problem_sheets')
        .delete()
        .eq('id', sheetId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting sheet:', error);
        throw error;
      }

      setMySheets(prev => prev.filter(sheet => sheet.id !== sheetId));
      setUserSheetCount(prev => prev - 1);
      toast({
        title: "Sheet Deleted",
        description: `Sheet "${sheetTitle}" has been deleted successfully`,
      });
    } catch (error) {
      console.error('Error deleting sheet:', error);
      toast({
        title: "Error",
        description: "Failed to delete sheet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleOpenSheet = (sheet: Sheet) => {
    console.log('Opening sheet:', sheet);
    navigate(`/sheet/${sheet.id}`, { 
      state: { 
        sheetTitle: sheet.title, 
        sheetCode: sheet.access_code,
        isOwner: user?.id === sheet.user_id 
      } 
    });
  };

  const handleAccessByCode = async () => {
    if (!accessCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid access code",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Searching for sheet with code:', accessCode.trim());
      const { data, error } = await supabase
        .from('problem_sheets')
        .select('*')
        .eq('access_code', accessCode.trim())
        .single();

      if (error || !data) {
        console.error('Sheet not found:', error);
        toast({
          title: "Sheet Not Found",
          description: "No sheet found with this access code",
          variant: "destructive"
        });
        return;
      }

      console.log('Sheet found:', data);
      toast({
        title: "Sheet Found",
        description: `Found sheet: ${data.title}`,
      });
      
      // Navigate to the sheet
      handleOpenSheet(data);
      setAccessCode("");
    } catch (error) {
      console.error('Error accessing sheet:', error);
      toast({
        title: "Error",
        description: "Failed to access sheet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Less than an hour ago";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.ceil(diffDays / 30)} month${Math.ceil(diffDays / 30) > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading sheets...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              My Study Sheets
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create and manage your study sheets {user && `(${userSheetCount}/3 sheets created)`}
            </p>
          </div>
          {user ? (
            <CreateSheetDialog 
              onCreateSheet={handleCreateSheet} 
              disabled={userSheetCount >= 3}
            />
          ) : (
            <Button 
              className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              onClick={handleCreateSheetClick}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Sheet
            </Button>
          )}
        </div>

        {/* Access by Code Section */}
        <div className="mb-8 p-4 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Access Sheet by Code</h3>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Enter access code..."
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAccessByCode()}
            />
            <Button onClick={handleAccessByCode}>
              <Search className="h-4 w-4 mr-2" />
              Access
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Enter a sheet's access code to view its questions (read-only access)
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user ? (
            <>
              {mySheets.map((sheet) => (
                <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <FileText className="h-8 w-8 text-primary" />
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteSheet(sheet.id, sheet.title)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{sheet.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {sheet.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Created {formatDate(sheet.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Access Code:</span>
                        <code className="bg-muted px-2 py-1 rounded text-primary font-mono">
                          {sheet.access_code}
                        </code>
                      </div>
                      
                      <Button 
                        variant="outline" 
                        className="w-full mt-4"
                        onClick={() => handleOpenSheet(sheet)}
                      >
                        Open Sheet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Add new sheet card */}
              {userSheetCount < 3 && (
                <Card className="hover:shadow-lg transition-shadow border-dashed border-2 border-gray-300 dark:border-gray-600">
                  <CardContent className="flex flex-col items-center justify-center h-full py-12">
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">Create New Sheet</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Start a new study sheet to organize your learning materials
                    </p>
                    <CreateSheetDialog 
                      onCreateSheet={handleCreateSheet} 
                      disabled={userSheetCount >= 3}
                    />
                  </CardContent>
                </Card>
              )}

              {userSheetCount >= 3 && (
                <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600 opacity-50">
                  <CardContent className="flex flex-col items-center justify-center h-full py-12">
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">Sheet Limit Reached</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      You've reached the maximum of 3 sheets. Delete a sheet to create a new one.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <div className="col-span-full text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">Sign in to view your sheets</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create an account to start managing your study sheets.
              </p>
              <Button onClick={() => {
                setAuthMode("register");
                setShowAuthModal(true);
              }}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default MySheets;

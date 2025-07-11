
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadDialog from "@/components/UploadDialog";
import SheetReactions from "@/components/SheetReactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload, Eye, Download, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";

interface ExamPaper {
  id: string;
  subject: string;
  exam_type: string;
  slot: string;
  paper_image_url: string;
  created_at: string;
  user_id: string;
}

interface UploadData {
  file: File;
  subject: string;
  exam: string;
  slot: string;
}

const ExamCorner = () => {
  const [filteredPapers, setFilteredPapers] = useState<ExamPaper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Only search when user types something
    if (searchQuery.trim() === "") {
      setFilteredPapers([]);
      return;
    }

    searchPapers();
  }, [searchQuery]);

  const searchPapers = async () => {
    if (searchQuery.trim() === "") {
      setFilteredPapers([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('exam_papers')
        .select('*')
        .or(`subject.ilike.%${searchQuery}%,exam_type.ilike.%${searchQuery}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFilteredPapers(data || []);
    } catch (error) {
      console.error('Error searching exam papers:', error);
      toast({
        title: "Error",
        description: "Failed to search exam papers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    if (!user) {
      setAuthMode("register");
      setShowAuthModal(true);
      return;
    }
  };

  const handleUploadSuccess = async (uploadData: UploadData) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to upload papers",
          variant: "destructive"
        });
        return;
      }

      // Upload file to storage
      const fileExt = uploadData.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('exam-papers')
        .upload(filePath, uploadData.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('exam-papers')
        .getPublicUrl(filePath);

      // Save paper details to database
      const { error } = await supabase
        .from('exam_papers')
        .insert({
          subject: uploadData.subject,
          exam_type: uploadData.exam,
          slot: uploadData.slot,
          paper_image_url: publicUrl,
          user_id: currentUser.id
        });

      if (error) throw error;

      toast({
        title: "Upload Successful",
        description: "Your question paper has been uploaded successfully"
      });

      // Don't update the UI automatically - papers will only show when searched
    } catch (error) {
      console.error('Error uploading paper:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload the question paper",
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
    return `${Math.ceil(diffDays / 7)} week${Math.ceil(diffDays / 7) > 1 ? 's' : ''} ago`;
  };

  const handleViewPaper = (paperUrl: string) => {
    window.open(paperUrl, '_blank');
  };

  const handleDownloadPaper = async (paperUrl: string, subject: string, examType: string) => {
    try {
      const response = await fetch(paperUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${subject}_${examType}_question_paper.${paperUrl.split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading paper:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the question paper",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Exam Corner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Access previous years' question papers organized by exam type and slot. 
            Help your fellow students by uploading papers after each exam.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Question Papers
                {user ? (
                  <UploadDialog 
                    trigger={
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Paper
                      </Button>
                    }
                    onUploadSuccess={handleUploadSuccess}
                  />
                ) : (
                  <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleUploadClick}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Paper
                  </Button>
                )}
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by subject or exam type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchQuery === "" && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">Search for Papers</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Type a subject name or exam type to find question papers.
                    </p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Searching...</p>
                  </div>
                )}

                {searchQuery !== "" && !loading && filteredPapers.length === 0 && (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Papers Found</h3>
                    <p className="text-sm text-muted-foreground">
                      No question papers found for "{searchQuery}". Try searching with a different subject name or exam type.
                    </p>
                  </div>
                )}

                {filteredPapers.map((paper) => (
                  <div key={paper.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{paper.subject}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{paper.exam_type}</Badge>
                        <Badge variant="outline">{paper.slot}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(paper.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <SheetReactions sheetId={paper.id} itemType="exam_paper" />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewPaper(paper.paper_image_url)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDownloadPaper(paper.paper_image_url, paper.subject, paper.exam_type)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

export default ExamCorner;

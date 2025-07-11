
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SheetQuestionManager from "@/components/SheetQuestionManager";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SheetView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Get sheet data from state or fetch it if not available
  const [sheetData, setSheetData] = useState(location.state || null);

  useEffect(() => {
    // If we don't have sheet data from navigation state, try to fetch it
    if (!sheetData && id) {
      fetchSheetData();
    }
  }, [id, sheetData]);

  const fetchSheetData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      console.log('Fetching sheet data for ID:', id);
      const { data, error } = await supabase
        .from('problem_sheets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching sheet:', error);
        throw error;
      }

      if (data) {
        console.log('Sheet data fetched:', data);
        setSheetData({
          sheetTitle: data.title,
          sheetCode: data.access_code,
          isOwner: user?.id === data.user_id
        });
      }
    } catch (error) {
      console.error('Error fetching sheet data:', error);
      toast({
        title: "Error",
        description: "Failed to load sheet data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSheets = () => {
    navigate("/my-sheets");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading sheet...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!sheetData?.sheetTitle || !sheetData?.sheetCode) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Sheet Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              The requested sheet could not be found or you don't have access to it.
            </p>
            <Button 
              onClick={handleBackToSheets}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to My Sheets
            </Button>
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
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={handleBackToSheets}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Sheets
          </Button>
        </div>
        <SheetQuestionManager 
          sheetTitle={sheetData.sheetTitle} 
          sheetCode={sheetData.sheetCode} 
          isOwner={sheetData.isOwner}
        />
      </main>
      <Footer />
    </div>
  );
};

export default SheetView;

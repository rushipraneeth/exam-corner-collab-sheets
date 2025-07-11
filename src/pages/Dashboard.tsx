
import { useState } from "react";
import { Plus, FileText, Users, Share2, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const [sheets] = useState([
    { id: 1, title: "Data Structures Notes", type: "university", subject: "CSE", slot: "L23+L24", uploadDate: "2024-01-15", downloads: 45 },
    { id: 2, title: "Machine Learning Summary", type: "university", subject: "CSE", slot: "L31+L32", uploadDate: "2024-01-10", downloads: 32 },
    { id: 3, title: "My Personal Notes", type: "personal", subject: "Database", slot: "Custom", uploadDate: "2024-01-08", downloads: 12 },
    { id: 4, title: "Shared Chemistry Notes", type: "shared", subject: "Chemistry", slot: "L15+L16", uploadDate: "2024-01-05", downloads: 28, sharedBy: "Priya S." }
  ]);

  const universitySheets = sheets.filter(sheet => sheet.type === 'university');
  const personalSheets = sheets.filter(sheet => sheet.type === 'personal');
  const sharedSheets = sheets.filter(sheet => sheet.type === 'shared');

  const SheetCard = ({ sheet }: { sheet: any }) => (
    <Card className="hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
            {sheet.title}
          </CardTitle>
          <Badge variant={sheet.type === 'university' ? 'default' : sheet.type === 'personal' ? 'secondary' : 'outline'}>
            {sheet.type}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{sheet.subject}</span>
          <span>•</span>
          <span>{sheet.slot}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {sheet.sharedBy && <span>Shared by {sheet.sharedBy} • </span>}
            <span>{sheet.downloads} downloads</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your study sheets and track your uploads</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8 animate-fade-in animation-delay-200">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{universitySheets.length}/3</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">University Sheets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">{personalSheets.length}/1</p>
                  <p className="text-sm text-green-600 dark:text-green-300">Personal Sheets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Share2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{sharedSheets.length}/1</p>
                  <p className="text-sm text-purple-600 dark:text-purple-300">Shared Sheets</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">117</p>
                  <p className="text-sm text-orange-600 dark:text-orange-300">Total Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="animate-fade-in animation-delay-400">
          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All Sheets</TabsTrigger>
                <TabsTrigger value="university">University</TabsTrigger>
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
              </TabsList>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Upload Sheet
              </Button>
            </div>

            <TabsContent value="all" className="space-y-4">
              {sheets.map((sheet) => (
                <SheetCard key={sheet.id} sheet={sheet} />
              ))}
            </TabsContent>

            <TabsContent value="university" className="space-y-4">
              {universitySheets.map((sheet) => (
                <SheetCard key={sheet.id} sheet={sheet} />
              ))}
            </TabsContent>

            <TabsContent value="personal" className="space-y-4">
              {personalSheets.map((sheet) => (
                <SheetCard key={sheet.id} sheet={sheet} />
              ))}
            </TabsContent>

            <TabsContent value="shared" className="space-y-4">
              {sharedSheets.map((sheet) => (
                <SheetCard key={sheet.id} sheet={sheet} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

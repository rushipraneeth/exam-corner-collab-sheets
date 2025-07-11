
import { Upload, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ExamCornerPreview = () => {
  const examCategories = [
    { name: "CAT 1", papers: 45, color: "bg-blue-500" },
    { name: "CAT 2", papers: 38, color: "bg-green-500" },
    { name: "FAT", papers: 62, color: "bg-purple-500" }
  ];

  const recentUploads = [
    { subject: "Data Structures", exam: "CAT 1", slot: "L23+L24", uploader: "Priya S.", time: "2 hours ago" },
    { subject: "Machine Learning", exam: "FAT", slot: "L31+L32", uploader: "Rahul K.", time: "5 hours ago" },
    { subject: "Database Systems", exam: "CAT 2", slot: "L41+L42", uploader: "Ananya M.", time: "1 day ago" }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Exam Paper Corner
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access previous years' question papers organized by exam type and slot. 
            Help your fellow students by uploading papers after each exam.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Uploads
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Paper
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUploads.map((upload, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{upload.subject}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{upload.exam}</Badge>
                          <Badge variant="outline">{upload.slot}</Badge>
                          <span className="text-sm text-muted-foreground">
                            by {upload.uploader} • {upload.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Exam Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examCategories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                        <span className="font-medium text-foreground">{category.name}</span>
                      </div>
                      <span className="text-muted-foreground">{category.papers} papers</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-border">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-foreground mb-2">Upload Guidelines</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help maintain quality by uploading clear, readable question papers with correct exam details.
                </p>
                <Button variant="outline" size="sm">
                  View Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamCornerPreview;

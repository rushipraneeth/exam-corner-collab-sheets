
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadData {
  name: string;
  subject: string;
  exam: string;
  slot: string;
  file: File;
}

interface UploadDialogProps {
  trigger: React.ReactNode;
  onUploadSuccess?: (uploadData: UploadData) => void;
}

const UploadDialog = ({ trigger, onUploadSuccess }: UploadDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    exam: "",
    slot: ""
  });
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.subject || !formData.exam || !formData.slot || !file) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive"
      });
      return;
    }

    // Create upload data object
    const uploadData: UploadData = {
      ...formData,
      file
    };

    // Call the onUploadSuccess callback
    if (onUploadSuccess) {
      onUploadSuccess(uploadData);
    }

    // Reset form and close dialog
    setFormData({
      name: "",
      subject: "",
      exam: "",
      slot: ""
    });
    setFile(null);
    setOpen(false);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Question Paper</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="e.g., Data Structures and Algorithms"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exam">Exam Type *</Label>
              <Select value={formData.exam} onValueChange={(value) => handleInputChange("exam", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAT 1">CAT 1</SelectItem>
                  <SelectItem value="CAT 2">CAT 2</SelectItem>
                  <SelectItem value="FAT">FAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slot">Slot *</Label>
              <Input
                id="slot"
                value={formData.slot}
                onChange={(e) => handleInputChange("slot", e.target.value)}
                placeholder="e.g., L23+L24"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Question Paper File *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {!file ? (
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </div>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                  />
                  <Label
                    htmlFor="file"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Choose File
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG up to 10MB</p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Upload Paper
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;


import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateSheetDialogProps {
  onCreateSheet: (sheet: {
    title: string;
    description?: string;
    code: string;
  }) => void;
  disabled?: boolean;
}

const CreateSheetDialog = ({ onCreateSheet, disabled = false }: CreateSheetDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { toast } = useToast();

  const generateCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleGenerateCode = () => {
    const newCode = generateCode();
    setGeneratedCode(newCode);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code Copied",
      description: "Sheet code has been copied to clipboard",
    });
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    const finalCode = generatedCode || generateCode();
    
    const newSheet = {
      title: title.trim(),
      description: description.trim() || undefined,
      code: finalCode,
    };

    onCreateSheet(newSheet);
    setTitle("");
    setDescription("");
    setGeneratedCode("");
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      setTitle("");
      setDescription("");
      setGeneratedCode("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Sheet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Create New Study Sheet</DialogTitle>
          <DialogDescription>
            Create a new study sheet to organize your learning materials. Others can access it using the unique code.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Sheet Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter sheet title..."
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 rounded-lg"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your sheet..."
              className="bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-slate-400 rounded-lg"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Unique Access Code</Label>
            {!generatedCode ? (
              <div className="flex gap-2">
                <div className="flex-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 text-gray-500 dark:text-slate-400">
                  Generate unique code...
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateCode}
                  className="flex-shrink-0 rounded-lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <div className="flex-1 text-lg font-bold text-primary border border-border rounded-lg px-3 py-2 bg-muted font-mono">
                    {generatedCode}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="flex-shrink-0 rounded-lg"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateCode}
                    className="flex-shrink-0 rounded-lg"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Share this code with others to give them access to your sheet.
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-lg">
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim()} className="rounded-lg">
            Create Sheet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSheetDialog;

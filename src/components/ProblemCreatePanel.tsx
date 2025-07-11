import React, { useState, useEffect } from 'react';
import { Plus, FileText, Link, Youtube, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProblemCreatePanel = ({ currentSheetId, onProblemCreated, createProblem, getSheetCount }) => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: '',
    url: '',
    youtube_link: '',
    leetcode_link: '',
    tags: '',
    sheet_id: currentSheetId || 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sheetCount, setSheetCount] = useState(0);

  // Fetch sheet count
  useEffect(() => {
    async function fetchSheetCount() {
      try {
        const data = await getSheetCount();
        setSheetCount(data.sheet_cnt);
      } catch (err) {
        console.error('Failed to fetch sheet count', err);
      }
    }

    fetchSheetCount();
  }, [getSheetCount]);

  // Update sheet_id when currentSheetId changes
  useEffect(() => {
    if (currentSheetId) {
      setFormData(prev => ({
        ...prev,
        sheet_id: currentSheetId
      }));
    }
  }, [currentSheetId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.difficulty) {
      setError('Title and difficulty are required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Make sure sheet_id is a number
      const newProblem = {
        ...formData,
        sheet_id: Number(formData.sheet_id),
        status: 'not_attempted',
        visit_count: 0,
        time_taken: 0,
        created: true
      };

      console.log("Creating problem with data:", newProblem);
      await createProblem(newProblem);

      // Reset form but keep the selected sheet_id
      setFormData({
        title: '',
        difficulty: '',
        url: '',
        youtube_link: '',
        leetcode_link: '',
        tags: '',
        sheet_id: currentSheetId,
      });

      // Notify parent component to refresh problem list
      if (onProblemCreated) {
        onProblemCreated();
      }
    } catch (err) {
      setError('Failed to create problem');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Problem Manager</h1>
        <p className="text-muted-foreground">Create and manage your coding problems</p>
      </div>

      {/* Create Problem Card */}
      <Card className="hover:shadow-xl transition-all duration-500 animate-fade-in">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Problem
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Row */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter problem title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Difficulty *
                </Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Sheet ID *
                </Label>
                <Select value={formData.sheet_id.toString()} onValueChange={(value) => handleSelectChange('sheet_id', Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sheet" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: sheetCount || 1 }, (_, i) => i + 1).map(id => (
                      <SelectItem key={id} value={id.toString()}>
                        Sheet {id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Links Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="url" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Link className="h-4 w-4" />
                  Problem URL
                </Label>
                <Input
                  id="url"
                  name="url"
                  type="text"
                  value={formData.url}
                  onChange={handleChange}
                  placeholder="https://example.com/problem"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_link" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Youtube className="h-4 w-4" />
                  YouTube Link
                </Label>
                <Input
                  id="youtube_link"
                  name="youtube_link"
                  type="text"
                  value={formData.youtube_link}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Additional Links and Tags Row */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leetcode_link" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Code className="h-4 w-4" />
                  LeetCode Link
                </Label>
                <Input
                  id="leetcode_link"
                  name="leetcode_link"
                  type="text"
                  value={formData.leetcode_link}
                  onChange={handleChange}
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-muted-foreground">
                  Tags (comma separated)
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="array, string, sorting"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-start">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating Problem...' : 'Create Problem'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProblemCreatePanel;

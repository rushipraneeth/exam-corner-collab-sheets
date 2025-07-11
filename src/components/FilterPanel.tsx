
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterPanelProps {
  problems: any[];
  onFilterChange: (filters: any) => void;
  currentSheetId: number;
  onSheetChange: (sheetId: number) => void;
  onAddSheet: () => void;
  getSheetCount: () => Promise<{ sheet_cnt: number }>;
  incrementSheetCount: () => Promise<void>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ problems, onFilterChange, currentSheetId, onSheetChange, onAddSheet, getSheetCount, incrementSheetCount }) => {
  const [difficulty, setDifficulty] = useState('all');
  const [status, setStatus] = useState('all');
  const [tags, setTags] = useState('all');
  const [searchTitle, setSearchTitle] = useState('');
  const [sheetCount, setSheetCount] = useState(0);
  const [isAddingSheet, setIsAddingSheet] = useState(false);

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

  // Process tags from problems data
  const tagsWithCount = React.useMemo(() => {
    if (!problems) return [];

    const tagsCount: Record<string, number> = {};

    problems.forEach(problem => {
      if (problem.tags) {
        problem.tags.split(',').forEach((tag: string) => {
          const trimmedTag = tag.trim();
          if (trimmedTag) {
            tagsCount[trimmedTag] = (tagsCount[trimmedTag] || 0) + 1;
          }
        });
      }
    });

    return Object.entries(tagsCount)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag));
  }, [problems]);

  // When filters change, notify parent component
  useEffect(() => {
    onFilterChange({
      difficulty,
      status,
      tags,
      searchTitle
    });
  }, [difficulty, status, tags, searchTitle, onFilterChange]);

  const handleAddSheet = async () => {
    try {
      setIsAddingSheet(true);
      await incrementSheetCount();

      // Fetch updated sheet count
      const data = await getSheetCount();
      setSheetCount(data.sheet_cnt);

      // Set current sheet to the newly added one
      if (onSheetChange && data.sheet_cnt > 0) {
        onSheetChange(data.sheet_cnt);
      }

      // Notify parent component
      if (onAddSheet) {
        onAddSheet();
      }
    } catch (err) {
      console.error('Failed to add new sheet', err);
    } finally {
      setIsAddingSheet(false);
    }
  };

  return (
    <Card className="hover:shadow-xl transition-all duration-500 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-foreground flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filter Problems
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Sheet Selection Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search" className="text-sm font-medium text-muted-foreground">
              Search by Title
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                className="pl-10"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                placeholder="Enter problem title to search..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Problem Sheet
            </Label>
            <div className="flex gap-2">
              <Select value={currentSheetId?.toString()} onValueChange={(value) => onSheetChange(Number(value))}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select sheet" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: sheetCount || 1 }, (_, i) => i + 1).map(sheetId => (
                    <SelectItem key={sheetId} value={sheetId.toString()}>
                      Sheet {sheetId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleAddSheet}
                disabled={isAddingSheet}
                className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                {isAddingSheet ? 'Adding...' : 'Add'}
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Options Row */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Difficulty
            </Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Status
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="attempted">Solved</SelectItem>
                <SelectItem value="not_attempted">Unsolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Tags
            </Label>
            <Select value={tags} onValueChange={setTags}>
              <SelectTrigger>
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {tagsWithCount.map(({ tag, count }) => (
                  <SelectItem key={tag} value={tag}>
                    {tag} ({count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;

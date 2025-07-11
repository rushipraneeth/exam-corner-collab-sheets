
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Youtube, ExternalLink, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Problem {
  problem_id: number;
  sheet_id: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'attempted' | 'not_attempted';
  url?: string;
  youtube_link?: string;
  leetcode_link?: string;
  tags?: string;
  visit_count: number;
}

interface ProblemListProps {
  sheetId: number;
  filters: {
    difficulty?: string;
    status?: string;
    tags?: string;
    searchTitle?: string;
  };
  getProblemsBySheet: (sheetId: number) => Promise<Problem[]>;
  updateProblemStatus: (sheetId: number, problemId: number) => Promise<void>;
  incrementVisits: (sheetId: number, problemId: number) => Promise<void>;
}

const ProblemList: React.FC<ProblemListProps> = ({ 
  sheetId, 
  filters, 
  getProblemsBySheet, 
  updateProblemStatus, 
  incrementVisits 
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch problems when sheet ID changes
  useEffect(() => {
    async function fetchProblems() {
      setLoading(true);
      try {
        const data = await getProblemsBySheet(sheetId);
        setProblems(data);
        setError(null);
      } catch (err) {
        setError('Failed to load problems');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (sheetId) {
      fetchProblems();
    }
  }, [sheetId, getProblemsBySheet]);

  // Handle status change
  const handleStatusChange = async (problem: Problem) => {
    try {
      await updateProblemStatus(problem.sheet_id, problem.problem_id);

      // Update the problem status in the local state
      setProblems(problems.map(p => {
        if (p.problem_id === problem.problem_id && p.sheet_id === problem.sheet_id) {
          return {
            ...p,
            status: p.status === 'attempted' ? 'not_attempted' : 'attempted'
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Handle problem click
  const handleProblemClick = async (problem: Problem) => {
    try {
      await incrementVisits(problem.sheet_id, problem.problem_id);

      // Update visit count in the local state
      setProblems(problems.map(p => {
        if (p.problem_id === problem.problem_id && p.sheet_id === problem.sheet_id) {
          return {
            ...p,
            visit_count: p.visit_count + 1
          };
        }
        return p;
      }));

      navigate(`/problem/${problem.sheet_id}/${problem.problem_id}`);
    } catch (err) {
      console.error('Failed to update visit count', err);
    }
  };

  // Apply filters
  const filteredProblems = problems.filter(problem => {
    let match = true;

    if (filters.difficulty && filters.difficulty !== 'all') {
      match = match && problem.difficulty === filters.difficulty;
    }

    if (filters.status && filters.status !== 'all') {
      match = match && problem.status === filters.status;
    }

    if (filters.tags && filters.tags !== 'all') {
      match = match && problem.tags && problem.tags.includes(filters.tags);
    }

    if (filters.searchTitle && filters.searchTitle.trim() !== '') {
      match = match && problem.title.toLowerCase().includes(filters.searchTitle.toLowerCase());
    }

    return match;
  });

  // Calculate statistics
  const totalProblems = filteredProblems.length;
  const solvedProblems = filteredProblems.filter(p => p.status === 'attempted').length;
  const easyProblems = filteredProblems.filter(p => p.difficulty === 'easy').length;
  const mediumProblems = filteredProblems.filter(p => p.difficulty === 'medium').length;
  const hardProblems = filteredProblems.filter(p => p.difficulty === 'hard').length;
  const completionRate = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Easy</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Medium</Badge>;
      case 'hard':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-200">Hard</Badge>;
      default:
        return <Badge variant="outline">{difficulty}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">Loading problems...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="animate-fade-in border-red-200">
        <CardContent className="p-6">
          <div className="text-center text-red-600">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!problems.length) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">No problems found for this sheet.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-xl transition-all duration-500 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Problems ({filteredProblems.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border">
            <div className="text-2xl font-bold text-blue-800">{totalProblems}</div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border">
            <div className="text-2xl font-bold text-green-800">{solvedProblems}</div>
            <div className="text-sm text-green-600">Solved</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg border">
            <div className="text-2xl font-bold text-emerald-800">{easyProblems}</div>
            <div className="text-sm text-emerald-600">Easy</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-800">{mediumProblems}</div>
            <div className="text-sm text-yellow-600">Medium</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border">
            <div className="text-2xl font-bold text-red-800">{hardProblems}</div>
            <div className="text-sm text-red-600">Hard</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completionRate}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Problems Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-24">Solution</TableHead>
                <TableHead className="w-24">Difficulty</TableHead>
                <TableHead className="w-20">Visits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProblems.map((problem) => (
                <TableRow key={`${problem.sheet_id}-${problem.problem_id}`} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-2 h-8 w-8 ${problem.status === 'attempted' ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                      onClick={() => handleStatusChange(problem)}
                    >
                      <Check className={`h-4 w-4 ${problem.status === 'attempted' ? 'opacity-100' : 'opacity-30'}`} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="h-auto p-0 font-medium text-left justify-start hover:text-primary"
                      onClick={() => handleProblemClick(problem)}
                    >
                      {problem.title}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {problem.youtube_link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => window.open(problem.youtube_link, '_blank')}
                      >
                        <Youtube className="h-4 w-4" />
                      </Button>
                    )}
                    {problem.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 ml-1"
                        onClick={() => window.open(problem.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {getDifficultyBadge(problem.difficulty)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{problem.visit_count}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProblemList;

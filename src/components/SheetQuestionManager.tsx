import React, { useState } from 'react';
import { Plus, Check, Youtube, ExternalLink, Trash2, Edit, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionLink?: string;
  youtubeUrl?: string;
  completed: boolean;
}

interface SheetQuestionManagerProps {
  sheetTitle: string;
  sheetCode: string;
  isOwner?: boolean;
}

const questionFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard'], {
    required_error: "You need to select a difficulty.",
  }),
  questionLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  youtubeUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

const SheetQuestionManager = ({ sheetTitle, sheetCode, isOwner = true }: SheetQuestionManagerProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const form = useForm<z.infer<typeof questionFormSchema>>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      questionLink: "",
      youtubeUrl: "",
    },
  });

  function onSubmit(data: z.infer<typeof questionFormSchema>) {
    if (!isOwner) return;

    const newQuestion: Question = {
      id: Date.now(),
      title: data.title,
      description: data.description || '',
      difficulty: data.difficulty,
      questionLink: data.questionLink || undefined,
      youtubeUrl: data.youtubeUrl || undefined,
      completed: false
    };

    setQuestions([...questions, newQuestion]);
    form.reset();
    setShowAddForm(false);
  }

  const handleToggleComplete = (questionId: number) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, completed: !q.completed } : q
    ));
  };

  const handleDeleteQuestion = (questionId: number) => {
    if (!isOwner) return;
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  // Calculate statistics
  const totalQuestions = questions.length;
  const completedQuestions = questions.filter(q => q.completed).length;
  const easyQuestions = questions.filter(q => q.difficulty === 'easy');
  const mediumQuestions = questions.filter(q => q.difficulty === 'medium');
  const hardQuestions = questions.filter(q => q.difficulty === 'hard');
  
  const completedEasy = easyQuestions.filter(q => q.completed).length;
  const completedMedium = mediumQuestions.filter(q => q.completed).length;
  const completedHard = hardQuestions.filter(q => q.completed).length;
  
  const completionPercentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  const easyPercentage = easyQuestions.length > 0 ? Math.round((completedEasy / easyQuestions.length) * 100) : 0;
  const mediumPercentage = mediumQuestions.length > 0 ? Math.round((completedMedium / mediumQuestions.length) * 100) : 0;
  const hardPercentage = hardQuestions.length > 0 ? Math.round((completedHard / hardQuestions.length) * 100) : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 font-semibold';
      case 'medium': return 'text-yellow-600 font-semibold';
      case 'hard': return 'text-red-600 font-semibold';
      default: return 'text-gray-600 font-semibold';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-3xl font-bold text-foreground">{sheetTitle}</h1>
          {!isOwner && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <Lock className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">Code: {sheetCode}</p>
        {!isOwner && (
          <p className="text-sm text-orange-600 mt-2">You have view access to this sheet. You can mark questions as completed but cannot edit the sheet.</p>
        )}
      </div>

      {/* Progress Statistics */}
      <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-6 text-gray-800 dark:text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Progress */}
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-medium text-gray-600 dark:text-slate-300">Total Progress</h3>
              <div className="text-2xl font-bold">{completedQuestions} / {totalQuestions}</div>
            </div>
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#9ca3af"
                  strokeWidth="2"
                />
                <path
                  d="M18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray={`${completionPercentage}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{completionPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Easy Progress */}
          <div className="border-l border-gray-300 dark:border-slate-700 pl-6">
            <h3 className="text-lg font-medium text-gray-600 dark:text-slate-300">Easy</h3>
            <div className="text-xl font-bold mb-2">{completedEasy} / {easyQuestions.length} completed</div>
            <div className="w-full bg-gray-300 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${easyPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Medium Progress */}
          <div className="border-l border-gray-300 dark:border-slate-700 pl-6">
            <h3 className="text-lg font-medium text-gray-600 dark:text-slate-300">Medium</h3>
            <div className="text-xl font-bold mb-2">{completedMedium} / {mediumQuestions.length} completed</div>
            <div className="w-full bg-gray-300 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${mediumPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Hard Progress */}
          <div className="border-l border-gray-300 dark:border-slate-700 pl-6">
            <h3 className="text-lg font-medium text-gray-600 dark:text-slate-300">Hard</h3>
            <div className="text-xl font-bold mb-2">{completedHard} / {hardQuestions.length} completed</div>
            <div className="w-full bg-gray-300 dark:bg-slate-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${hardPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Question Button - Only for owners */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Questions</h2>
        {isOwner && (
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        )}
      </div>

      {/* Add Question Form - Only for owners */}
      {showAddForm && isOwner && (
        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter question title" {...field} className="rounded-lg" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the question or any additional details"
                        className="rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="questionLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question Link</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://leetcode.com/problems/..."
                          className="rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          className="rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  Add Question
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      )}

      {/* Questions Table */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {isOwner ? 'No questions added yet. Click "Add Question" to get started.' : 'This sheet has no questions yet.'}
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden bg-gray-50 dark:bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-200 dark:bg-slate-900 hover:bg-gray-200 dark:hover:bg-slate-900">
                  <TableHead className="text-gray-800 dark:text-white font-semibold">Status</TableHead>
                  <TableHead className="text-gray-800 dark:text-white font-semibold">Problem</TableHead>
                  <TableHead className="text-gray-800 dark:text-white font-semibold text-center">Resource (Free)</TableHead>
                  <TableHead className="text-gray-800 dark:text-white font-semibold text-center">Practice</TableHead>
                  <TableHead className="text-gray-800 dark:text-white font-semibold">Difficulty</TableHead>
                  {isOwner && (
                    <TableHead className="text-gray-800 dark:text-white font-semibold text-center">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id} className="hover:bg-gray-100 dark:hover:bg-muted/50">
                    <TableCell className="w-16">
                      <div className="flex justify-center">
                        <div 
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-colors ${
                            question.completed 
                              ? 'bg-orange-500 border-orange-500' 
                              : 'border-gray-300 hover:border-orange-300'
                          }`}
                          onClick={() => handleToggleComplete(question.id)}
                        >
                          {question.completed && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className={question.completed ? 'line-through text-muted-foreground' : ''}>
                        {question.title}
                      </div>
                      {question.description && (
                        <div className="text-xs text-muted-foreground mt-1">{question.description}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {question.youtubeUrl ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(question.youtubeUrl, '_blank')}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Youtube className="h-5 w-5 text-red-600" />
                        </Button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {question.questionLink ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(question.questionLink, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </Button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </span>
                    </TableCell>
                    {isOwner && (
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SheetQuestionManager;

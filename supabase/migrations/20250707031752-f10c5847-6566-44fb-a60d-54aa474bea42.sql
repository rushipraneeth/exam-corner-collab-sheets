
-- Create table for problem sheets
CREATE TABLE public.problem_sheets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  access_code TEXT UNIQUE NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for exam papers
CREATE TABLE public.exam_papers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  subject TEXT NOT NULL,
  exam_type TEXT NOT NULL, -- CAT 1, CAT 2, FAT
  slot TEXT NOT NULL,
  paper_image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.problem_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_papers ENABLE ROW LEVEL SECURITY;

-- RLS policies for problem_sheets
CREATE POLICY "Users can view public sheets and their own sheets" 
  ON public.problem_sheets 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create their own sheets" 
  ON public.problem_sheets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sheets" 
  ON public.problem_sheets 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sheets" 
  ON public.problem_sheets 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS policies for exam_papers
CREATE POLICY "Anyone can view exam papers" 
  ON public.exam_papers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can upload their own papers" 
  ON public.exam_papers 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for exam papers
INSERT INTO storage.buckets (id, name, public) 
VALUES ('exam-papers', 'exam-papers', true);

-- Storage policy for exam papers
CREATE POLICY "Anyone can view exam papers" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'exam-papers');

CREATE POLICY "Authenticated users can upload exam papers" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'exam-papers' AND auth.role() = 'authenticated');

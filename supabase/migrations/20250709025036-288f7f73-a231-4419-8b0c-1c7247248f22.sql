
-- Create table for sheet likes/dislikes
CREATE TABLE public.sheet_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sheet_id UUID REFERENCES public.problem_sheets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sheet_id, user_id)
);

-- Enable RLS
ALTER TABLE public.sheet_reactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for sheet_reactions
CREATE POLICY "Anyone can view sheet reactions" 
  ON public.sheet_reactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create their own reactions" 
  ON public.sheet_reactions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" 
  ON public.sheet_reactions 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" 
  ON public.sheet_reactions 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to count user's sheets
CREATE OR REPLACE FUNCTION count_user_sheets(user_uuid UUID)
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.problem_sheets
  WHERE user_id = user_uuid;
$$;

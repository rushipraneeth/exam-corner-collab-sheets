
-- Update the RLS policy to make sheets private by default
-- Users can only view their own sheets, not public ones
DROP POLICY IF EXISTS "Users can view public sheets and their own sheets" ON public.problem_sheets;

CREATE POLICY "Users can only view their own sheets" 
ON public.problem_sheets 
FOR SELECT 
USING (auth.uid() = user_id);

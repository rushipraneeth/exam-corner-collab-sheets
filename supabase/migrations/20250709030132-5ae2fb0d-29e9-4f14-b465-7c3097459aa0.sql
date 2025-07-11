
-- First, remove the existing foreign key constraint
ALTER TABLE public.sheet_reactions DROP CONSTRAINT IF EXISTS sheet_reactions_sheet_id_fkey;

-- Add a new column to indicate the type of item being reacted to
ALTER TABLE public.sheet_reactions ADD COLUMN IF NOT EXISTS item_type TEXT NOT NULL DEFAULT 'sheet';

-- Update existing records to mark them as sheet reactions
UPDATE public.sheet_reactions SET item_type = 'sheet' WHERE item_type = 'sheet';

-- Now we need to handle the constraint differently since we have two different tables
-- We'll use a trigger to ensure referential integrity instead of a foreign key

-- Create a function to validate the sheet_id based on item_type
CREATE OR REPLACE FUNCTION validate_sheet_reaction()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.item_type = 'sheet' THEN
    IF NOT EXISTS (SELECT 1 FROM public.problem_sheets WHERE id = NEW.sheet_id) THEN
      RAISE EXCEPTION 'Referenced sheet does not exist';
    END IF;
  ELSIF NEW.item_type = 'exam_paper' THEN
    IF NOT EXISTS (SELECT 1 FROM public.exam_papers WHERE id = NEW.sheet_id) THEN
      RAISE EXCEPTION 'Referenced exam paper does not exist';
    END IF;
  ELSE
    RAISE EXCEPTION 'Invalid item_type. Must be either "sheet" or "exam_paper"';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS validate_sheet_reaction_trigger ON public.sheet_reactions;
CREATE TRIGGER validate_sheet_reaction_trigger
  BEFORE INSERT OR UPDATE ON public.sheet_reactions
  FOR EACH ROW EXECUTE FUNCTION validate_sheet_reaction();

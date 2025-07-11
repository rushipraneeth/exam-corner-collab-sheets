
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface SheetReactionsProps {
  sheetId: string;
  itemType?: 'sheet' | 'exam_paper';
}

const SheetReactions = ({ sheetId, itemType = 'sheet' }: SheetReactionsProps) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchReactions();
    if (user) {
      fetchUserReaction();
    }
  }, [sheetId, user, itemType]);

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('sheet_reactions')
        .select('reaction_type')
        .eq('sheet_id', sheetId)
        .eq('item_type', itemType);

      if (error) throw error;

      const likeCount = data?.filter(r => r.reaction_type === 'like').length || 0;
      const dislikeCount = data?.filter(r => r.reaction_type === 'dislike').length || 0;
      
      setLikes(likeCount);
      setDislikes(dislikeCount);
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const fetchUserReaction = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('sheet_reactions')
        .select('reaction_type')
        .eq('sheet_id', sheetId)
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Properly type cast the reaction_type
      const reactionType = data?.reaction_type;
      if (reactionType === 'like' || reactionType === 'dislike') {
        setUserReaction(reactionType);
      } else {
        setUserReaction(null);
      }
    } catch (error) {
      console.error('Error fetching user reaction:', error);
    }
  };

  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: `Please sign in to react to ${itemType === 'exam_paper' ? 'papers' : 'sheets'}`,
        variant: "destructive"
      });
      return;
    }

    try {
      if (userReaction === reactionType) {
        // Remove reaction
        const { error } = await supabase
          .from('sheet_reactions')
          .delete()
          .eq('sheet_id', sheetId)
          .eq('user_id', user.id)
          .eq('item_type', itemType);

        if (error) throw error;
        setUserReaction(null);
      } else {
        // Add or update reaction
        const { error } = await supabase
          .from('sheet_reactions')
          .upsert({
            sheet_id: sheetId,
            user_id: user.id,
            reaction_type: reactionType,
            item_type: itemType
          });

        if (error) throw error;
        setUserReaction(reactionType);
      }

      // Refresh counts
      fetchReactions();
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={userReaction === 'like' ? 'default' : 'outline'}
        onClick={() => handleReaction('like')}
        className="flex items-center gap-1"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>{likes}</span>
      </Button>
      <Button
        size="sm"
        variant={userReaction === 'dislike' ? 'default' : 'outline'}
        onClick={() => handleReaction('dislike')}
        className="flex items-center gap-1"
      >
        <ThumbsDown className="h-4 w-4" />
        <span>{dislikes}</span>
      </Button>
    </div>
  );
};

export default SheetReactions;

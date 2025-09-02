import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface Rating {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface RatingProps {
  serviceId: string;
  serviceName: string;
}

const Rating = ({ serviceId, serviceName }: RatingProps) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
    loadRatings();
  }, []);

  const loadRatings = async () => {
    try {
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('service_id', serviceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRatings(data || []);

      // Check if user already rated this service
      if (user) {
        const userRatingData = data?.find(r => r.user_id === user.id);
        if (userRatingData) {
          setUserRating(userRatingData);
          setNewRating(userRatingData.rating);
          setNewComment(userRatingData.comment || '');
        }
      }
    } catch (error) {
      console.error('Error loading ratings:', error);
    }
  };

  const submitRating = async () => {
    if (!user || newRating === 0) return;

    setLoading(true);
    try {
      if (userRating) {
        // Update existing rating
        const { error } = await supabase
          .from('ratings')
          .update({
            rating: newRating,
            comment: newComment.trim() || null
          })
          .eq('id', userRating.id);

        if (error) throw error;
        toast.success('Avaliação atualizada com sucesso!');
      } else {
        // Create new rating
        const { error } = await supabase
          .from('ratings')
          .insert({
            service_id: serviceId,
            user_id: user.id,
            rating: newRating,
            comment: newComment.trim() || null
          });

        if (error) throw error;
        toast.success('Avaliação enviada com sucesso!');
      }

      setIsOpen(false);
      loadRatings();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Erro ao enviar avaliação');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = ratings.length > 0 
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
    : 0;

  const renderStars = (rating: number, interactive = false, size = 'h-4 w-4') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} cursor-pointer transition-colors ${
              star <= (interactive ? (hoveredStar || newRating) : rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
            onClick={interactive ? () => setNewRating(star) : undefined}
            onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
            onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Avaliações</span>
          <div className="flex items-center gap-2">
            {renderStars(averageRating)}
            <span className="text-sm text-muted-foreground">
              ({ratings.length} {ratings.length === 1 ? 'avaliação' : 'avaliações'})
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {ratings.length > 0 ? (
          <div className="space-y-4 max-h-64 overflow-y-auto">
            {ratings.map((rating) => (
              <div key={rating.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {renderStars(rating.rating)}
                    <span className="text-sm font-medium">
                      Usuário
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rating.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {rating.comment && (
                  <p className="text-sm text-muted-foreground mt-2">{rating.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar!
          </p>
        )}

        {user && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Star className="h-4 w-4 mr-2" />
                {userRating ? 'Editar minha avaliação' : 'Avaliar este serviço'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Avaliar {serviceName}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sua avaliação:
                  </label>
                  {renderStars(newRating, true, 'h-6 w-6')}
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Comentário (opcional):
                  </label>
                  <Textarea
                    placeholder="Conte sobre sua experiência..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={submitRating}
                    disabled={loading || newRating === 0}
                  >
                    {loading ? 'Enviando...' : userRating ? 'Atualizar' : 'Enviar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {!user && (
          <Button variant="outline" className="w-full" disabled>
            <Star className="h-4 w-4 mr-2" />
            Faça login para avaliar
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Rating;
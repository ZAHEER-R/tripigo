import { Heart, Search, MapPin, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import type { Place } from '@/data/places';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    fetchLikeCount();
    if (user) {
      checkLiked();
      checkSaved();
    }
  }, [user, place.id]);

  const fetchLikeCount = async () => {
    const { count } = await supabase.from('likes').select('*', { count: 'exact', head: true }).eq('place_id', place.id);
    setLikeCount(count || 0);
  };

  const checkLiked = async () => {
    if (!user) return;
    const { data } = await supabase.from('likes').select('id').eq('user_id', user.id).eq('place_id', place.id).maybeSingle();
    setLiked(!!data);
  };

  const checkSaved = async () => {
    if (!user) return;
    const { data } = await supabase.from('saved_places' as any).select('id').eq('user_id', user.id).eq('place_id', place.id).maybeSingle();
    setSaved(!!data);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('place_id', place.id);
      setLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      await supabase.from('likes').insert({ user_id: user.id, place_id: place.id });
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    if (saved) {
      await (supabase.from('saved_places' as any) as any).delete().eq('user_id', user.id).eq('place_id', place.id);
      setSaved(false);
    } else {
      await (supabase.from('saved_places' as any) as any).insert({ user_id: user.id, place_id: place.id });
      setSaved(true);
    }
  };

  const handleGoogleSearch = (e: React.MouseEvent, query: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <Link to={`/place/${place.id}`} className="block">
      <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden">
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {user && (
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={handleSave}
                className="glass rounded-full p-2 hover:scale-110 transition-transform"
              >
                <Bookmark className={`w-4 h-4 ${saved ? 'fill-primary text-primary' : 'text-foreground'}`} />
              </button>
              <button
                onClick={handleLike}
                className="glass rounded-full p-2 hover:scale-110 transition-transform"
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
              </button>
            </div>
          )}
          <div className="absolute bottom-3 left-3">
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {place.country}
            </span>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="glass rounded-full px-2 py-1 text-xs flex items-center gap-1 text-foreground">
              <Heart className="w-3 h-3 text-red-500" /> {likeCount}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-card-foreground text-lg leading-tight">{place.name}</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full flex items-center gap-1">
              🍽️ {place.famous_food.split(',')[0]}
              <button
                onClick={(e) => handleGoogleSearch(e, `${place.famous_food.split(',')[0]} ${place.city || place.name}`)}
                className="ml-1 bg-primary/10 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
              >
                <Search className="w-3 h-3 text-primary" />
              </button>
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {place.top_attractions.slice(0, 2).map((attraction, i) => (
              <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                {attraction}
                <button
                  onClick={(e) => handleGoogleSearch(e, `${attraction} ${place.city || place.name}`)}
                  className="bg-primary/10 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                >
                  <Search className="w-2.5 h-2.5 text-primary" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;

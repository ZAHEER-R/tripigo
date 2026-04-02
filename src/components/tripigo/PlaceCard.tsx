import { Heart, Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Place } from '@/data/places';

interface PlaceCardProps {
  place: Place;
}

const PlaceCard = ({ place }: PlaceCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 500) + 50);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
  };

  const handleGoogleSearch = (e: React.MouseEvent, query: string) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
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
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={handleLike}
              className="glass rounded-full p-2 hover:scale-110 transition-transform"
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`} />
            </button>
          </div>
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
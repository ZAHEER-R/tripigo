import { useParams, Link } from 'react-router-dom';
import { placesData } from '@/data/places';
import { useState } from 'react';
import { ArrowLeft, MapPin, Users, Utensils, Landmark, Star, Camera, History, Palette, Calculator, Search, ExternalLink, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const tabs = [
  { key: 'overview', label: 'Overview', icon: Landmark },
  { key: 'history', label: 'History', icon: History },
  { key: 'culture', label: 'Culture', icon: Palette },
  { key: 'food', label: 'Food', icon: Utensils },
  { key: 'attractions', label: 'Attractions', icon: MapPin },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'media', label: 'Photos', icon: Camera },
  { key: 'budget', label: 'Budget', icon: Calculator },
];

const PlaceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const place = placesData.find(p => p.id === id);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviews, setReviews] = useState([
    { id: '1', user: 'Traveler Mike', rating: 5, content: 'Amazing place! Must visit for everyone.', likes: 24 },
    { id: '2', user: 'Wanderlust Sarah', rating: 4, content: 'Beautiful destination with great food.', likes: 18 },
  ]);

  // Budget calculator state
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState(3);

  if (!place) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">Place not found</p>
      </div>
    );
  }

  const totalBudget = {
    hotel: (place.avg_hotel_cost || 100) * days,
    food: (place.avg_food_cost || 30) * days * people,
    transport: (place.avg_transport_cost || 20) * days,
    tickets: (place.avg_ticket_cost || 15) * people,
    misc: ((place.avg_food_cost || 30) * days * people * 0.15),
  };
  const grandTotal = Object.values(totalBudget).reduce((a, b) => a + b, 0);

  const handleGoogleSearch = (query: string) => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
  };

  const submitReview = () => {
    if (!reviewText.trim()) return;
    setReviews(prev => [...prev, {
      id: Date.now().toString(),
      user: user?.email?.split('@')[0] || 'Anonymous',
      rating: reviewRating,
      content: reviewText,
      likes: 0,
    }]);
    setReviewText('');
  };

  return (
    <div className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-8">
      {/* Hero */}
      <div className="relative h-56 md:h-72">
        <img src={place.image_url} alt={place.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <Link to="/" className="absolute top-4 left-4 glass rounded-full p-2 hover:scale-105 transition-transform">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{place.name}</h1>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {place.country}
            </span>
            <span className="glass rounded-full px-3 py-1 text-xs text-foreground flex items-center gap-1">
              <Users className="w-3 h-3" /> {place.population}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 md:top-16 z-10 bg-background border-b border-border">
        <div className="flex overflow-x-auto gap-1 px-4 py-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'gradient-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <p className="text-foreground leading-relaxed">{place.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground">Population</p>
                <p className="font-bold text-foreground">{place.population}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="font-bold text-foreground">{place.currency}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <p className="text-xs text-muted-foreground mb-2">Famous Food</p>
              <div className="flex flex-wrap gap-2">
                {place.famous_food.split(',').map((food, i) => (
                  <span key={i} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    🍽️ {food.trim()}
                    <button onClick={() => handleGoogleSearch(`${food.trim()} ${place.city || place.name}`)} className="bg-primary/10 rounded-full p-0.5 hover:bg-primary/20">
                      <Search className="w-3 h-3 text-primary" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <a
              href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 gradient-primary text-primary-foreground rounded-xl px-4 py-3 font-medium hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-4 h-4" /> Open in Google Maps
            </a>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2"><History className="w-5 h-5 text-primary" /> History</h2>
            <p className="text-foreground leading-relaxed">{place.history}</p>
          </div>
        )}

        {activeTab === 'culture' && (
          <div className="bg-card rounded-xl p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2"><Palette className="w-5 h-5 text-primary" /> Culture</h2>
            <p className="text-foreground leading-relaxed">{place.culture}</p>
          </div>
        )}

        {activeTab === 'food' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Utensils className="w-5 h-5 text-primary" /> Famous Food</h2>
            {place.famous_food.split(',').map((food, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                <span className="font-medium text-foreground">🍽️ {food.trim()}</span>
                <button onClick={() => handleGoogleSearch(`${food.trim()} ${place.city || place.name}`)} className="gradient-primary text-primary-foreground rounded-full px-3 py-1 text-xs flex items-center gap-1">
                  <Search className="w-3 h-3" /> Search
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attractions' && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Top Attractions</h2>
            {place.top_attractions.map((attr, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                <span className="font-medium text-foreground">📍 {attr}</span>
                <button onClick={() => handleGoogleSearch(`${attr} ${place.city || place.name}`)} className="gradient-primary text-primary-foreground rounded-full px-3 py-1 text-xs flex items-center gap-1">
                  <Search className="w-3 h-3" /> Search
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Reviews</h2>
            {reviews.map(review => (
              <div key={review.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {review.user[0]}
                    </div>
                    <span className="font-medium text-sm text-foreground">{review.user}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                      ))}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3 text-red-500" /> {review.likes}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground">{review.content}</p>
              </div>
            ))}
            {user ? (
              <div className="bg-card rounded-xl p-4 border border-border space-y-3">
                <p className="font-medium text-foreground">Write a Review</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} onClick={() => setReviewRating(r)}>
                      <Star className={`w-5 h-5 ${r <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                    </button>
                  ))}
                </div>
                <Textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." className="bg-background" />
                <Button onClick={submitReview} className="gradient-primary text-primary-foreground border-0">Submit Review</Button>
              </div>
            ) : (
              <div className="bg-secondary rounded-xl p-4 text-center">
                <p className="text-sm text-secondary-foreground">
                  <Link to="/auth" className="text-primary font-medium hover:underline">Sign in</Link> to write a review
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Camera className="w-5 h-5 text-primary" /> Photos & Videos</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative rounded-xl overflow-hidden">
                <img src={place.image_url} alt={place.name} className="w-full h-40 object-cover" />
                <div className="absolute bottom-2 right-2 flex items-center gap-1 glass rounded-full px-2 py-1 text-xs text-foreground">
                  <Heart className="w-3 h-3 text-red-500" /> 42
                </div>
              </div>
            </div>
            {user && (
              <div className="bg-card rounded-xl p-4 border border-border text-center">
                <p className="text-sm text-muted-foreground mb-2">Upload photos/videos of {place.name}</p>
                <Button className="gradient-primary text-primary-foreground border-0">
                  <Camera className="w-4 h-4 mr-2" /> Upload
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2"><Calculator className="w-5 h-5 text-primary" /> Budget Calculator ({place.currency})</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">People</label>
                <Input type="number" value={people} onChange={e => setPeople(+e.target.value || 1)} min={1} className="bg-card" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Days</label>
                <Input type="number" value={days} onChange={e => setDays(+e.target.value || 1)} min={1} className="bg-card" />
              </div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border space-y-2">
              {Object.entries(totalBudget).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key === 'misc' ? 'Miscellaneous' : key}</span>
                  <span className="font-medium text-foreground">{place.currency} {val.toFixed(0)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between font-bold">
                <span className="text-foreground">Total</span>
                <span className="text-gradient">{place.currency} {grandTotal.toFixed(0)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;
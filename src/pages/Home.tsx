import { useState, useMemo, useEffect, useRef } from 'react';
import PlaceCard from '@/components/tripigo/PlaceCard';
import SearchBar from '@/components/tripigo/SearchBar';
import { placesData } from '@/data/places';
import heroImage from '@/assets/hero-travel.jpg';
import { TrendingUp, Star, Sparkles } from 'lucide-react';

const Home = () => {
  const [activeSection, setActiveSection] = useState<'popular' | 'trending' | 'recommended'>('popular');
  const [stickySearch, setStickySearch] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickySearch(!entry.isIntersecting),
      { threshold: 0 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const popular = useMemo(() => placesData.filter((_, i) => i % 3 === 0).slice(0, 12), []);
  const trending = useMemo(() => placesData.filter((_, i) => i % 3 === 1).slice(0, 12), []);
  const recommended = useMemo(() => placesData.filter((_, i) => i % 3 === 2).slice(0, 12), []);

  const sections = { popular, trending, recommended };
  const currentPlaces = sections[activeSection];

  return (
    <div className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-8">
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-64 md:h-80 overflow-hidden">
        <img src={heroImage} alt="Travel" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-4" style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            Explore the World with <span className="text-gradient">Tripigo</span>
          </h1>
          <p className="text-center text-sm md:text-base max-w-lg mb-6" style={{ color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            AI-powered travel guidance for your next adventure
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Sticky Search Bar */}
      {stickySearch && (
        <div className="fixed top-14 md:top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
          <SearchBar />
        </div>
      )}

      {/* Section Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'popular' as const, label: 'Popular', icon: Star },
            { key: 'trending' as const, label: 'Trending', icon: TrendingUp },
            { key: 'recommended' as const, label: 'Recommended', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeSection === tab.key
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {currentPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

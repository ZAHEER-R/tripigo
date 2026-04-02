import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { placesData } from '@/data/places';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof placesData>([]);
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length > 0) {
      const q = query.toLowerCase();
      const filtered = placesData.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.famous_food.toLowerCase().includes(q) ||
        (p.state && p.state.toLowerCase().includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q)) ||
        p.top_attractions.some(a => a.toLowerCase().includes(q))
      ).slice(0, 200);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search places, food, attractions..."
          className="w-full pl-12 pr-10 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
        />
        {query && (
          <button onClick={() => { setQuery(''); setIsOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-lg max-h-80 overflow-y-auto z-50">
          {results.map(place => (
            <Link
              key={place.id}
              to={`/place/${place.id}`}
              onClick={() => { setIsOpen(false); setQuery(''); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors border-b border-border last:border-0"
            >
              <img src={place.image_url} alt={place.name} className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <p className="text-sm font-medium text-card-foreground">{place.name}</p>
                <p className="text-xs text-muted-foreground">{place.country} • {place.famous_food.split(',')[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
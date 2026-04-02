import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { placesData, countryColors } from '@/data/places';
import { Link } from 'react-router-dom';
import { ExternalLink, Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const createColoredIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

function UserLocation() {
  const map = useMap();
  const [pos, setPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (p) => {
        const coords: [number, number] = [p.coords.latitude, p.coords.longitude];
        setPos(coords);
      },
      () => {}
    );
  }, [map]);

  if (!pos) return null;
  return (
    <Marker position={pos} icon={L.divIcon({
      className: 'user-location',
      html: '<div style="width:16px;height:16px;border-radius:50%;background:#22c55e;border:3px solid white;box-shadow:0 0 10px rgba(34,197,94,0.5);animation:pulse 2s infinite;"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })}>
      <Popup>📍 You are here</Popup>
    </Marker>
  );
}

const MapView = () => {
  const [filter, setFilter] = useState('all');
  const categories = ['all', 'tourist', 'hotel', 'restaurant'];

  const filteredPlaces = filter === 'all' ? placesData : placesData.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-8">
      <div className="px-4 py-3 flex gap-2 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === cat ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>
      <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
        <MapContainer center={[20, 0]} zoom={2} className="h-full w-full z-0" scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <UserLocation />
          {filteredPlaces.map(place => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createColoredIcon(countryColors[place.country] || '#22c55e')}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <img src={place.image_url} alt={place.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                  <h3 className="font-bold text-sm">{place.name}</h3>
                  <p className="text-xs text-gray-600">{place.country}</p>
                  <p className="text-xs mt-1">🍽️ {place.famous_food.split(',')[0]}</p>
                  <div className="flex gap-2 mt-2">
                    <Link to={`/place/${place.id}`} className="text-xs bg-green-500 text-white px-2 py-1 rounded-full hover:bg-green-600 transition-colors">
                      View Details
                    </Link>
                    <a
                      href={`https://www.google.com/maps?q=${place.lat},${place.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
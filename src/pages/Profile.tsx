import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, MapPin, Star, Bookmark, Edit2, Save, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { placesData } from '@/data/places';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [form, setForm] = useState({ display_name: '', username: '', age: '', gender: 'none', dob: '', native_place: '', language: 'en', phone: '' });
  const [savedPlaces, setSavedPlaces] = useState<string[]>([]);
  const [likedPlaces, setLikedPlaces] = useState<string[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'saved' | 'liked'>('saved');

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    fetchProfile();
    fetchSavedPlaces();
    fetchLikedPlaces();
    fetchReviewCount();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('profiles').select('*').eq('user_id', user.id).maybeSingle();
    if (data) {
      setProfile(data);
      setForm({
        display_name: data.display_name || '',
        username: (data as any).username || '',
        age: (data as any).age?.toString() || '',
        gender: data.gender || 'none',
        dob: (data as any).dob || '',
        native_place: (data as any).native_place || '',
        language: data.language || 'en',
        phone: data.phone || '',
      });
    }
  };

  const fetchSavedPlaces = async () => {
    if (!user) return;
    const { data } = await supabase.from('saved_places' as any).select('place_id').eq('user_id', user.id);
    if (data) setSavedPlaces((data as any[]).map((d: any) => d.place_id));
  };

  const fetchLikedPlaces = async () => {
    if (!user) return;
    const { data } = await supabase.from('likes').select('place_id').eq('user_id', user.id);
    if (data) setLikedPlaces(data.map(d => d.place_id));
  };

  const fetchReviewCount = async () => {
    if (!user) return;
    const { count } = await supabase.from('reviews').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    setReviewCount(count || 0);
  };

  const saveProfile = async () => {
    if (!user) return;
    await supabase.from('profiles').update({
      display_name: form.display_name,
      username: form.username,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      dob: form.dob || null,
      native_place: form.native_place,
      language: form.language,
      phone: form.phone,
    } as any).eq('user_id', user.id);
    setEditing(false);
    fetchProfile();
  };

  if (!user) return null;

  const savedPlacesList = placesData.filter(p => savedPlaces.includes(p.id));
  const likedPlacesList = placesData.filter(p => likedPlaces.includes(p.id));

  return (
    <div className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-card rounded-2xl p-6 border border-border text-center mb-6">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
            {(form.display_name || user.email)?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-xl font-bold text-card-foreground">{form.display_name || user.user_metadata?.full_name || 'User'}</h2>
          {form.username && <p className="text-sm text-primary">@{form.username}</p>}
          {!editing && (
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              {form.native_place && <p>📍 {form.native_place}</p>}
              {form.language && <p>🗣️ {form.language}</p>}
              {form.gender !== 'none' && <p>👤 {form.gender}</p>}
              {form.age && <p>🎂 {form.age} years</p>}
            </div>
          )}
          <Button onClick={() => setEditing(!editing)} variant="ghost" size="sm" className="mt-3">
            {editing ? <><X className="w-4 h-4 mr-1" /> Cancel</> : <><Edit2 className="w-4 h-4 mr-1" /> Edit Profile</>}
          </Button>
        </div>

        {editing && (
          <div className="bg-card rounded-2xl p-6 border border-border mb-6 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Display Name</label>
              <Input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Username</label>
              <Input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="unique_username" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Age</label>
                <Input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Date of Birth</label>
                <Input type="date" value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Gender</label>
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="w-full px-3 py-2 rounded-md bg-background border border-input text-foreground text-sm">
                <option value="none">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Native Place</label>
              <Input value={form.native_place} onChange={e => setForm(f => ({ ...f, native_place: e.target.value }))} placeholder="e.g. Mumbai, India" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Languages</label>
              <Input value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} placeholder="e.g. English, Hindi" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Phone</label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <Button onClick={saveProfile} className="w-full gradient-primary text-primary-foreground border-0">
              <Save className="w-4 h-4 mr-2" /> Save Profile
            </Button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <MapPin className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-card-foreground">{savedPlaces.length}</p>
            <p className="text-xs text-muted-foreground">Saved</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Star className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-card-foreground">{reviewCount}</p>
            <p className="text-xs text-muted-foreground">Reviews</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border text-center">
            <Bookmark className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-card-foreground">{likedPlaces.length}</p>
            <p className="text-xs text-muted-foreground">Liked</p>
          </div>
        </div>

        {/* Saved & Liked tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab('saved')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'saved' ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>Saved Places</button>
          <button onClick={() => setActiveTab('liked')} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === 'liked' ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>Liked Places</button>
        </div>

        <div className="space-y-3 mb-6">
          {(activeTab === 'saved' ? savedPlacesList : likedPlacesList).length === 0 ? (
            <div className="bg-card rounded-xl p-6 border border-border text-center">
              <p className="text-sm text-muted-foreground">No {activeTab} places yet. Explore and {activeTab === 'saved' ? 'save' : 'like'} some!</p>
            </div>
          ) : (
            (activeTab === 'saved' ? savedPlacesList : likedPlacesList).map(place => (
              <Link key={place.id} to={`/place/${place.id}`} className="flex items-center gap-3 bg-card rounded-xl p-3 border border-border hover:border-primary/30 transition-all">
                <img src={place.image_url} alt={place.name} className="w-14 h-14 rounded-lg object-cover" />
                <div>
                  <p className="font-medium text-card-foreground text-sm">{place.name}</p>
                  <p className="text-xs text-muted-foreground">{place.country}</p>
                </div>
              </Link>
            ))
          )}
        </div>

        <Button onClick={async () => { await signOut(); navigate('/'); }} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;

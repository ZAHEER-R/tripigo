import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, MapPin, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="bg-card rounded-2xl p-6 border border-border text-center mb-6">
          <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-xl font-bold text-card-foreground">{user.user_metadata?.full_name || user.email}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ icon: MapPin, label: 'Trips', val: '0' }, { icon: Star, label: 'Reviews', val: '0' }, { icon: Clock, label: 'Saved', val: '0' }].map(s => (
            <div key={s.label} className="bg-card rounded-xl p-4 border border-border text-center">
              <s.icon className="w-5 h-5 text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-card-foreground">{s.val}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <Button onClick={handleSignOut} variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;
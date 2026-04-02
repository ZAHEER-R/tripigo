import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Search, UserPlus, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Friends = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Sign in to connect with travelers</p>
          <Link to="/auth" className="gradient-primary text-primary-foreground px-6 py-3 rounded-xl font-medium">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 md:pt-16 pb-20 md:pb-8">
      <div className="container mx-auto px-4 py-6 max-w-lg">
        <h1 className="text-2xl font-bold text-foreground mb-4">Friends</h1>
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="bg-card rounded-xl p-8 border border-border text-center">
          <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No friends yet. Search for users to connect!</p>
        </div>
      </div>
    </div>
  );
};

export default Friends;
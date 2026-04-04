import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Search, UserPlus, Users, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

const Friends = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friends, setFriends] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchPendingRequests();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('friends')
      .select('*')
      .eq('status', 'accepted')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);
    if (data) {
      const friendIds = data.map(f => f.requester_id === user.id ? f.addressee_id : f.requester_id);
      if (friendIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', friendIds);
        setFriends(profiles || []);
      }
    }
  };

  const fetchPendingRequests = async () => {
    if (!user) return;
    const { data } = await supabase.from('friends').select('*').eq('addressee_id', user.id).eq('status', 'pending');
    if (data && data.length > 0) {
      const requesterIds = data.map(f => f.requester_id);
      const { data: profiles } = await supabase.from('profiles').select('*').in('user_id', requesterIds);
      setPendingRequests((profiles || []).map(p => ({ ...p, friendRequestId: data.find(f => f.requester_id === p.user_id)?.id })));
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim() || !user) return;
    setSearching(true);
    const q = searchQuery.trim().toLowerCase();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .or(`display_name.ilike.%${q}%,username.ilike.%${q}%`)
      .neq('user_id', user.id)
      .limit(20);
    setSearchResults(data || []);
    setSearching(false);
  };

  const sendFriendRequest = async (addresseeId: string) => {
    if (!user) return;
    await supabase.from('friends').insert({ requester_id: user.id, addressee_id: addresseeId });
    setSearchResults(prev => prev.filter(p => p.user_id !== addresseeId));
  };

  const acceptRequest = async (friendRequestId: string, requesterId: string) => {
    await supabase.from('friends').update({ status: 'accepted' }).eq('id', friendRequestId);
    setPendingRequests(prev => prev.filter(p => p.friendRequestId !== friendRequestId));
    fetchFriends();
  };

  const rejectRequest = async (friendRequestId: string) => {
    await supabase.from('friends').update({ status: 'rejected' }).eq('id', friendRequestId);
    setPendingRequests(prev => prev.filter(p => p.friendRequestId !== friendRequestId));
  };

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
            onKeyDown={e => e.key === 'Enter' && searchUsers()}
            placeholder="Search by username or name..."
            className="w-full pl-10 pr-20 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button onClick={searchUsers} size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 gradient-primary text-primary-foreground border-0">
            Search
          </Button>
        </div>

        {searchResults.length > 0 && (
          <div className="mb-6 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Search Results</h3>
            {searchResults.map(profile => (
              <div key={profile.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {(profile.display_name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground text-sm">{profile.display_name || 'User'}</p>
                    {(profile as any).username && <p className="text-xs text-primary">@{(profile as any).username}</p>}
                    {(profile as any).native_place && <p className="text-xs text-muted-foreground">📍 {(profile as any).native_place}</p>}
                  </div>
                </div>
                <Button size="sm" onClick={() => sendFriendRequest(profile.user_id)} className="gradient-primary text-primary-foreground border-0">
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {pendingRequests.length > 0 && (
          <div className="mb-6 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Requests</h3>
            {pendingRequests.map((profile: any) => (
              <div key={profile.id} className="bg-card rounded-xl p-4 border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                    {(profile.display_name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-card-foreground text-sm">{profile.display_name || 'User'}</p>
                    {profile.username && <p className="text-xs text-primary">@{profile.username}</p>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => acceptRequest(profile.friendRequestId, profile.user_id)} className="gradient-primary text-primary-foreground border-0">
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => rejectRequest(profile.friendRequestId)} className="border-destructive text-destructive">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Your Friends ({friends.length})</h3>
          {friends.length === 0 ? (
            <div className="bg-card rounded-xl p-8 border border-border text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No friends yet. Search for users to connect!</p>
            </div>
          ) : (
            friends.map(friend => (
              <div key={friend.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {(friend.display_name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-card-foreground text-sm">{friend.display_name || 'User'}</p>
                  {(friend as any).username && <p className="text-xs text-primary">@{(friend as any).username}</p>}
                  {(friend as any).native_place && <p className="text-xs text-muted-foreground">📍 {(friend as any).native_place}</p>}
                  {friend.language && <p className="text-xs text-muted-foreground">🗣️ {friend.language}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Friends;

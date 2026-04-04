import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Users, User, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import tripigoLogo from '/tripigo-logo.png';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/ai-agent', label: 'Tripigo AI', icon: MessageCircle },
    { path: '/friends', label: 'Friends', icon: Users },
    ...(user ? [{ path: '/profile', label: 'Profile', icon: User }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop/Tablet Top Nav */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 glass shadow-sm px-6 py-3 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={tripigoLogo} alt="Tripigo" className="w-12 h-12" />
          <span className="text-2xl font-bold text-gradient">Tripigo</span>
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </div>
        {!user ? (
          <Link to="/auth">
            <Button size="lg" className="gradient-primary text-primary-foreground border-0 shadow-md hover:shadow-lg transition-shadow text-base px-8 py-3">
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </Button>
          </Link>
        ) : (
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-base font-bold">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border px-2 py-1 flex justify-around items-center">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg text-xs transition-all duration-200 ${
              isActive(item.path)
                ? 'text-primary font-semibold'
                : 'text-muted-foreground'
            }`}
          >
            <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'text-primary' : ''}`} />
            {item.label}
          </Link>
        ))}
        {!user && (
          <Link to="/auth" className="flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-lg text-xs text-muted-foreground">
            <LogIn className="w-5 h-5" />
            Login
          </Link>
        )}
      </nav>

      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={tripigoLogo} alt="Tripigo" className="w-10 h-10" />
          <span className="text-xl font-bold text-gradient">Tripigo</span>
        </Link>
        {!user ? (
          <Link to="/auth">
            <Button size="default" className="gradient-primary text-primary-foreground border-0 text-sm px-5 py-2">
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </Button>
          </Link>
        ) : (
          <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
            {user.email?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;

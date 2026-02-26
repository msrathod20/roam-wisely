import { Link, useLocation } from "react-router-dom";
import { Compass, Map, User, LogOut, Heart, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-card border-b border-border"
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg font-bold text-foreground">Explorer</span>
            <span className="text-xs text-muted-foreground block -mt-1 font-sans">Beyond Horizons</span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/explore"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/explore") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Explore</span>
          </Link>

          {user && (
            <>
              <Link
                to="/favorites"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/favorites") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </Link>
              <Link
                to="/groups"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/groups") ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Groups</span>
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link
                to="/profile"
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-semibold"
              >
                {user.name[0].toUpperCase()}
              </Link>
              <button onClick={logout} className="p-2 text-muted-foreground hover:text-foreground transition-colors" aria-label="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity ml-2"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

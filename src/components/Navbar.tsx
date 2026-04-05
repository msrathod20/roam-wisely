import { Link, useLocation } from "react-router-dom";
import { Compass, Map, User, LogOut, Heart, Users, Sparkles } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isLanding = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isLanding ? "bg-transparent absolute w-full" : "glass-card border-b border-border shadow-sm"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <Compass className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className={`font-display text-lg font-bold ${isLanding ? "text-foreground" : "text-foreground"}`}>
              Explorer
            </span>
            <span className={`text-[10px] block -mt-0.5 font-medium tracking-wider uppercase ${
              isLanding ? "text-muted-foreground" : "text-muted-foreground"
            }`}>
              Beyond Horizons
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1 sm:gap-1.5">
          <Link
            to="/explore"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive("/explore")
                ? "bg-primary text-primary-foreground shadow-sm"
                : isLanding
                  ? "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">Explore</span>
          </Link>

          <Link
            to="/trip-planner"
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
              isActive("/trip-planner")
                ? "bg-primary text-primary-foreground shadow-sm"
                : isLanding
                  ? "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Planner</span>
          </Link>

          {user && (
            <>
              <Link
                to="/favorites"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/favorites")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isLanding
                      ? "text-primary-foreground/80 hover:bg-primary-foreground/10"
                      : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </Link>
              <Link
                to="/groups"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive("/groups")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : isLanding
                      ? "text-primary-foreground/80 hover:bg-primary-foreground/10"
                      : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Groups</span>
              </Link>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-1.5 ml-2">
              <Link
                to="/profile"
                className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shadow-sm hover:shadow-md transition-shadow"
              >
                {user.name[0].toUpperCase()}
              </Link>
              <button
                onClick={logout}
                className={`p-2 rounded-lg transition-colors ${
                  isLanding ? "text-primary-foreground/70 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 ml-2"
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

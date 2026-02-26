import { useApp } from "@/context/AppContext";
import { categoryConfig, PlaceCategory, BANGALORE_PLACES } from "@/data/places";
import { User, MapPin, Star, Eye, Bookmark } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, visitedPlaces, favorites, ratings } = useApp();

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <User className="w-12 h-12 mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground">Sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="container py-6 max-w-lg min-h-[60vh]">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mb-3">
            {user.name[0].toUpperCase()}
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-card rounded-xl border border-border p-4 text-center card-elevated">
            <Eye className="w-5 h-5 mx-auto text-primary mb-1" />
            <div className="text-xl font-bold text-foreground">{visitedPlaces.length}</div>
            <div className="text-xs text-muted-foreground">Visited</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center card-elevated">
            <Bookmark className="w-5 h-5 mx-auto text-secondary mb-1" />
            <div className="text-xl font-bold text-foreground">{favorites.length}</div>
            <div className="text-xs text-muted-foreground">Saved</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center card-elevated">
            <Star className="w-5 h-5 mx-auto text-warning mb-1" />
            <div className="text-xl font-bold text-foreground">{Object.keys(ratings).length}</div>
            <div className="text-xs text-muted-foreground">Rated</div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 card-elevated">
          <h2 className="font-semibold text-foreground mb-3 font-sans">Your Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map(cat => {
              const cfg = categoryConfig[cat];
              return (
                <span key={cat} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                  <cfg.icon className="w-3 h-3" /> {cfg.label}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { useApp } from "@/context/AppContext";
import { categoryConfig, PlaceCategory } from "@/data/places";
import { User, Star, Eye, Bookmark, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, visitedPlaces, favorites, ratings } = useApp();

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="font-display font-bold text-foreground text-lg">Sign in to view your profile</p>
        <p className="text-sm text-muted-foreground mt-1">Track your adventures and preferences</p>
      </div>
    );
  }

  const statCards = [
    { icon: Eye, value: visitedPlaces.length, label: "Visited", color: "text-primary" },
    { icon: Bookmark, value: favorites.length, label: "Saved", color: "text-secondary" },
    { icon: Star, value: Object.keys(ratings).length, label: "Rated", color: "text-warning" },
  ];

  return (
    <div className="container py-8 max-w-lg min-h-[60vh]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-10">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-primary flex items-center justify-center text-primary-foreground text-3xl font-extrabold mb-4 shadow-lg shadow-primary/20">
            {user.name[0].toUpperCase()}
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">{user.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          <div className="badge-primary mt-3 inline-flex">
            <TrendingUp className="w-3.5 h-3.5" /> Explorer
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {statCards.map(({ icon: Icon, value, label, color }) => (
            <motion.div
              key={label}
              whileHover={{ y: -2 }}
              className="bg-card rounded-2xl border border-border p-5 text-center card-elevated"
            >
              <Icon className={`w-6 h-6 mx-auto ${color} mb-2`} />
              <div className="text-2xl font-display font-extrabold text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 card-elevated">
          <h2 className="font-display font-bold text-foreground text-lg mb-4">Your Interests</h2>
          <div className="flex flex-wrap gap-2">
            {user.interests.map(cat => {
              const cfg = categoryConfig[cat];
              return (
                <span key={cat} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-accent text-accent-foreground">
                  <cfg.icon className="w-3.5 h-3.5" /> {cfg.label}
                </span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

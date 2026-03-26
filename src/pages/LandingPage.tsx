import { Link } from "react-router-dom";
import { Compass, MapPin, Leaf, Users, ArrowRight, Star, Sparkles, TrendingUp, Shield, Coffee, Camera, TreePine, Utensils, Clock, Navigation, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { BANGALORE_PLACES, categoryConfig, PlaceCategory } from "@/data/places";

const features = [
  { icon: MapPin, title: "Live Location Discovery", desc: "We detect your location and instantly show the best places around you — temples, food streets, parks, and hidden gems.", color: "bg-primary/10 text-primary" },
  { icon: Utensils, title: "Food & Culture Intel", desc: "Not just directions — we tell you what to eat, the history behind it, and the cultural significance of every place.", color: "bg-secondary/10 text-secondary" },
  { icon: Leaf, title: "Eco-Conscious Travel", desc: "Discover sustainable spots with our eco badges. We highlight places that protect the environment you explore.", color: "bg-eco-light text-eco" },
  { icon: Users, title: "Group Adventures", desc: "Create trip groups, invite friends, and track each other live. Explore as a crew, not just solo.", color: "bg-accent text-accent-foreground" },
];

const stats = [
  { value: "20+", label: "Curated Places", icon: MapPin },
  { value: "8", label: "Categories", icon: Coffee },
  { value: "100+", label: "Food Spots Listed", icon: Utensils },
  { value: "Free", label: "Always & Forever", icon: Star },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

export default function LandingPage() {
  const topPlaces = BANGALORE_PLACES.slice(0, 6);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        <img src={heroBg} alt="Bangalore cityscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />

        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/20 blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-secondary/20 blur-[100px] animate-pulse-soft" />

        <div className="relative container z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="h-px flex-1 max-w-[80px] bg-primary-foreground/20" />
              <span className="text-primary-foreground/70 font-medium text-sm tracking-[0.2em] uppercase">Explorer — Beyond Horizons</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground leading-[1.05] mb-6">
              Know Every{" "}
              <span className="text-gradient">Place</span>
              <br />
              Around You
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/75 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Your personal travel companion for Bangalore. We find places near you and tell you everything — the history, the food, the culture, and the insider tips locals know.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                <MapPin className="w-5 h-5" /> Find Places Near Me
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl glass-card text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 transition-all duration-300"
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-primary-foreground/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary-foreground/40 to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-8 md:-mt-12 z-10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-lg border border-border p-5 sm:p-6 md:p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-2"
                >
                  <s.icon className="w-5 h-5 mx-auto text-primary mb-1.5" />
                  <div className="text-2xl sm:text-3xl md:text-4xl font-display font-extrabold text-foreground leading-tight">{s.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge-primary mb-4 inline-flex">
              <Navigation className="w-3.5 h-3.5" /> How It Works
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground mb-4">
              Three Steps to <span className="text-gradient">Discover</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              No signups needed. Just open, explore, and learn about the incredible places around you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "We Find You", desc: "Allow location access and we instantly detect where you are in Bangalore.", icon: MapPin },
              { step: "02", title: "We Show You", desc: "See places sorted by distance with rich details — history, food spots, cultural insights, and tips.", icon: Sparkles },
              { step: "03", title: "You Explore", desc: "Pick a place, read the story, try the food, and get directions with one tap.", icon: Navigation },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <span className="text-xs font-bold text-primary tracking-widest">{item.step}</span>
                <h3 className="font-display font-bold text-foreground text-xl mt-2 mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge-primary mb-4 inline-flex">
              <Sparkles className="w-3.5 h-3.5" /> Why Explorer?
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground mb-4">
              Not Just Maps. <span className="text-gradient-warm">Real Knowledge.</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We don't just show you where places are — we tell you why they matter, what to eat, and the stories behind them.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="bg-card rounded-2xl p-7 card-elevated border border-border group"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Places */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12"
          >
            <div>
              <span className="badge-primary mb-4 inline-flex">
                <TrendingUp className="w-3.5 h-3.5" /> Trending
              </span>
              <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground">
                Popular <span className="text-gradient-warm">Destinations</span>
              </h2>
              <p className="text-muted-foreground mt-2">Tap any card to see full details — history, food, culture, and more</p>
            </div>
            <Link
              to="/explore"
              className="group flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View all 20+ places
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topPlaces.map((place, i) => {
              const cat = categoryConfig[place.category];
              return (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to="/explore"
                    className="block bg-card rounded-2xl overflow-hidden card-elevated border border-border group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        {place.isEcoFriendly && (
                          <span className="eco-badge text-[10px]">
                            <Leaf className="w-2.5 h-2.5" /> Eco
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-1 text-primary-foreground/90 text-xs mb-1">
                          <Star className="w-3 h-3 fill-warning text-warning" /> {place.rating}
                          <span className="mx-1 opacity-40">•</span>
                          <cat.icon className="w-3 h-3" /> {cat.label}
                        </div>
                        <h3 className="text-primary-foreground font-display font-bold text-base leading-tight">{place.name}</h3>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{place.description}</p>
                      {place.foodNearby && (
                        <p className="text-xs text-muted-foreground/70 truncate">🍴 {place.foodNearby[0]}</p>
                      )}
                      <div className="flex items-center text-xs text-primary font-semibold pt-1">
                        View details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What You'll Discover */}
      <section className="section-padding bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              What You'll Learn About Every Place
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">We go beyond basic info to give you everything you need</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              { emoji: "📖", title: "History & Origin", desc: "How it was built, who founded it, and why it matters" },
              { emoji: "🍴", title: "Food Nearby", desc: "Best restaurants, street food, and local specialties" },
              { emoji: "🏛️", title: "Cultural Insights", desc: "Traditions, festivals, and stories locals know" },
              { emoji: "🎯", title: "Things to Try", desc: "Activities, experiences, and must-do items" },
              { emoji: "⏰", title: "Best Time to Visit", desc: "When to go for the best experience" },
              { emoji: "🎫", title: "Entry & Pricing", desc: "Tickets, fees, and money-saving tips" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 bg-card rounded-xl border border-border p-5"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div>
                  <h3 className="font-display font-bold text-foreground text-sm mb-0.5">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3">
              Explore by Interest
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Find exactly what excites you — from street food to heritage walks</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {(Object.keys(categoryConfig) as PlaceCategory[]).map((cat, i) => {
              const cfg = categoryConfig[cat];
              const count = BANGALORE_PLACES.filter(p => p.category === cat).length;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to="/explore"
                    className="group flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-card border border-border card-elevated text-sm font-semibold text-foreground hover:border-primary/30 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <cfg.icon className="w-4.5 h-4.5 text-accent-foreground group-hover:text-primary transition-colors" />
                    </div>
                    {cfg.label}
                    <span className="text-xs text-muted-foreground ml-1">({count})</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl" />
        <div className="relative container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-primary-foreground mb-5">
              Start Discovering<br />Bangalore Now
            </h2>
            <p className="text-primary-foreground/75 text-lg mb-10 max-w-lg mx-auto">
              20+ curated places with deep cultural insights, food recommendations, and history. Completely free, forever.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/explore"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-foreground text-primary font-bold text-lg hover:shadow-xl transition-all duration-300"
              >
                <MapPin className="w-5 h-5" /> Explore Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-primary-foreground/30 text-primary-foreground font-bold text-lg hover:bg-primary-foreground/10 transition-all duration-300"
              >
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Compass className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="font-display font-bold text-foreground">Explorer</span>
                <span className="text-xs text-muted-foreground block">Beyond Horizons</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Final Year Project • Dayananda Sagar College of Engineering • 2025
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link to="/explore" className="hover:text-primary transition-colors">Explore</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Sign In</Link>
              <Link to="/register" className="hover:text-primary transition-colors">Sign Up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

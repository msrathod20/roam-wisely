import { Link } from "react-router-dom";
import { Compass, MapPin, Leaf, Users, Search, ArrowRight, Star, Sparkles, TrendingUp, Shield, Coffee, Camera, TreePine } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { BANGALORE_PLACES, categoryConfig, PlaceCategory } from "@/data/places";

const features = [
  { icon: Sparkles, title: "AI-Powered Discovery", desc: "Get personalized recommendations based on your interests, mood, and real-time location.", color: "bg-primary/10 text-primary" },
  { icon: Leaf, title: "Eco-Conscious Travel", desc: "Discover sustainable spots and make travel choices that protect our planet.", color: "bg-eco-light text-eco" },
  { icon: Users, title: "Group Adventures", desc: "Plan trips with friends, track each other live, and explore as a crew.", color: "bg-secondary/10 text-secondary" },
  { icon: Shield, title: "Verified & Curated", desc: "Every place is hand-picked with honest ratings and real cultural insights.", color: "bg-accent text-accent-foreground" },
];

const stats = [
  { value: "12+", label: "Curated Places", icon: MapPin },
  { value: "8", label: "Categories", icon: Coffee },
  { value: "100%", label: "Free Forever", icon: Star },
  { value: "24/7", label: "Always Available", icon: TrendingUp },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const } }),
};

export default function LandingPage() {
  const topPlaces = BANGALORE_PLACES.slice(0, 4);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[92vh] flex items-center">
        <img src={heroBg} alt="Bangalore cityscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-primary/20 blur-[100px] animate-pulse-soft" />
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-secondary/20 blur-[100px] animate-pulse-soft" />

        <div className="relative container z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="h-px flex-1 max-w-[80px] bg-primary-foreground/20" />
              <span className="text-primary-foreground/70 font-medium text-sm tracking-[0.2em] uppercase">Explorer — Beyond Horizons</span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1} className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground leading-[1.05] mb-8">
              Discover the{" "}
              <span className="relative">
                <span className="text-gradient">Soul</span>
              </span>
              <br />
              of Bangalore
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-primary-foreground/75 text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Smart, location-based travel recommendations. Uncover hidden gems, eco-friendly sanctuaries, and cultural treasures around you.
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
              >
                Start Exploring
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-primary-foreground/40 text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary-foreground/40 to-transparent" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative -mt-12 z-10">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl shadow-lg border border-border p-6 md:p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <s.icon className="w-5 h-5 mx-auto text-primary mb-2" />
                  <div className="text-3xl md:text-4xl font-display font-extrabold text-foreground">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
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
              Travel Smarter, <span className="text-gradient">Not Harder</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powered by intelligent algorithms and your unique preferences to deliver the perfect adventure every time
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
      <section className="section-padding bg-muted/50">
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
            </div>
            <Link
              to="/explore"
              className="group flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              View all places
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topPlaces.map((place, i) => {
              const cat = categoryConfig[place.category];
              return (
                <motion.div
                  key={place.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
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
                    <div className="p-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{place.description}</p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
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
            <p className="text-muted-foreground max-w-lg mx-auto">Find exactly what excites you — from street food to nature trails</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {(Object.keys(categoryConfig) as PlaceCategory[]).map((cat, i) => {
              const cfg = categoryConfig[cat];
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
              Ready to Explore<br />Bangalore?
            </h2>
            <p className="text-primary-foreground/75 text-lg mb-10 max-w-lg mx-auto">
              Join thousands of travelers discovering the city's best-kept secrets. It's completely free.
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
              Final Year Project • Dayananda Sagar College of Engineering
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

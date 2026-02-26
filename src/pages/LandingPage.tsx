import { Link } from "react-router-dom";
import { Compass, MapPin, Leaf, Users, Search, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: MapPin, title: "Smart Discovery", desc: "AI-powered recommendations based on your interests and location" },
  { icon: Leaf, title: "Sustainable Travel", desc: "Find eco-friendly spots and make responsible travel choices" },
  { icon: Users, title: "Group Trips", desc: "Track friends in real-time and explore together" },
  { icon: Search, title: "Smart Filters", desc: "Filter by distance, category, and sustainability" },
];

const stats = [
  { value: "12+", label: "Places in Bangalore" },
  { value: "8", label: "Categories" },
  { value: "100%", label: "Free to Use" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
        <img src={heroBg} alt="Bangalore cityscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="relative container z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Compass className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-primary-foreground/80 font-semibold text-sm tracking-wider uppercase">Explorer — Beyond Horizons</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
              Discover the <br />
              <span className="text-gradient">Soul of Bangalore</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-lg mb-8 font-light">
              Smart, location-based travel recommendations. Find hidden gems, eco-friendly spots, and cultural treasures around you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
              >
                Start Exploring <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass-card text-primary-foreground font-semibold text-lg hover:bg-card/20 transition-all"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-6 bg-primary">
        <div className="container flex flex-wrap justify-center gap-12">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-primary-foreground">{s.value}</div>
              <div className="text-sm text-primary-foreground/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 container">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Travel Smarter, Not Harder
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Powered by smart algorithms and your unique preferences
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-6 card-elevated text-center"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-accent flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 font-sans">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-accent">
        <div className="container text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Explore?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
            Start discovering amazing places around Bangalore today. It's free and always will be.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all shadow-lg"
          >
            <MapPin className="w-5 h-5" /> Explore Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />
            <span>Explorer — Beyond Horizons</span>
          </div>
          <p>Final Year Project • Dayananda Sagar College of Engineering</p>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PlaceCategory, categoryConfig } from "@/data/places";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(50),
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export default function RegisterPage() {
  const { register } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [interests, setInterests] = useState<PlaceCategory[]>([]);
  const [error, setError] = useState("");

  const toggleInterest = (cat: PlaceCategory) => {
    setInterests(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    if (interests.length === 0) {
      setError("Select at least one interest");
      return;
    }
    register(name, email, password, interests);
    navigate("/explore");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Compass className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Create Account</h1>
          <p className="text-sm text-muted-foreground mt-2">Tell us what you love to explore</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-7 space-y-5 shadow-lg">
          {error && <div className="text-sm text-destructive bg-destructive/10 rounded-xl p-3.5 font-medium">{error}</div>}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="Your name" required />
          </div>
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">Password</label>
            <div className="relative">
              <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-10 transition-shadow"
                placeholder="••••••" required />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-bold text-foreground block mb-2.5">Your Interests</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryConfig) as PlaceCategory[]).map(cat => {
                const cfg = categoryConfig[cat];
                const active = interests.includes(cat);
                return (
                  <button key={cat} type="button" onClick={() => toggleInterest(cat)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <cfg.icon className="w-3.5 h-3.5" /> {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Create Account <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

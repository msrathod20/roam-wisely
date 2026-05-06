import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Eye, EyeOff, ArrowRight, Sparkles, MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { PlaceCategory, categoryConfig } from "@/data/places";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name too short").max(50),
  email: z.string().trim().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [interests, setInterests] = useState<PlaceCategory[]>([]);
  const [error, setError] = useState("");

  const toggleInterest = (cat: PlaceCategory) => {
    setInterests((prev) => (prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]));
  };

  // 🚀 FINAL HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
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

    setError("");

    // ✅ STEP 1: Create user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/explore`,
        data: { name, interests },
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    const user = data.user;

    // ⚠️ If email confirmation ON → user may be null
    if (!user) {
      toast.success("Check your email to confirm signup");
      navigate("/explore");
      return;
    }

    await (supabase as any).from("profiles").upsert(
      { user_id: user.id, name: name.trim(), interests },
      { onConflict: "user_id" }
    );

    toast.success("Signup successful 🚀");
    navigate("/explore");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
      {/* Visual side — hidden on mobile */}
      <div className="relative hidden lg:flex items-end overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/40 to-foreground/70" />
        <div className="relative z-10 p-12 text-white space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> For explorers, not tourists
          </div>
          <h2 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight">
            Start discovering places beyond the ordinary.
          </h2>
          <p className="text-white/85 text-base leading-relaxed">
            Explorer helps you discover hidden gems, rural culture, authentic food, and meaningful travel experiences across India.
          </p>
          <div className="flex gap-3 pt-4">
            {[
              { icon: MapPin, label: "Hidden Gems" },
              { icon: Heart, label: "Local Stories" },
              { icon: Sparkles, label: "AI Trips" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center">
                <Icon className="w-5 h-5 mx-auto mb-1.5" />
                <p className="text-[11px] font-semibold">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-4 sm:p-8 bg-gradient-to-b from-background to-accent/30">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-7">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <Compass className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-extrabold text-foreground">Join the journey</h1>
            <p className="text-sm text-muted-foreground mt-2">Create your Explorer account in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-xl p-3 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-foreground block mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-11 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-foreground mb-2 uppercase tracking-wide">What sparks your wanderlust?</p>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(categoryConfig) as PlaceCategory[]).map((cat) => {
                  const active = interests.includes(cat);
                  const Icon = categoryConfig[cat].icon;
                  return (
                    <motion.button
                      key={cat}
                      type="button"
                      whileTap={{ scale: 0.94 }}
                      onClick={() => toggleInterest(cat)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30"
                          : "bg-background text-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {categoryConfig[cat].label}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
            >
              Create Account <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already exploring?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

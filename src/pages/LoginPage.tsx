import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
import heroBg from "@/assets/hero-bg.jpg";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character (!@#$%...)"),
});

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    login(email, password);
    navigate("/explore");
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 opacity-5">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Compass className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-3xl font-extrabold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-2">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-7 space-y-5 shadow-lg">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-xl p-3.5 font-medium">{error}</div>
          )}
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-bold text-foreground block mb-2">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-10 transition-shadow"
                placeholder="••••••"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
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
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-primary flex items-center justify-center mb-3">
            <Compass className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to continue exploring</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-4 card-elevated">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">{error}</div>
          )}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                placeholder="••••••"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
            Sign In
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

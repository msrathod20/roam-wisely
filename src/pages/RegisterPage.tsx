import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { PlaceCategory, categoryConfig } from "@/data/places";
import { z } from "zod";

// ✅ Supabase
import { supabase } from "@/integrations/supabase/client";

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
    });

    if (error) {
      setError(error.message);
      return;
    }

    const user = data.user;

    // ⚠️ If email confirmation ON → user may be null
    if (!user) {
      alert("Check your email to confirm signup");
      return;
    }

    // ✅ STEP 2: Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: user.id,
        name: name,
        interests: interests,
      },
    ]);

    if (profileError) {
      console.log(profileError);
      setError("Profile save failed");
      return;
    }

    alert("Signup successful 🚀");
    navigate("/login");
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
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold">Create Account</h1>
          <p className="text-sm mt-2">Tell us what you love to explore</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-4 shadow">
          {error && <div className="text-sm text-red-600 bg-red-100 p-2 rounded">{error}</div>}

          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full p-3 border rounded"
            required
          />

          {/* Email */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border rounded pr-10"
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3">
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Interests */}
          <div>
            <p className="font-bold mb-2">Select Interests</p>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(categoryConfig) as PlaceCategory[]).map((cat) => {
                const active = interests.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleInterest(cat)}
                    className={`px-3 py-2 rounded text-xs ${active ? "bg-green-500 text-white" : "bg-gray-200"}`}
                  >
                    {categoryConfig[cat].label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button className="w-full py-3 bg-green-600 text-white rounded flex justify-center gap-2">
            Create Account <ArrowRight size={16} />
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-bold">
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

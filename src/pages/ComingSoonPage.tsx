import { useState } from "react";
import { motion } from "framer-motion";
import { Compass, MapPin, Sparkles, Mountain, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: "easeOut" as const },
  }),
};

const values = [
  {
    icon: MapPin,
    title: "Hidden Gems",
    desc: "Find places not listed on typical travel platforms.",
  },
  {
    icon: Mountain,
    title: "Rural Culture",
    desc: "Experience traditions, villages, and authentic lifestyles.",
  },
  {
    icon: Sparkles,
    title: "AI Travel",
    desc: "Smart journeys that guide you beyond the obvious.",
  },
];

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success("You're on the list. Welcome, explorer.");
      setEmail("");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070d] text-white font-sans">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(14,116,144,0.18),_transparent_50%)]" />

      {/* Animated stars */}
      <div className="pointer-events-none absolute inset-0 opacity-70">
        {Array.from({ length: 60 }).map((_, i) => {
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const size = Math.random() * 2 + 1;
          const delay = Math.random() * 5;
          const dur = 2 + Math.random() * 4;
          return (
            <span
              key={i}
              className="absolute rounded-full bg-white/70"
              style={{
                top: `${top}%`,
                left: `${left}%`,
                width: size,
                height: size,
                animation: `twinkle ${dur}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
      </div>

      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[140px]" />

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
            <Compass className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Explorer</span>
        </motion.div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur"
        >
          Coming Soon
        </motion.span>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-24 text-center sm:pt-24">
        <motion.div initial="hidden" animate="visible">
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-1.5 text-xs font-medium text-cyan-300"
          >
            <Sparkles className="h-3.5 w-3.5" /> Beyond the tourist trail
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-6xl font-bold leading-none tracking-tight text-transparent sm:text-8xl"
          >
            Explorer<span className="text-cyan-400">.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 text-xl font-light text-white/80 sm:text-2xl"
          >
            Discover the unseen stories of India
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={3}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/55"
          >
            Go beyond maps. Explore hidden places, rural culture, and real
            stories that most travelers miss.
          </motion.p>

          <motion.div variants={fadeUp} custom={4} className="mt-10">
            <a
              href="#join"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3.5 text-sm font-semibold text-[#05070d] shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/50 hover:-translate-y-0.5"
            >
              Join the Movement
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-3">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-cyan-400/30 hover:bg-white/[0.05]"
            >
              <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-400/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-500/20 ring-1 ring-cyan-400/20">
                <v.icon className="h-5 w-5 text-cyan-300" />
              </div>
              <h3 className="mb-1.5 text-lg font-semibold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emotional */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-light leading-relaxed text-white/85 sm:text-3xl"
        >
          We don't just help you travel.
          <br />
          <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
            We help you connect
          </span>{" "}
          — with places, people, and culture.
        </motion.p>
      </section>

      {/* Email Capture */}
      <section id="join" className="relative z-10 mx-auto max-w-xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 backdrop-blur-md"
        >
          <h3 className="mb-2 text-center text-2xl font-semibold">
            Be the first to explore
          </h3>
          <p className="mb-6 text-center text-sm text-white/55">
            Get early access when we launch.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition-all focus:border-cyan-400/50 focus:bg-white/10 focus:ring-2 focus:ring-cyan-400/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-6 text-sm font-semibold text-[#05070d] shadow-lg shadow-cyan-500/25 transition-all hover:shadow-cyan-500/50 hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Joining..." : "Get Early Access"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-sm text-white/50 sm:flex-row">
          <p>Built for explorers, not tourists 🌍</p>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-white/80">Explorer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Wallet, Sparkles, Loader2, Save, CheckCircle, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const INTEREST_OPTIONS = [
  { id: "nature", label: "🌿 Nature", color: "bg-green-100 text-green-800 border-green-300" },
  { id: "temples", label: "🛕 Temples", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "food", label: "🍛 Food", color: "bg-red-100 text-red-800 border-red-300" },
  { id: "adventure", label: "🏔️ Adventure", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "historical", label: "🏛️ Historical", color: "bg-amber-100 text-amber-800 border-amber-300" },
];

interface TripPlace {
  name: string;
  description: string;
  tip?: string;
}

interface TripDay {
  day: number;
  title: string;
  places: TripPlace[];
  travelTip?: string;
}

interface TripPlan {
  title: string;
  overview: string;
  days: TripDay[];
}

interface SavedTrip {
  id: string;
  plan: TripPlan;
  location: string;
  days: number;
  interests: string[];
  savedAt: string;
}

export default function TripPlannerPage() {
  const { latitude, longitude } = useGeolocation();
  const { toast } = useToast();

  const [location, setLocation] = useState("");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("explorer_saved_trips");
    if (stored) setSavedTrips(JSON.parse(stored));
  }, []);

  const toggleInterest = (id: string) => {
    setInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const detectLocation = () => {
    if (latitude && longitude) {
      setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Detected)`);
      toast({ title: "Location detected!", description: "GPS coordinates applied." });
    }
  };

  const generatePlan = async () => {
    if (!location.trim()) {
      toast({ title: "Enter a location", description: "Please enter a location or use GPS.", variant: "destructive" });
      return;
    }
    if (interests.length === 0) {
      toast({ title: "Select interests", description: "Pick at least one interest.", variant: "destructive" });
      return;
    }

    setLoading(true);
    setPlan(null);
    setSaved(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-trip", {
        body: {
          location: location.replace(/ \(Detected\)$/, ""),
          days: parseInt(days),
          budget: budget || undefined,
          interests,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPlan(data.plan);
      toast({ title: "Trip plan ready! 🎉", description: `Your ${days}-day plan is generated.` });
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Unable to generate plan",
        description: e.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = () => {
    if (!plan) return;
    const trip: SavedTrip = {
      id: Date.now().toString(),
      plan,
      location,
      days: parseInt(days),
      interests,
      savedAt: new Date().toISOString(),
    };
    const updated = [...savedTrips, trip];
    setSavedTrips(updated);
    localStorage.setItem("explorer_saved_trips", JSON.stringify(updated));
    setSaved(true);
    toast({ title: "Trip saved! ✅", description: "You can view it in Saved Trips." });
  };

  const deleteTrip = (id: string) => {
    const updated = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(updated);
    localStorage.setItem("explorer_saved_trips", JSON.stringify(updated));
    toast({ title: "Trip deleted" });
  };

  const loadTrip = (trip: SavedTrip) => {
    setPlan(trip.plan);
    setLocation(trip.location);
    setDays(trip.days.toString());
    setInterests(trip.interests);
    setShowSaved(false);
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/10" />
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              <Sparkles className="w-4 h-4" /> AI-Powered Trip Planning
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
              Plan My Trip
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Get a personalized Karnataka travel itinerary powered by AI
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container pb-16 space-y-8">
        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-2 border-primary/10">
            <CardContent className="p-6 space-y-6">
              {/* Location */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Location
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g. Bangalore, Mysore, Coorg..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" onClick={detectLocation} className="whitespace-nowrap">
                    <MapPin className="w-4 h-4 mr-1" /> Use GPS
                  </Button>
                </div>
              </div>

              {/* Days & Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Number of Days
                  </Label>
                  <Select value={days} onValueChange={setDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <SelectItem key={d} value={d.toString()}>
                          {d} {d === 1 ? "Day" : "Days"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" /> Budget (₹, optional)
                  </Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all ${
                        interests.includes(opt.id)
                          ? `${opt.color} border-current shadow-sm scale-105`
                          : "bg-muted text-muted-foreground border-transparent hover:border-border"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate */}
              <Button
                onClick={generatePlan}
                disabled={loading}
                className="w-full h-12 text-base font-bold rounded-xl"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Generating your plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" /> Generate Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Saved Trips Toggle */}
        {savedTrips.length > 0 && (
          <div>
            <button
              onClick={() => setShowSaved(!showSaved)}
              className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <Save className="w-4 h-4" /> Saved Trips ({savedTrips.length})
              <ChevronDown className={`w-4 h-4 transition-transform ${showSaved ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showSaved && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-3 space-y-2"
                >
                  {savedTrips.map((trip) => (
                    <Card key={trip.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div onClick={() => loadTrip(trip)} className="flex-1">
                          <p className="font-semibold text-foreground">{trip.plan.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {trip.location} • {trip.days} days • {new Date(trip.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button onClick={() => deleteTrip(trip.id)} className="p-2 text-muted-foreground hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-16 gap-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
              <p className="text-muted-foreground font-medium">Crafting your perfect itinerary...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {plan && !loading && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">{plan.title}</h2>
                  <p className="text-muted-foreground mt-1">{plan.overview}</p>
                </div>
                <Button
                  onClick={saveTrip}
                  disabled={saved}
                  variant={saved ? "secondary" : "default"}
                  className="rounded-xl"
                >
                  {saved ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" /> Saved
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" /> Save Trip
                    </>
                  )}
                </Button>
              </div>

              {/* Days */}
              {plan.days.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                          {day.day}
                        </div>
                        <CardTitle className="text-lg">{day.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {day.places.map((place, j) => (
                        <div key={j} className="flex gap-3">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                          <div>
                            <p className="font-semibold text-foreground">{place.name}</p>
                            <p className="text-sm text-muted-foreground">{place.description}</p>
                            {place.tip && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                💡 {place.tip}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                      {day.travelTip && (
                        <div className="mt-3 p-3 rounded-lg bg-accent/50 text-accent-foreground text-sm">
                          🗺️ <strong>Tip:</strong> {day.travelTip}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

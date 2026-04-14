import { Place, categoryConfig } from "@/data/places";
import { X, Star, MapPin, Navigation, Leaf, ExternalLink, Clock, Ticket, Utensils, History, Lightbulb, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGooglePlacePhoto } from "@/hooks/useGooglePlacePhoto";
import { getGoogleMapsDirectionsUrl } from "@/lib/googleMaps";

interface PlaceDetailProps {
  place: Place | null;
  onClose: () => void;
}

export default function PlaceDetail({ place, onClose }: PlaceDetailProps) {
  if (!place) return null;
  const cat = categoryConfig[place.category];
  const photoUrl = useGooglePlacePhoto(place.name, place.image, place.lat, place.lng);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl"
        >
          {/* Hero Image */}
          <div className="relative h-64 sm:h-72">
            <img src={photoUrl} alt={place.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"; }} />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-card/90 backdrop-blur-sm flex items-center justify-center hover:scale-105 transition-transform"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-2 mb-2.5 flex-wrap">
                {place.isEcoFriendly && (
                  <span className="eco-badge"><Leaf className="w-3 h-3" /> Sustainable</span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-card/90 text-card-foreground backdrop-blur-sm">
                  <cat.icon className="w-3 h-3" /> {cat.label}
                </span>
                {place.entryFee && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-card/90 text-card-foreground backdrop-blur-sm">
                    <Ticket className="w-3 h-3" /> {place.entryFee}
                  </span>
                )}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary-foreground">{place.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-primary-foreground text-sm font-semibold">{place.rating} rating</span>
                {place.distance !== undefined && (
                  <>
                    <span className="text-primary-foreground/40">·</span>
                    <MapPin className="w-3 h-3 text-primary-foreground/80" />
                    <span className="text-primary-foreground text-sm">{place.distance.toFixed(1)}km away</span>
                  </>
                )}
                {place.bestTime && (
                  <>
                    <span className="text-primary-foreground/40">·</span>
                    <Clock className="w-3 h-3 text-primary-foreground/80" />
                    <span className="text-primary-foreground text-sm">{place.bestTime.split(';')[0]}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* About */}
            <Section icon={<Sparkles className="w-4 h-4 text-primary" />} title="About">
              <p className="text-muted-foreground text-sm leading-relaxed">{place.description}</p>
            </Section>

            {/* Why Famous */}
            <Section icon={<Star className="w-4 h-4 text-warning" />} title="Why Famous">
              <p className="text-muted-foreground text-sm leading-relaxed">{place.whyFamous}</p>
            </Section>

            {/* History */}
            {place.history && (
              <Section icon={<History className="w-4 h-4 text-secondary" />} title="History">
                <p className="text-muted-foreground text-sm leading-relaxed">{place.history}</p>
              </Section>
            )}

            {/* Cultural Insight */}
            {place.culturalInsight && (
              <div className="bg-accent/60 rounded-2xl p-5 border border-accent-foreground/10">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent-foreground" />
                  <h3 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">Cultural Insight</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{place.culturalInsight}</p>
              </div>
            )}

            {/* Things to Try */}
            <Section icon={<Sparkles className="w-4 h-4 text-primary" />} title="Things to Try">
              <div className="flex flex-wrap gap-2">
                {place.thingsToTry.map((thing) => (
                  <span key={thing} className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold">
                    {thing}
                  </span>
                ))}
              </div>
            </Section>

            {/* Food Nearby */}
            {place.foodNearby && place.foodNearby.length > 0 && (
              <Section icon={<Utensils className="w-4 h-4 text-secondary" />} title="Food Nearby">
                <div className="space-y-2">
                  {place.foodNearby.map((food) => (
                    <div key={food} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                      {food}
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Best Time & Entry Info */}
            {(place.bestTime || place.entryFee) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.bestTime && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Best Time</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{place.bestTime}</p>
                  </div>
                )}
                {place.entryFee && (
                  <div className="bg-muted/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Ticket className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">Entry Fee</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{place.entryFee}</p>
                  </div>
                )}
              </div>
            )}

            {/* Directions Button */}
            <button
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank', 'noopener,noreferrer')}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              <Navigation className="w-4 h-4" /> Get Directions
              <ExternalLink className="w-3 h-3 ml-1 opacity-60" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-display font-bold text-foreground text-sm uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </div>
  );
}

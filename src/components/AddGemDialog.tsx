import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Crosshair, Upload, X } from "lucide-react";
import { GEM_CATEGORY_META, GemCategory, submitGem } from "@/lib/userGems";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

// Compress/resize an image file in the browser so uploads of any size succeed.
async function compressImage(file: File, maxDim = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(file);
    });
    const img: HTMLImageElement = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = dataUrl;
    });
    let { width, height } = img;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    width = Math.round(width * scale);
    height = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, width, height);
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", quality)
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

interface AddGemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultLat?: number | null;
  defaultLng?: number | null;
  onSubmitted?: () => void;
}

export default function AddGemDialog({
  open,
  onOpenChange,
  defaultLat,
  defaultLng,
  onSubmitted,
}: AddGemDialogProps) {
  const { user } = useApp();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GemCategory>("hidden_gem");
  const [lat, setLat] = useState<number | null>(defaultLat ?? null);
  const [lng, setLng] = useState<number | null>(defaultLng ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleUseCurrent = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported on this device");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocating(false);
        toast.success("Pinned to your current location");
      },
      () => {
        setLocating(false);
        toast.error("Could not get current location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    // Hard upper bound to avoid memory issues on very huge files (50MB)
    if (f.size > 50 * 1024 * 1024) {
      toast.error("That photo is too large. Please pick one under 50MB.");
      return;
    }
    const compressed = await compressImage(f);
    setImageFile(compressed);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(compressed));
  };

  const reset = () => {
    setName("");
    setDescription("");
    setCategory("hidden_gem");
    setLat(defaultLat ?? null);
    setLng(defaultLng ?? null);
    setImageFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("Please sign in to add a hidden gem");
    if (name.trim().length < 2) return toast.error("Please add a name (min 2 chars)");
    if (description.trim().length < 10) return toast.error("Description must be at least 10 characters");
    if (lat === null || lng === null) return toast.error("Please pin a location");

    setSubmitting(true);
    const res = await submitGem({
      name,
      description,
      category,
      latitude: lat,
      longitude: lng,
      imageFile,
      submitterName: user?.name ?? null,
      userId: user.id,
    });
    setSubmitting(false);

    if (res.ok) {
      toast.success("Your gem is under review 👀", {
        description: "We'll publish it after a quick moderation check.",
      });
      reset();
      onOpenChange(false);
      onSubmitted?.();
    } else {
      toast.error((res as { ok: false; error: string }).error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            Add a Hidden Gem 👀
          </DialogTitle>
          <DialogDescription>
            Share a place locals love. Submissions appear after a quick review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="gem-name">Name *</Label>
            <Input
              id="gem-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunset Rocks at Anjanadri"
              maxLength={120}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gem-desc">Description *</Label>
            <Textarea
              id="gem-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="2–3 lines: what's special, what to do, best time to visit"
              rows={3}
              maxLength={600}
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/600
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as GemCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(GEM_CATEGORY_META) as GemCategory[]).map((k) => (
                  <SelectItem key={k} value={k}>
                    {GEM_CATEGORY_META[k].emoji} {GEM_CATEGORY_META[k].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Location *</Label>
            <Button
              type="button"
              variant="outline"
              onClick={handleUseCurrent}
              disabled={locating}
              className="w-full justify-start"
            >
              {locating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4 mr-2" />
              )}
              Use my current location
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                step="any"
                value={lat ?? ""}
                onChange={(e) => setLat(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Latitude"
              />
              <Input
                type="number"
                step="any"
                value={lng ?? ""}
                onChange={(e) => setLng(e.target.value ? parseFloat(e.target.value) : null)}
                placeholder="Longitude"
              />
            </div>
            {lat !== null && lng !== null && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {lat.toFixed(4)}, {lng.toFixed(4)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="gem-img">Photo (optional)</Label>
            {previewUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/90 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors text-sm text-muted-foreground">
                <Upload className="w-4 h-4" />
                Tap to upload (max 5MB)
                <input
                  id="gem-img"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…
              </>
            ) : (
              "Submit Gem"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
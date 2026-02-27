import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLibrary } from "@/hooks/useLibraries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";

async function compressImage(file: File, maxWidth = 800, quality = 0.7): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
        "image/webp",
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

export default function LibraryEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: existing, isLoading: loadingExisting } = useLibrary(isNew ? "" : id!);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pricingStr, setPricingStr] = useState('{"monthly": 1500, "daily": 100}');
  const [shiftsStr, setShiftsStr] = useState('["Morning 6AM-12PM", "Afternoon 12PM-6PM", "Evening 6PM-12AM"]');
  const [amenitiesStr, setAmenitiesStr] = useState("WiFi, AC, Power Backup");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setAddress(existing.address);
      setCity(existing.city ?? "");
      setShiftsStr(JSON.stringify(existing.shifts, null, 2));
      setAmenitiesStr((existing.amenities ?? []).join(", "));
      setGoogleMapsUrl(existing.google_maps_url ?? "");
      setSortOrder(existing.sort_order);
      setIsActive(existing.is_active);
      setPhotos(existing.photos ?? []);
      setWhatsappNumber((existing as any).whatsapp_number ?? "");
      setShortCode((existing as any).short_code ?? "");
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      let pricing, shifts;
      try { pricing = JSON.parse(pricingStr); } catch { throw new Error("Invalid pricing JSON"); }
      try { shifts = JSON.parse(shiftsStr); } catch { throw new Error("Invalid shifts JSON"); }
      const amenities = amenitiesStr.split(",").map((s) => s.trim()).filter(Boolean);

      const data: any = {
        name, address, city: city || null, pricing, shifts, amenities,
        google_maps_url: googleMapsUrl || null,
        sort_order: sortOrder, is_active: isActive, photos,
        whatsapp_number: whatsappNumber,
        short_code: shortCode,
        updated_at: new Date().toISOString(),
      };

      if (isNew) {
        const { error } = await supabase.from("libraries").insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("libraries").update(data).eq("id", id!);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-libraries"] });
      queryClient.invalidateQueries({ queryKey: ["libraries"] });
      toast.success(isNew ? "Library created!" : "Library updated!");
      navigate("/admin/dashboard");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    const newPhotos = [...photos];
    const progress: Record<string, number> = {};

    // Upload all files concurrently
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileId = file.name + Date.now();
      progress[fileId] = 0;
      setUploadProgress({ ...progress });

      try {
        // Always compress to webp for speed
        const uploadFile = await compressImage(file);
        progress[fileId] = 50;
        setUploadProgress({ ...progress });

        const ext = "webp";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("library-photos")
          .upload(path, uploadFile, { contentType: "image/webp", upsert: false });

        if (error) {
          toast.error(`Upload failed: ${error.message}`);
          return null;
        }

        progress[fileId] = 100;
        setUploadProgress({ ...progress });

        const { data } = supabase.storage.from("library-photos").getPublicUrl(path);
        return data.publicUrl;
      } catch {
        toast.error(`Failed to process ${file.name}`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const validUrls = results.filter(Boolean) as string[];
    const finalPhotos = [...newPhotos, ...validUrls];
    setPhotos(finalPhotos);
    setUploading(false);
    setUploadProgress({});
    if (validUrls.length) toast.success(`${validUrls.length} photo(s) uploaded!`);
    e.target.value = "";
  }, [photos]);

  const removePhoto = (index: number) => setPhotos((p) => p.filter((_, i) => i !== index));

  if (!isNew && loadingExisting) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const uploadingCount = Object.keys(uploadProgress).length;

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-foreground">
        {isNew ? "Add Library" : "Edit Library"}
      </h1>

      <form
        onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }}
        className="mt-6 space-y-5"
      >
        <div>
          <Label>Name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label>Address *</Label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1" />
        </div>

        <div>
          <Label>City / Location</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1" placeholder="e.g. Mumbai, Delhi, Bangalore" />
        </div>

        <div>
          <Label>Pricing (JSON)</Label>
          <Textarea value={pricingStr} onChange={(e) => setPricingStr(e.target.value)} rows={3} className="mt-1 font-mono text-sm" />
        </div>

        <div>
          <Label>Shifts (JSON array)</Label>
          <Textarea value={shiftsStr} onChange={(e) => setShiftsStr(e.target.value)} rows={3} className="mt-1 font-mono text-sm" />
        </div>

        <div>
          <Label>Amenities (comma-separated)</Label>
          <Input value={amenitiesStr} onChange={(e) => setAmenitiesStr(e.target.value)} className="mt-1" placeholder="WiFi, AC, Parking" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>WhatsApp Number *</Label>
            <Input value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className="mt-1" placeholder="91xxxxxxxxxx" />
          </div>
          <div>
            <Label>Short Code *</Label>
            <Input value={shortCode} onChange={(e) => setShortCode(e.target.value.toUpperCase())} className="mt-1" placeholder="JP01" maxLength={6} />
          </div>
        </div>

        <div>
          <Label>Google Maps URL</Label>
          <Input value={googleMapsUrl} onChange={(e) => setGoogleMapsUrl(e.target.value)} className="mt-1" placeholder="https://maps.google.com/..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Sort Order</Label>
            <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className="mt-1" />
          </div>
          <div className="flex items-end gap-3 pb-1">
            <Label>Active</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        {/* Photos */}
        <div>
          <Label>Photos</Label>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {photos.map((url, i) => (
              <div key={i} className="relative aspect-video overflow-hidden rounded-lg border animate-fade-in-fast">
                <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground transition-gpu hover:scale-110"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-input transition-gpu hover:border-primary hover:bg-primary/5">
              <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              {uploading ? (
                <div className="flex flex-col items-center gap-1">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">{uploadingCount} file(s)…</span>
                </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Upload</span>
                </>
              )}
            </label>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Images auto-compressed to WebP for fast loading.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saveMutation.isPending}>
            {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? "Create Library" : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/dashboard")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

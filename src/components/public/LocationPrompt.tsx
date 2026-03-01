import { MapPin, Navigation, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LocationPromptProps {
  open: boolean;
  loading: boolean;
  onAllow: () => void;
  onSkip: () => void;
}

export default function LocationPrompt({ open, loading, onAllow, onSkip }: LocationPromptProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onSkip()}>
      <DialogContent className="max-w-sm rounded-2xl border-none bg-card p-0 shadow-xl sm:rounded-2xl">
        {/* Header illustration */}
        <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-2 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Find libraries near you
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Allow StudyUra to access your location so we can show libraries in your city.
          </DialogDescription>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 px-6 pb-6 pt-4">
          <button
            onClick={onAllow}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Detecting...
              </span>
            ) : (
              <>
                <Navigation className="h-4 w-4" />
                Allow Location
              </>
            )}
          </button>
          <button
            onClick={onSkip}
            disabled={loading}
            className="rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            Skip for now
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

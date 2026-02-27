

## Plan: Fix Upload Speed and Add "List My Library" Nav Link

### 1. Fix Slow Image Upload

The upload is slow because the image compression runs on a canvas and the upload goes to storage — both are fine, but the **compression quality and resolution can be reduced further** for faster processing. Also, the upload currently lacks a proper loading indicator with percentage feedback.

**Changes to `src/pages/admin/LibraryEdit.tsx`:**
- Reduce `maxWidth` from 800 to 600 and `quality` from 0.7 to 0.5 for much faster compression and smaller file sizes
- Show a visible progress bar during upload instead of just a spinner
- Add immediate visual feedback: show a local preview thumbnail instantly while upload happens in background

### 2. Add "List My Library" Link in Header

Add a new nav item in the public header that links to WhatsApp with a pre-filled message.

**Changes to `src/components/public/Header.tsx`:**
- Add a "List My Library" link that opens `https://wa.me/918960031211?text=I%20need%20to%20list%20my%20library`
- Place it in the nav bar alongside existing links
- Use the `MessageCircle` icon from lucide-react for visual clarity
- Style it consistently with existing nav items

### Technical Details

**File: `src/pages/admin/LibraryEdit.tsx`**
- Update `compressImage` parameters: `maxWidth=600`, `quality=0.5`
- Show local blob preview immediately on file select (before upload completes)
- This cuts compression time ~40% and upload size ~50%

**File: `src/components/public/Header.tsx`**
- Add `<a>` tag with `target="_blank"` pointing to WhatsApp URL
- Message: "I need to list my library"
- WhatsApp number: 918960031211


import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Copy, Search, IndianRupee, Eye, Download, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import type { Library } from "@/lib/types";

type Booking = {
  id: string;
  booking_id: string | null;
  library_name: string;
  library_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  preferred_shift: string;
  preferred_date: string;
  amount: number | null;
  plan: string | null;
  status: string;
  payment_id: string | null;
  order_id: string | null;
  created_at: string;
  paid_at: string | null;
};

const STATUS_COLORS: Record<string, string> = {
  PAID: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  PENDING_PAYMENT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function LibraryBookings() {
  const [selectedLibrary, setSelectedLibrary] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: libraries } = useQuery<Library[]>({
    queryKey: ["admin-libraries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("libraries").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["admin-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Booking[];
    },
  });

  const filtered = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      if (selectedLibrary !== "all" && b.library_id !== selectedLibrary && b.library_name !== selectedLibrary) return false;
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !b.booking_id?.toLowerCase().includes(q) &&
          !b.customer_name.toLowerCase().includes(q) &&
          !b.customer_phone?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [bookings, selectedLibrary, statusFilter, searchQuery]);

  const copyWhatsAppMsg = (b: Booking) => {
    const msg = `Booking ID: ${b.booking_id || "N/A"}\nLibrary: ${b.library_name}\nDate: ${b.preferred_date}\nShift: ${b.preferred_shift}\nName: ${b.customer_name}\nPhone: ${b.customer_phone || "N/A"}\nAmount: ₹${b.amount || 0}\nPayment ID: ${b.payment_id || "N/A"}`;
    navigator.clipboard.writeText(msg);
    toast.success("WhatsApp message copied!");
  };

  const exportCSV = () => {
    if (!filtered.length) return;
    const headers = ["Booking ID", "Library", "Customer", "Phone", "Shift", "Date", "Amount", "Plan", "Status", "Payment ID", "Created At"];
    const rows = filtered.map((b) => [
      b.booking_id || "", b.library_name, b.customer_name, b.customer_phone || "",
      b.preferred_shift, b.preferred_date, String(b.amount || 0), b.plan || "",
      b.status, b.payment_id || "", b.created_at,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "bookings.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Library Bookings</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} bookings</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <Select value={selectedLibrary} onValueChange={setSelectedLibrary}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="All Libraries" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Libraries</SelectItem>
            {libraries?.map((l) => (
              <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PAID">Paid</SelectItem>
            <SelectItem value="PENDING_PAYMENT">Pending Payment</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Booking ID, name, or phone…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-lg border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Booking ID</TableHead>
              <TableHead>Library</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">Loading…</TableCell>
              </TableRow>
            ) : !filtered.length ? (
              <TableRow>
                <TableCell colSpan={10} className="py-8 text-center text-muted-foreground">No bookings found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs font-medium">{b.booking_id || "—"}</TableCell>
                  <TableCell className="max-w-[140px] truncate">{b.library_name}</TableCell>
                  <TableCell>{b.customer_name}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{b.customer_email || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{b.customer_phone || "—"}</TableCell>
                  <TableCell>{b.preferred_shift}</TableCell>
                  <TableCell>{b.preferred_date}</TableCell>
                  <TableCell>
                    {b.amount ? (
                      <span className="flex items-center gap-0.5"><IndianRupee className="h-3 w-3" />{b.amount}</span>
                    ) : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_COLORS[b.status] || ""}>
                      {b.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setSelectedBooking(b)} title="View details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => copyWhatsAppMsg(b)} title="Copy WhatsApp message">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
          </SheetHeader>
          {selectedBooking && (
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["Booking ID", selectedBooking.booking_id || "—"],
                ["Status", selectedBooking.status],
                ["Library", selectedBooking.library_name],
                ["Customer", selectedBooking.customer_name],
                ["Email", selectedBooking.customer_email || "—"],
                ["Phone", selectedBooking.customer_phone || "—"],
                ["Shift", selectedBooking.preferred_shift],
                ["Date", selectedBooking.preferred_date],
                ["Plan", selectedBooking.plan || "—"],
                ["Amount", selectedBooking.amount ? `₹${selectedBooking.amount}` : "—"],
                ["Payment ID", selectedBooking.payment_id || "—"],
                ["Order ID", selectedBooking.order_id || "—"],
                ["Created", new Date(selectedBooking.created_at).toLocaleString("en-IN")],
                ["Paid At", selectedBooking.paid_at ? new Date(selectedBooking.paid_at).toLocaleString("en-IN") : "—"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground text-right max-w-[200px] break-all">{value}</span>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2 mt-4" onClick={() => copyWhatsAppMsg(selectedBooking)}>
                <MessageCircle className="h-4 w-4" /> Copy WhatsApp Message
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

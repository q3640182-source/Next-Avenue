"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { 
  AlertCircle, RefreshCw, Phone, Mail, MapPin, 
  Building, Wallet, Calendar, User, Tag, Map, MessageSquare, ClipboardList, CheckCircle2, Trash2
} from "lucide-react";
import { updateSubmissionStatus, retrySheetSync, deleteSubmission } from "@/app/actions/submissions";
import { toast } from "sonner";
import { type sellSubmissions } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { AlertModal } from "@/components/admin/alert-modal";

type Submission = InferSelectModel<typeof sellSubmissions>;

export function SubmissionsTable({ data }: { data: Submission[] }) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectedSubmission, setSelectedSubmission] = React.useState<Submission | null>(null);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [syncingIds, setSyncingIds] = React.useState<Set<number>>(new Set());
  const [statusUpdating, setStatusUpdating] = React.useState<Set<number>>(new Set());
  
  // Delete Modal States
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!selectedSubmission) return;
    setIsDeleting(true);
    const res = await deleteSubmission(selectedSubmission.id);
    setIsDeleting(false);
    if (res.success) {
      toast.success("Submission deleted successfully");
      setDeleteOpen(false);
      setIsSheetOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    setStatusUpdating(prev => new Set(prev).add(id));
    const res = await updateSubmissionStatus(id, newStatus as any);
    if (res.success) {
      toast.success("Status updated");
      router.refresh();
    } else {
      toast.error("Failed to update status");
    }
    setStatusUpdating(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleRetrySync = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSyncingIds(prev => new Set(prev).add(id));
    const res = await retrySheetSync(id);
    if (res.success) {
      toast.success("Successfully synced to Sheets");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to sync");
    }
    setSyncingIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const columns: ColumnDef<Submission>[] = [
    {
      accessorKey: "ownerName",
      header: "Owner Name",
      cell: ({ row }) => <div className="font-medium whitespace-nowrap">{row.getValue("ownerName")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "propertyType",
      header: "Property Type",
      cell: ({ row }) => <span className="capitalize">{row.getValue("propertyType")}</span>,
    },
    {
      accessorKey: "sector",
      header: "Sector",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const val = row.getValue("price") as number | null;
        return <div className="font-mono">{val ? `PKR ${val.toLocaleString()}` : "-"}</div>;
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => format(new Date(row.getValue("createdAt")), "MMM d, yyyy"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const id = row.original.id;
        const status = row.original.status;
        const isUpdating = statusUpdating.has(id);
        
        return (
          <div onClick={(e) => e.stopPropagation()}>
            <Select 
              value={status} 
              onValueChange={(val) => handleStatusChange(id, val)}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="listed">Listed</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
    {
      id: "sync",
      header: "Sync",
      cell: ({ row }) => {
        const { id, sheetSynced } = row.original;
        const isSyncing = syncingIds.has(id);
        
        if (sheetSynced) {
          return (
            <div className="flex items-center text-green-600 text-xs font-medium bg-green-50 w-fit px-2 py-1 rounded-md border border-green-200">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Synced
            </div>
          );
        }
        
        return (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => handleRetrySync(id, e)}
            disabled={isSyncing}
          >
            {isSyncing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <AlertCircle className="h-4 w-4 mr-1" />}
            {isSyncing ? "" : "Retry"}
          </Button>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedSubmission(row.original);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    }
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by owner name..."
          value={(table.getColumn("ownerName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("ownerName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setSelectedSubmission(row.original);
                    setIsSheetOpen(true);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">No results.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="md:hidden grid gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const data = row.original;
            const isSyncing = syncingIds.has(data.id);
            const isUpdatingStatus = statusUpdating.has(data.id);
            
            return (
              <Card 
                key={row.id} 
                className="cursor-pointer active:bg-muted/50 transition-colors"
                onClick={() => {
                  setSelectedSubmission(data);
                  setIsSheetOpen(true);
                }}
              >
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-lg">{data.ownerName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Phone className="h-3 w-3" /> {data.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!data.sheetSynced ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-7 text-xs text-destructive border-destructive/30"
                          onClick={(e) => handleRetrySync(data.id, e)}
                          disabled={isSyncing}
                        >
                          {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                          Retry
                        </Button>
                      ) : (
                        <div className="flex items-center text-green-600 text-xs font-medium h-7 px-2 bg-green-50 rounded-md border border-green-200">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Synced
                        </div>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-7 w-7 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSubmission(data);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                    <div>
                      <span className="text-muted-foreground">Type:</span> <span className="capitalize">{data.propertyType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sector:</span> {data.sector || "-"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Price:</span> {data.price ? `PKR ${data.price.toLocaleString()}` : "-"}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span> {format(new Date(data.createdAt), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t mt-2" onClick={(e) => e.stopPropagation()}>
                    <Select 
                      value={data.status} 
                      onValueChange={(val) => handleStatusChange(data.id, val)}
                      disabled={isUpdatingStatus}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="listed">Listed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-10 text-muted-foreground border rounded-md">No results.</div>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
      </div>

      {/* Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[500px] overflow-y-auto p-0 flex flex-col bg-slate-50">
          
          {/* Header Region */}
          <div className="bg-white border-b px-6 py-6 shadow-sm z-10 sticky top-0">
            <SheetHeader className="text-left space-y-1">
              <div className="flex items-start justify-between gap-4">
                <SheetTitle className="text-2xl font-black tracking-tight text-slate-900">
                  Property Submission
                </SheetTitle>
                {selectedSubmission && (
                  <Badge 
                    variant={selectedSubmission.status === "listed" ? "default" : selectedSubmission.status === "closed" ? "secondary" : "outline"}
                    className="capitalize shrink-0 shadow-sm"
                  >
                    {selectedSubmission.status}
                  </Badge>
                )}
              </div>
              <SheetDescription className="text-sm font-medium flex items-center gap-1.5 text-slate-500">
                <Calendar className="size-4" />
                {selectedSubmission && format(new Date(selectedSubmission.createdAt), "PPP 'at' p")}
              </SheetDescription>
            </SheetHeader>
          </div>
          
          {selectedSubmission && (
            <div className="p-6 space-y-6 flex-1">
              
              {/* Contact Information Card */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 flex items-center gap-2 border-b border-slate-800">
                  <User className="size-4 text-slate-300" />
                  <h3 className="font-semibold text-white text-sm">Client Information</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-lg shrink-0">
                      {selectedSubmission.ownerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{selectedSubmission.ownerName}</div>
                      <div className="text-xs font-medium text-slate-500">Property Owner</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t">
                    <a href={`tel:${selectedSubmission.phone}`} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group">
                      <div className="bg-blue-50 text-blue-600 p-1.5 rounded-md group-hover:bg-blue-100 transition-colors">
                        <Phone className="size-3.5" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{selectedSubmission.phone}</span>
                    </a>
                    
                    {selectedSubmission.email && (
                      <a href={`mailto:${selectedSubmission.email}`} className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors group truncate">
                        <div className="bg-amber-50 text-amber-600 p-1.5 rounded-md group-hover:bg-amber-100 transition-colors">
                          <Mail className="size-3.5" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 truncate">{selectedSubmission.email}</span>
                      </a>
                    )}
                  </div>

                  {selectedSubmission.address && (
                    <div className="flex items-start gap-2 p-2 rounded-md bg-slate-50 border border-slate-100">
                      <MapPin className="size-4 text-slate-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-slate-700 leading-relaxed">{selectedSubmission.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Property Details Card */}
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b flex items-center gap-2">
                  <Building className="size-4 text-slate-500" />
                  <h3 className="font-semibold text-slate-800 text-sm">Property Details</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <Tag className="size-3.5" /> Property Type
                    </div>
                    <div className="font-medium text-slate-900 capitalize px-1">{selectedSubmission.propertyType}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      <Map className="size-3.5" /> Sector
                    </div>
                    <div className="font-medium text-slate-900 px-1">{selectedSubmission.sector || "Not specified"}</div>
                  </div>
                  <div className="col-span-2 bg-green-50/50 p-3 rounded-lg border border-green-100/50">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider mb-1">
                      <Wallet className="size-3.5" /> Asking Price
                    </div>
                    <div className="font-bold text-lg text-slate-900 font-mono">
                      {selectedSubmission.price ? `PKR ${selectedSubmission.price.toLocaleString()}` : "Price on request"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptions & Remarks */}
              {(selectedSubmission.description || selectedSubmission.remarks) && (
                <div className="space-y-4">
                  {selectedSubmission.description && (
                    <div className="bg-white rounded-xl border shadow-sm p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        <MessageSquare className="size-4" /> Description
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedSubmission.description}
                      </div>
                    </div>
                  )}

                  {selectedSubmission.remarks && (
                    <div className="bg-white rounded-xl border shadow-sm p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        <ClipboardList className="size-4" /> Internal Remarks
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-yellow-50 p-3 rounded-md border border-yellow-100">
                        {selectedSubmission.remarks}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex flex-col gap-3 mt-auto">
                {/* Status Updater */}
                <div className="bg-white rounded-xl border shadow-sm p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="size-4 text-brand-accent" /> Update Status
                    </div>
                    <Select 
                      value={selectedSubmission.status} 
                      onValueChange={(val) => handleStatusChange(selectedSubmission.id, val)}
                      disabled={statusUpdating.has(selectedSubmission.id)}
                    >
                      <SelectTrigger className="w-[140px] font-medium">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="listed">Listed</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Delete Button */}
                <Button 
                  variant="destructive" 
                  className="w-full h-11 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 shadow-none font-bold"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="size-4 mr-2" /> Delete Submission
                </Button>
              </div>

            </div>
          )}
        </SheetContent>
      </Sheet>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Submission"
        description="Are you sure you want to delete this property submission? This action cannot be undone."
        variant="danger"
        confirmText="Delete Submission"
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Plus, Trash2, Building, ChevronRight, Hash } from "lucide-react";
import { 
  addSector, 
  deleteSector, 
  addSubSector, 
  deleteSubSector 
} from "@/app/actions/locations";
import { AlertModal } from "@/components/admin/alert-modal";

type SubSector = { id: number; name: string; sectorId: number };
type Sector = { id: number; name: string; hasSubSectors: boolean; subSectors: SubSector[] };

export function LocationManager({ initialData }: { initialData: Sector[] }) {
  const [sectors, setSectors] = useState<Sector[]>(initialData);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  
  const [newSectorName, setNewSectorName] = useState("");
  const [hasSubSectors, setHasSubSectors] = useState(true);
  const [isAddingSector, setIsAddingSector] = useState(false);

  const [newSubSectorName, setNewSubSectorName] = useState("");
  const [isAddingSubSector, setIsAddingSubSector] = useState(false);

  // Handle Sector Auto-Gen Smart Toggle
  const handleSectorNameChange = (val: string) => {
    setNewSectorName(val);
    const lower = val.toLowerCase();
    if (lower.includes("bahria") || lower.includes("dha")) {
      setHasSubSectors(false);
    } else {
      setHasSubSectors(true);
    }
  };

  const handleAddSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectorName.trim()) return;
    setIsAddingSector(true);
    const res = await addSector(newSectorName, hasSubSectors);
    if (res.success) {
      toast.success("Sector added successfully");
      setNewSectorName("");
      // Force refresh for simplicity, or we could update state locally
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to add sector");
    }
    setIsAddingSector(false);
  };

  const [deleteSectorId, setDeleteSectorId] = useState<number | null>(null);
  const [deleteSubSectorId, setDeleteSubSectorId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeleteSector = async () => {
    if (!deleteSectorId) return;
    setIsDeleting(true);
    const res = await deleteSector(deleteSectorId);
    if (res.success) {
      toast.success("Sector deleted");
      setSectors(sectors.filter(s => s.id !== deleteSectorId));
      if (selectedSector?.id === deleteSectorId) setSelectedSector(null);
    } else {
      toast.error(res.error || "Failed to delete sector");
    }
    setIsDeleting(false);
    setDeleteSectorId(null);
  };

  const confirmDeleteSubSector = async () => {
    if (!deleteSubSectorId) return;
    setIsDeleting(true);
    const res = await deleteSubSector(deleteSubSectorId);
    if (res.success) {
      toast.success("Sub-sector deleted");
      window.location.reload();
    } else {
      toast.error("Failed to delete sub-sector");
    }
    setIsDeleting(false);
    setDeleteSubSectorId(null);
  };

  const handleAddSubSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSector || !newSubSectorName.trim()) return;
    setIsAddingSubSector(true);
    const res = await addSubSector(selectedSector.id, newSubSectorName);
    if (res.success) {
      toast.success("Sub-sector added");
      setNewSubSectorName("");
      window.location.reload();
    } else {
      toast.error(res.error || "Failed to add sub-sector");
    }
    setIsAddingSubSector(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
      {/* Sectors Pane */}
      <div className="md:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-heading font-bold text-lg flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            Sectors & Societies
          </h2>
          <p className="text-xs text-muted-foreground mt-1">Manage main regions (e.g., F-11, DHA)</p>
        </div>
        
        <div className="p-4 border-b border-slate-100">
          <form onSubmit={handleAddSector} className="space-y-3">
            <div className="flex gap-2">
              <Input 
                value={newSectorName}
                onChange={(e) => handleSectorNameChange(e.target.value)}
                placeholder="e.g. G-13" 
                className="bg-slate-50"
              />
              <Button type="submit" disabled={isAddingSector || !newSectorName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasSubSectors" 
                checked={hasSubSectors} 
                onCheckedChange={(val) => setHasSubSectors(!!val)} 
              />
              <Label htmlFor="hasSubSectors" className="text-xs text-slate-500 font-medium leading-none cursor-pointer">
                Auto-generate /1 to /4 sub-sectors
              </Label>
            </div>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {sectors.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground text-sm">No sectors added yet.</div>
          ) : (
            <div className="space-y-1">
              {sectors.map(sector => (
                <div 
                  key={sector.id}
                  onClick={() => setSelectedSector(sector)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedSector?.id === sector.id 
                      ? "bg-primary/10 border-primary/20 border" 
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-4 h-4 ${selectedSector?.id === sector.id ? "text-primary" : "text-slate-400"}`} />
                    <span className="font-semibold text-slate-700 text-sm">{sector.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {sector.subSectors.length} subs
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 -mr-1"
                      onClick={(e) => { e.stopPropagation(); setDeleteSectorId(sector.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedSector?.id === sector.id ? "text-primary" : "text-transparent"}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sub-Sectors Pane */}
      <div className="md:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {selectedSector ? (
          <>
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <h2 className="font-heading font-bold text-lg flex items-center gap-2 text-primary">
                  {selectedSector.name} <span className="text-slate-400 font-medium">Sub-Sectors</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">Manage phases or sub-sectors for {selectedSector.name}</p>
              </div>
            </div>

            <div className="p-4 border-b border-slate-100">
              <form onSubmit={handleAddSubSector} className="flex gap-2">
                <Input 
                  value={newSubSectorName}
                  onChange={(e) => setNewSubSectorName(e.target.value)}
                  placeholder={`e.g. ${selectedSector.name}/1 or Phase 8`} 
                  className="bg-slate-50"
                />
                <Button type="submit" disabled={isAddingSubSector || !newSubSectorName.trim()}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedSector.subSectors.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No sub-sectors found for {selectedSector.name}.
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {selectedSector.subSectors.map(sub => (
                    <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-colors group">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-700 text-sm">{sub.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        onClick={() => setDeleteSubSectorId(sub.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center space-y-4 bg-slate-50/30">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="font-medium text-slate-600">No Sector Selected</p>
              <p className="text-sm mt-1">Select a sector from the left pane to manage its sub-sectors.</p>
            </div>
          </div>
        )}
      </div>
      <AlertModal
        isOpen={!!deleteSectorId}
        onClose={() => setDeleteSectorId(null)}
        onConfirm={confirmDeleteSector}
        loading={isDeleting}
        title="Delete Sector"
        description="Are you sure you want to delete this sector? All associated sub-sectors will also be permanently deleted. This action cannot be undone."
        variant="danger"
        confirmText="Delete Sector"
      />

      <AlertModal
        isOpen={!!deleteSubSectorId}
        onClose={() => setDeleteSubSectorId(null)}
        onConfirm={confirmDeleteSubSector}
        loading={isDeleting}
        title="Delete Sub-Sector"
        description="Are you sure you want to delete this sub-sector? This action cannot be undone."
        variant="danger"
        confirmText="Delete Sub-Sector"
      />
    </div>
  );
}

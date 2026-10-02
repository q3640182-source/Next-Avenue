"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { saveListing } from "@/app/actions/listings";
import { Loader2, Plus, GripVertical, Trash2 } from "lucide-react";
import { CustomImageUploader } from "@/components/shared/image-uploader";

const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2),
  slug: z.string().min(2).optional().or(z.literal("")),
  propertyType: z.string(),
  purpose: z.string().default("buy"),
  status: z.enum(["draft", "published", "sold"]),
  sector: z.string().optional(),
  subSector: z.string().optional(),
  address: z.string().optional(),
  price: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  area: z.string().optional(),
  areaUnit: z.string().optional(),
  condition: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).max(5, "Maximum 5 images allowed").default([]),
});

type FormValues = z.infer<typeof formSchema>;

import { getLocations } from "@/app/actions/locations";

type SectorData = {
  id: number;
  name: string;
  hasSubSectors: boolean;
  subSectors: { id: number; name: string }[];
};

function SortableImage({ id, src, onRemove, index }: { id: string, src: string, onRemove: () => void, index: number }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50 flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="Property" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
        <Button type="button" size="icon" variant="secondary" className="h-8 w-8 cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </Button>
        <Button type="button" size="icon" variant="destructive" className="h-8 w-8" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {index === 0 && (
        <div className="absolute top-2 left-2 bg-primary/90 backdrop-blur text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
          Cover
        </div>
      )}
    </div>
  );
}

export function ListingForm({ initialData }: { initialData?: Partial<FormValues> }) {
  const router = useRouter();
  
  const [footerNode, setFooterNode] = React.useState<HTMLElement | null>(null);
  const [locations, setLocations] = React.useState<SectorData[]>([]);

  React.useEffect(() => {
    setFooterNode(document.getElementById("admin-modal-footer"));
    getLocations().then(setLocations);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      propertyType: initialData?.propertyType || "house",
      purpose: initialData?.purpose || "buy",
      status: initialData?.status || "draft",
      sector: initialData?.sector || "",
      subSector: initialData?.subSector || "",
      address: initialData?.address || "",
      price: initialData?.price || "",
      bedrooms: initialData?.bedrooms || "",
      bathrooms: initialData?.bathrooms || "",
      area: initialData?.area || "",
      areaUnit: initialData?.areaUnit || "Sq. Ft.",
      condition: initialData?.condition || "",
      description: initialData?.description || "",
      images: initialData?.images || [],
    } as any,
  });

  const images = form.watch("images");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);
      form.setValue("images", arrayMove(images, oldIndex, newIndex));
    }
  }

  async function onSubmit(data: any) {
    try {
      const res = await saveListing(data);
      if (res.success) {
        toast.success("Listing saved successfully!");
        router.back();
        
        // Add a slight delay before refreshing so the modal can close smoothly
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        toast.error(res.error || "Failed to save listing");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  function onError(errors: any) {
    toast.error("Please check the form for errors.");
    console.log("Form validation errors:", errors);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col">
        <div className="space-y-6 pb-6">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Basic Information</h3>
              <p className="text-xs text-slate-500 mt-1">Core details of the property listing.</p>
            </div>
            
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern 10 Marla Villa in F-7" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="propertyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Property Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="upper_portion">Upper Portion</SelectItem>
                        <SelectItem value="lower_portion">Lower Portion</SelectItem>
                        <SelectItem value="shop">Shop</SelectItem>
                        <SelectItem value="plot">Plot</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Price (PKR)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g. 50000000" className="h-12 rounded-xl font-mono bg-slate-50 border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200 w-full md:w-1/2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Hidden)</SelectItem>
                      <SelectItem value="published">Published (Live)</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 2: Location Details */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Location</h3>
              <p className="text-xs text-slate-500 mt-1">Where is this property located?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Sector / Society</FormLabel>
                    <Select onValueChange={(val) => { field.onChange(val); form.setValue("subSector", ""); }} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Select Sector" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl">
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.name}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(() => {
                const selectedSectorName = form.watch("sector");
                const selectedSector = locations.find((l) => l.name === selectedSectorName);
                const availableSubSectors = selectedSector?.subSectors || [];

                if (availableSubSectors.length > 0) {
                  return (
                    <FormField
                      control={form.control as any}
                      name="subSector"
                      render={({ field }) => (
                        <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Sub-Sector / Phase</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Select Sub-Sector" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {availableSubSectors.map((sub) => (
                                <SelectItem key={sub.id} value={sub.name}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                }
                return null;
              })()}
              <FormField
                control={form.control as any}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Complete Address</FormLabel>
                    <FormControl>
                      <Input placeholder="House #, Street #, Phase" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 3: Property Specs */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Specifications</h3>
              <p className="text-xs text-slate-500 mt-1">Size, rooms, and features.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control as any}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Beds</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Baths</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Area</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="areaUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Marla">Marla</SelectItem>
                        <SelectItem value="Kanal">Kanal</SelectItem>
                        <SelectItem value="Sq. Yd.">Sq. Yd.</SelectItem>
                        <SelectItem value="Sq. Ft.">Sq. Ft.</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            



          </div>

          {/* Section 4: Details & Media */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Description & Media</h3>
            </div>
            <FormField
              control={form.control as any}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Write a detailed description of the property..." className="min-h-[150px] rounded-xl bg-slate-50 border-slate-200 resize-none p-4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Property Images ({images.length}/5)</h4>
                <p className="text-xs text-slate-500">Drag to reorder. The first image is the cover.</p>
              </div>

              {images.length < 5 && (
                <CustomImageUploader 
                  currentCount={images.length}
                  disabled={false}
                  onUpload={(url) => form.setValue("images", [...form.getValues("images"), url])}
                />
              )}

              {images.length > 0 ? (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={images} strategy={horizontalListSortingStrategy}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {images.map((src, index) => (
                        <SortableImage 
                          key={src} 
                          id={src} 
                          src={src} 
                          index={index}
                          onRemove={() => {
                            form.setValue("images", images.filter(img => img !== src));
                          }} 
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-500 bg-slate-50/50">
                  <span className="text-sm font-medium">No images uploaded yet.</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Action Footer via Portal */}
        {footerNode && createPortal(
          <div className="border-t border-slate-200 bg-white p-4 px-6 flex items-center justify-end gap-3 rounded-b-[24px]">
            <Button type="button" variant="ghost" className="rounded-full px-6 hover:bg-slate-200 font-bold" onClick={() => router.back()}>Cancel</Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit, onError)} className="rounded-full px-8 bg-[#0f3460] hover:bg-[#0f3460]/90 text-white font-bold shadow-md shadow-[#0f3460]/20" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Save Property
            </Button>
          </div>,
          footerNode
        )}
      </form>
    </Form>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { CustomImageUploader } from "@/components/shared/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { updateProfile } from "@/app/actions/profile";
import { Loader2, Camera, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  image: z.string().nullable().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function ProfileForm({ initialData }: { initialData: { name: string; email: string; image?: string | null } }) {
  const router = useRouter();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name,
      email: initialData.email,
      image: initialData.image || null,
    },
  });

  const currentImage = form.watch("image");

  async function onSubmit(data: FormValues) {
    try {
      const res = await updateProfile({
        name: data.name,
        image: data.image || null,
      });
      if (res.success) {
        toast.success("Profile updated successfully!");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <div className="bg-white rounded-[20px] border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8 w-full">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                <AvatarImage src={currentImage || ""} alt={form.getValues("name")} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold bg-slate-100 text-slate-500">
                  {form.getValues("name")?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {currentImage ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md"
                  onClick={() => form.setValue("image", null, { shouldDirty: true })}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : null}
            </div>
            
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <div>
                <h3 className="font-bold text-slate-900">Profile Photo</h3>
                <p className="text-sm text-slate-500">Update your avatar. We recommend a square image.</p>
              </div>
              <CustomImageUploader
                maxFiles={1}
                onUpload={(url) => form.setValue("image", url, { shouldDirty: true })}
              >
                  <Button 
                    type="button" 
                    variant="outline"
                    className="rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    <Camera className="mr-2 h-4 w-4 text-slate-500" />
                    Change Photo
                  </Button>
              </CustomImageUploader>
            </div>
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Full Name</FormLabel>
                  <FormControl>
                    <Input className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</FormLabel>
                  <FormControl>
                    <Input disabled className="h-12 rounded-xl bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed" {...field} />
                  </FormControl>
                  <p className="text-[11px] font-medium text-slate-400 mt-1">Email address cannot be changed.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-4 flex justify-end">
            <Button 
              type="submit" 
              className="rounded-full px-8 bg-[#0f3460] hover:bg-[#0f3460]/90 text-white font-bold shadow-md shadow-[#0f3460]/20" 
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

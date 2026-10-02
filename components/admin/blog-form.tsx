"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { saveBlogPost } from "@/app/actions/blog";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  id: z.number().optional(),
  title: z.string().min(2, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Content is required"),
  coverImage: z.string().optional(),
  author: z.string().min(2, "Author is required"),
  published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export function BlogForm({ initialData }: { initialData?: Partial<FormValues> }) {
  const router = useRouter();
  
  const [footerNode, setFooterNode] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    setFooterNode(document.getElementById("admin-modal-footer"));
  }, []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: initialData?.title || "",
      slug: initialData?.slug || "",
      excerpt: initialData?.excerpt || "",
      content: initialData?.content || "",
      author: initialData?.author || "",
      published: initialData?.published || false,
    } as any,
  });

  const content = form.watch("content");

  async function onSubmit(data: any) {
    try {
      const res = await saveBlogPost(data);
      if (res.success) {
        toast.success("Blog post saved!");
        router.back();
        
        // Add a slight delay before refreshing so the modal can close smoothly
        setTimeout(() => {
          router.refresh();
        }, 100);
      } else {
        toast.error(res.error || "Failed to save post");
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
              <p className="text-xs text-slate-500 mt-1">Core details of the blog post.</p>
            </div>
            
            <FormField
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Post Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 5 Tips for Selling Fast" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control as any}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Slug (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 5-tips-selling-fast" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Author Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sarah Khan" className="h-12 rounded-xl bg-slate-50 border-slate-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control as any}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Excerpt (Short summary)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[80px] rounded-xl bg-slate-50 border-slate-200 resize-none p-4" placeholder="Brief summary of the post..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Section 2: Content */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Post Content</h3>
              <p className="text-xs text-slate-500 mt-1">Write your article using Markdown.</p>
            </div>
            
            <Tabs defaultValue="write" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="write">Write</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="mt-0">
                <FormField
                  control={form.control as any}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea 
                          className="min-h-[400px] font-mono text-sm rounded-xl bg-slate-50 border-slate-200 p-4" 
                          placeholder="Write your markdown content here..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-0 p-6 rounded-xl border border-slate-200 min-h-[400px] bg-white">
                {content ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm italic">Nothing to preview yet.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Section 3: Publishing */}
          <div className="bg-white rounded-[20px] border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Publishing</h3>
            </div>
            
            <div className="space-y-4 max-w-sm">
              <FormLabel className="text-xs font-bold uppercase tracking-widest text-slate-500">Visibility</FormLabel>
              <FormField
                control={form.control as any}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border border-slate-200 p-4 bg-slate-50">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm font-bold text-slate-900">Publish Post</FormLabel>
                      <div className="text-xs text-slate-500">
                        Make this post visible to the public
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#0f3460]"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        
        {/* Action Footer via Portal */}
        {footerNode && createPortal(
          <div className="border-t border-slate-200 bg-white p-4 px-6 flex items-center justify-end gap-3 rounded-b-[24px]">
            <Button type="button" variant="ghost" className="rounded-full px-6 hover:bg-slate-200 font-bold" onClick={() => router.back()}>Cancel</Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit, onError)} className="rounded-full px-8 bg-[#0f3460] hover:bg-[#0f3460]/90 text-white font-bold shadow-md shadow-[#0f3460]/20" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publish Post
            </Button>
          </div>,
          footerNode
        )}
      </form>
    </Form>
  );
}

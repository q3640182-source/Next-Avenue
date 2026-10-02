"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import { AlertModal } from "@/components/admin/alert-modal";
import { deleteBlogPost } from "@/app/actions/blog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BlogActions({ id }: { id: number }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const res = await deleteBlogPost(id);
    setIsDeleting(false);
    if (res.success) {
      toast.success("Blog post deleted!");
      setDeleteOpen(false);
      router.refresh();
    } else {
      toast.error(res.error || "Failed to delete post");
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button variant="outline" size="sm" className="rounded-xl h-9 px-4 text-xs font-bold" asChild>
        <Link href={`/admin/blog/${id}/edit`}>
          <Edit2 className="h-3.5 w-3.5 mr-2" />
          Edit
        </Link>
      </Button>
      <Button variant="outline" size="sm" className="rounded-xl h-9 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => setDeleteOpen(true)}>
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Delete Blog Post"
        description="Are you sure you want to delete this article? This action cannot be undone."
        variant="danger"
        confirmText="Delete Article"
      />
    </div>
  );
}

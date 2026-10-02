import { AdminModal } from "@/components/admin/modal";
import { BlogForm } from "@/components/admin/blog-form";
import { Plus } from "lucide-react";

export default function NewBlogPage() {
  return (
    <AdminModal title="Write New Post" icon={<Plus className="h-5 w-5" />}>
      <BlogForm />
    </AdminModal>
  );
}

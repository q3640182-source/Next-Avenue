"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building, FileText, Plus, Edit2 } from "lucide-react";

export function AdminModal({
  children,
  title,
  icon,
  footer
}: {
  children: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const router = useRouter();

  function onOpenChange(open: boolean) {
    if (!open) {
      router.back();
    }
  }

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-slate-50 p-0 flex flex-col rounded-[24px]">
        <DialogHeader>
          <DialogTitle>
            {icon && <span className="mr-2 flex items-center justify-center">{icon}</span>}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 md:p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {children}
        </div>
        <div id="admin-modal-footer" className="empty:hidden" />
      </DialogContent>
    </Dialog>
  );
}

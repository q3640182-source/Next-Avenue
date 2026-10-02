"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertTriangle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
  description: string;
  variant?: "danger" | "success" | "warning" | "default";
  confirmText?: string;
  cancelText?: string;
}

export function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
  description,
  variant = "default",
  confirmText = "Continue",
  cancelText = "Cancel"
}: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const icons = {
    danger: <Trash2 className="h-6 w-6 text-red-600" />,
    success: <CheckCircle2 className="h-6 w-6 text-green-600" />,
    warning: <AlertTriangle className="h-6 w-6 text-amber-600" />,
    default: null,
  };

  const bgColors = {
    danger: "bg-red-100",
    success: "bg-green-100",
    warning: "bg-amber-100",
    default: "bg-slate-100",
  };

  const buttonVariants = {
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
    default: "bg-slate-900 hover:bg-slate-800 text-white",
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !loading && !open && onClose()}>
      <AlertDialogContent className="rounded-2xl sm:rounded-[24px] max-w-md p-6 gap-6">
        <AlertDialogHeader className="space-y-4">
          {variant !== "default" && (
            <div className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-full", bgColors[variant])}>
              {icons[variant]}
            </div>
          )}
          <div className="space-y-2 text-center">
            <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row sm:justify-center gap-3 sm:space-x-0">
          <Button disabled={loading} variant="outline" onClick={onClose} className="rounded-full w-full sm:w-auto font-bold h-11 px-8">
            {cancelText}
          </Button>
          <Button disabled={loading} onClick={onConfirm} className={cn("rounded-full w-full sm:w-auto font-bold h-11 px-8", buttonVariants[variant])}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="font-heading text-3xl font-bold md:text-4xl">Something went wrong!</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        We apologize for the inconvenience. An unexpected error occurred while loading this page.
      </p>
      <div className="mt-8 flex gap-4">
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="font-heading text-8xl font-bold tracking-tighter text-primary">404</h1>
      <h2 className="mt-4 font-heading text-2xl font-semibold md:text-3xl">Page Not Found</h2>
      <p className="mt-4 max-w-md text-muted-foreground">
        We could not find the property or page you were looking for. It might have been sold, removed, or the link is broken.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/buy">Browse Properties</Link>
        </Button>
      </div>
    </div>
  );
}

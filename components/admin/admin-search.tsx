"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Building, FileText, User, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { globalAdminSearch } from "@/app/actions/search";

export function AdminSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    listings: Record<string, unknown>[];
    submissions: Record<string, unknown>[];
    users: Record<string, unknown>[];
  }>({ listings: [], submissions: [], users: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults({ listings: [], submissions: [], users: [] });
    }
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (!query) {
      setResults({ listings: [], submissions: [], users: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await globalAdminSearch(query);
      setResults(res);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const onSelect = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const hasResults =
    results.listings.length > 0 ||
    results.submissions.length > 0 ||
    results.users.length > 0;

  return (
    <>
      {/* Trigger — looks exactly like the old search bar */}
      <div className="relative w-full group cursor-text" onClick={() => setOpen(true)}>
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
          <Search className="size-4" />
        </div>
        <input
          type="text"
          readOnly
          placeholder="Search properties, submissions, users..."
          className="flex h-11 w-full rounded-full border border-slate-200 bg-slate-50/50 px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground cursor-text transition-all duration-200 shadow-sm"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="flex items-center border-b px-4">
            <Search className="size-4 text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search..."
              className="flex-1 h-12 px-3 text-sm bg-transparent outline-none placeholder:text-slate-400"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600">
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto p-2">
            {loading && (
              <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
            )}

            {!loading && query && !hasResults && (
              <div className="p-4 text-center text-sm text-slate-500">No results found.</div>
            )}

            {results.listings.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1.5 text-xs font-medium text-slate-400 uppercase">Properties</p>
                {results.listings.map((listing) => (
                  <button
                    key={listing.id as string}
                    onClick={() => onSelect(`/admin/listings`)}
                    className="flex items-center gap-2 w-full rounded-lg px-2 py-2 text-sm text-left hover:bg-slate-100 transition-colors"
                  >
                    <Building className="size-4 text-slate-400 shrink-0" />
                    <span className="flex-1 truncate">{listing.title as string}</span>
                    <span className="text-xs text-slate-400 uppercase">{listing.status as string}</span>
                  </button>
                ))}
              </div>
            )}

            {results.submissions.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1.5 text-xs font-medium text-slate-400 uppercase">Submissions</p>
                {results.submissions.map((sub) => (
                  <button
                    key={sub.id as string}
                    onClick={() => onSelect(`/admin/submissions`)}
                    className="flex items-center gap-2 w-full rounded-lg px-2 py-2 text-sm text-left hover:bg-slate-100 transition-colors"
                  >
                    <FileText className="size-4 text-slate-400 shrink-0" />
                    <span className="flex-1 truncate">{sub.ownerName as string}</span>
                    <span className="text-xs text-slate-400">{sub.phone as string}</span>
                  </button>
                ))}
              </div>
            )}

            {results.users.length > 0 && (
              <div className="mb-2">
                <p className="px-2 py-1.5 text-xs font-medium text-slate-400 uppercase">Users</p>
                {results.users.map((u) => (
                  <button
                    key={u.id as string}
                    onClick={() => onSelect(`/admin`)}
                    className="flex items-center gap-2 w-full rounded-lg px-2 py-2 text-sm text-left hover:bg-slate-100 transition-colors"
                  >
                    <User className="size-4 text-slate-400 shrink-0" />
                    <span className="flex-1 truncate">{u.name as string}</span>
                    <span className="text-xs text-slate-400">{u.email as string}</span>
                  </button>
                ))}
              </div>
            )}

            {!loading && !query && (
              <div className="p-4 text-center text-sm text-slate-400">
                Start typing to search properties, submissions, and users...
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

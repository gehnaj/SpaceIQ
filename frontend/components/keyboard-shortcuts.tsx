'use client';

import { useEffect, useState } from 'react';
import { X, Keyboard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
        title="Press Cmd+K (or Ctrl+K)"
      >
        <Keyboard className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 min-w-[260px] z-50">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Shortcuts</p>
        <button
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Toggle shortcuts</span>
          <Badge className="text-[9px] px-1.5" variant="outline">Cmd+K</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Close panel</span>
          <Badge className="text-[9px] px-1.5" variant="outline">Esc</Badge>
        </div>
      </div>
    </div>
  );
}

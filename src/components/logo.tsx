import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-lg font-bold text-primary tracking-tighter font-headline',
        className
      )}
    >
      <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
        <Sprout className="h-5 w-5" />
      </div>
      AgriGuard
    </div>
  );
}

import { ReactNode } from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

interface DataStateProps {
  isLoading: boolean;
  error: string | null;
  data: any;
  children: ReactNode;
  loadingText?: string;
  emptyText?: string;
  emptyIcon?: ReactNode;
}

/**
 * Reusable component for handling loading, error, and empty data states
 * Eliminates repetitive conditional rendering logic across pages
 * 
 * @example
 * <DataState isLoading={isLoading} error={error} data={parcels} loadingText="Loading parcels...">
 *   <ParcelTable parcels={parcels} />
 * </DataState>
 */
export function DataState({
  isLoading,
  error,
  data,
  children,
  loadingText = 'Loading...',
  emptyText = 'No data available',
  emptyIcon,
}: DataStateProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{loadingText}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-destructive mb-1">
              Error Loading Data
            </h3>
            <p className="text-sm text-destructive/90">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        {emptyIcon || <Inbox className="h-12 w-12 text-muted-foreground/50" />}
        <p className="text-muted-foreground">{emptyText}</p>
      </div>
    );
  }

  // Data exists - render children
  return <>{children}</>;
}

/**
 * Variant for inline loading (smaller, for buttons or inline actions)
 */
export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}
// src/components/EventCardSkeleton.tsx
export default function EventCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl bg-neutral-900/70 ring-1 ring-neutral-800">
      <div className="h-48 w-full bg-neutral-800" />
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 bg-neutral-800 rounded" />
        <div className="h-4 w-1/2 bg-neutral-800 rounded" />
        <div className="h-4 w-2/3 bg-neutral-800 rounded" />
      </div>
    </div>
  );
}

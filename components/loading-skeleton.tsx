"use client"

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="card p-6">
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 rounded animate-shimmer w-3/4" />
            <div className="h-4 bg-slate-200 rounded animate-shimmer w-1/2" />
            <div className="h-4 bg-slate-200 rounded animate-shimmer w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

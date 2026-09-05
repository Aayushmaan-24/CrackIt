import { clsx } from "clsx"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  count?: number
}

export function Skeleton({ className, count = 1, ...props }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "bg-white/[0.05] rounded animate-pulse",
            className
          )}
          {...props}
        />
      ))}
    </>
  )
}

export function QuestionCardSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-lg border border-white/5 bg-white/[0.02]">
      {/* Checkbox */}
      <Skeleton className="w-5 h-5 rounded border" />

      {/* Title and link */}
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
      </div>

      {/* Topics (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>

      {/* Company count (hidden on small screens) */}
      <Skeleton className="hidden sm:block h-4 w-12 rounded" />

      {/* Difficulty */}
      <Skeleton className="h-6 w-14 rounded" />

      {/* Bookmark */}
      <Skeleton className="w-4 h-4 rounded" />
    </div>
  )
}

export function FilterBarSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
      <Skeleton className="h-8 w-40 rounded-full mb-6" />
      <Skeleton className="h-16 w-3/4 rounded mb-4" />
      <Skeleton className="h-6 w-2/3 rounded mb-8" />
      <Skeleton className="h-11 w-40 rounded" />
    </div>
  )
}

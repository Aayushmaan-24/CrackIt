import { QuestionCardSkeleton, FilterBarSkeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

export function QuestionListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <FilterBarSkeleton />
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <QuestionCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function QuestionPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-40 bg-white/[0.05] rounded mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-white/[0.05] rounded animate-pulse" />
      </div>
      <QuestionListSkeleton />
    </div>
  )
}

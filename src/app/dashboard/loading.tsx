export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header skeleton */}
      <div className="mb-10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
        <div className="h-7 w-48 bg-white/10 rounded-lg animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 animate-pulse" />
            <div>
              <div className="h-7 w-12 bg-white/10 rounded animate-pulse mb-1" />
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar skeleton */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
          <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-2 bg-white/10 rounded-full" />
        <div className="h-3 w-48 bg-white/5 rounded animate-pulse mt-2" />
      </div>

      {/* Quick actions skeleton */}
      <div className="grid sm:grid-cols-2 gap-3">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
          </div>
        ))}
      </div>

    </div>
  )
}
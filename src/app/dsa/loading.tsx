export default function DSALoading() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-7 w-48 bg-white/10 rounded-lg animate-pulse mb-2" />
                <div className="h-4 w-80 bg-white/5 rounded-lg animate-pulse" />
            </div>

            {/* Filter Bar skeleton */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 mb-4">
                <div className="h-9 bg-white/5 rounded-lg animate-pulse ,b-4" />
                <div className="flex gap-2 mb-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                    ))}
                </div>
                <div className="flex gap-2 mb-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-6 w-20 bg-white/5 rounded-full animate-pulse" />
                    ))}
                </div>
                <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 w-16 bg-white/5 rounded-full animate-pulse" />
                    ))}
                </div>
            </div>

            {/* Question Row Skeletons */}
            <div className="flex flex-col gap-1.5">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg border border-white/10 bg-white/[0.02]">
                        <div className="w-5 h-5 rounded border-2 border-white/20 shrink-0" />
                        <div
                            className="flex-1 h-4 bg-white/10 rounded animate-pulse"
                            style={{ width: `${50 + Math.random() * 40}%`, animationDelay: `${i * 50}ms` }}
                        />
                        <div className="hidden md:flex gap-2">
                            <div className="h-5 w-16 bg-white/5 rounded animate-pulse" />
                        </div>
                        <div className="h-5 w-12 bg-white/5 rounded animate=pulse" />
                    </div>
                ))}
            </div>
        </div>
    )
}
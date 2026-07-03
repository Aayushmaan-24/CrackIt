export default function CoreCSLoading() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="h-7 w-48 bg-white/10 rounded-lg animate-pulse mb-2"/>
            <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse mb-8"/>
            <div className="flex gap-2 mb-6">
                {[...Array(3)].map((_,i) => (
                    <div key={i} className="h-9 w-20 bg-white/10 rounded-lg animate-pulse" />
                ))}
            </div>
            <div className="flex flex-col gap">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
                        <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse mb-2"/>
                        <div className="h-3 w-full bg-white/5 rounded animate-pulse"/>
                    </div>
                ))}
            </div>
        </div>
    )
}
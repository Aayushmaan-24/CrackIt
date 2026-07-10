export default function ProgressLoading() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="h-7 w-48 bg-white/10 rounded-lg animate-pulse mb-2" />
            <div className="h-4 w-64 bg-white/5 rounded-lg animate-pulse mb-10" />

            {/* Stats strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <div className="h-7 w-16 bg-white/10 rounded animate-pulse mb-1"/>
                        <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                    </div>
                ))}
            </div>

            {/* Company bars */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-4">
                <div  className="h-5 w-40 bg-white/10 rounded animate-pulse mb-6"/>
                {[...Array(6)].map((_,i) => (
                    <div key={i} className="mb-4">
                        <div className="flex justify-between mb-1.5">
                            <div className="h-4 w-20 bg-white/10 rounded animate-pulse"/>
                            <div className="h-4 w-12 bg-white/5 rounded animate-pulse"/>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full"/>
                    </div>
                ))}
            </div>

            {/* Topic bars */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                <div className="h-5 w-36 bg-white/10 rounded animate-pulse mb-6" />
                <div className="grid sm:grid-cols-2 gap-4">
                    {[...Array(8).map((_, i) => (
                        <div key={i}>
                            <div className="flex justify-between mb-1.5">
                                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                                <div className="h-4 w-10 bg-white/5 rounded animate-pulse" />
                            </div>
                            <div className="h-2 bg-white/10 rounded-full" />
                        </div>
                    ))]}
                </div>
            </div>
        </div>

    )
}
'use client'
import { useState } from "react"
import { clsx } from "clsx"
import { ChevronDown, ChevronUp, ExternalLink, Key } from "lucide-react"

interface SQLTopic {
    id: string
    title: string
    brief: string
    practices: {label: string, url: string}[]
    resources: {label: string, url: string}[]
    order_index: number
}

export function SQLList({ topics } : { topics: SQLTopic[] }) {
    const [expanded, setExpanded] = useState<string | null>(null)

    return (
        <div className="flex flex-col gap-2">
            {topics.map((topic, i) => (
                <div
                    key={topic.id}
                    className={clsx(
                        'border rounded-xl overflow-hidden transition-all',
                        expanded === topic.id
                        ? 'border-white/20 bg-white/[0.04]'
                        : 'border-white/10 bg-white/[0.02] hover:border-white/15'
                    )}>
                        <button
                            onClick={() => setExpanded(expanded === topic.id ? null : topic.id)}
                            className="w-full flex items-center gap-4 px-5 py-4 text-left"
                        >
                            <span className="flex-1 text-sm font-medium text-white/90">{topic.title}</span>
                            {expanded === topic.id
                                ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" />
                                : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                            }
                        </button>

                        {expanded === topic.id && (
                            <div className="px-5 pb-5 border-t border-white/10">
                                <div className="pt-4 flex flex-col gap-4">
                                    <p className="text-sm text-white/70 leading-relaxed">{topic.brief}</p>

                                    {/* Practice problems */}
                                    {topic.practices && topic.practices.length > 0 && (
                                        <div>
                                            <p className="text-xs text-white/30 font-medium mb-2">Practice Problems</p>
                                            <div className="flex flex-col gap-1.5">
                                                {topic.practices.map(p=> (
                                                    <a key={p.url}
                                                    href={p.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-yellow-400/80 hover:text-yellow-400 transition-colors group/link">
                                                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                                        {p.label}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Resources */}
                                    {topic.resources && topic.resources.length > 0 && (
                                        <div>
                                            <p className="text-xs text-white/30 font-medium mb-2">Resources</p>
                                            <div className="flex items-center gap-3 flex-wrap">
                                                {topic.resources.map(r => (
                                                    <a 
                                                    key={r.url}
                                                    href={r.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        {r.label}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
            ))}
        </div>
    )
}
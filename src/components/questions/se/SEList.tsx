'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'

interface SETopic {
  id: string
  title: string
  brief: string
  why_it_matters: string
  resources: { label: string; url: string }[]
  order_index: number
}

export function SEList({ topics }: { topics: SETopic[] }) {
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
          )}
        >
          <button
            onClick={() => setExpanded(expanded === topic.id ? null : topic.id)}
            className="w-full flex items-center gap-4 px-5 py-4 text-left"
          >
            <span className="text-white/20 text-xs font-mono w-5 shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
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

                {/* Why it matters */}
                <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-yellow-400/70 font-medium mb-1">Why it comes up in interviews</p>
                  <p className="text-sm text-white/50 leading-relaxed">{topic.why_it_matters}</p>
                </div>

                {/* Resources */}
                {topic.resources && topic.resources.length > 0 && (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-white/30">Resources:</span>
                    {topic.resources.map(r => (
                      
                        <a key={r.url}
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
                )}

              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
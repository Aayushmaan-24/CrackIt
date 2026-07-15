'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { clsx } from 'clsx'

interface Concept {
    id: string,
    category: string,
    category_id: string,
    title: string,
    brief: string,
    example?: string,
    resources: {label: string, url: string} []
    order_index: number
}

interface Props {
    concepts: Concept[]
    groupKey: string
    groupLabel: string
    emptyMessage: string
}

export function ConceptsAccordion({concepts, emptyMessage} : Props) {

    const [expanded, setExpanded] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)

    // Group by Category
    const grouped = concepts.reduce<Record<string, {label: string; items: Concept[]} >> ((acc, concept) => {
        const key = concept.category_id
        if (!acc[key]) acc[key] = {label: concept.category, items:[]}
        acc[key].items.push(concept)
        return acc
    }, {})

    const categories = Object.entries(grouped)
    const visibleConcepts = activeCategory
        ? grouped[activeCategory]?.items ?? []
        : concepts

    if (concepts.length === 0)
        return <p className="text-white/40 text-sm">{emptyMessage}</p>

    return (
        <div className='flex flex-col gap-4'>

            {/* Category filter chips */}
            <div className='flex items-center gap-2 flex-wrap'>
                <button
                    onClick={() => setActiveCategory(null)}
                    className={clsx(
                        'px-3 py-1 rounded-full text-xs border transition-all',
                        activeCategory === null
                            ? 'bg-white/15 border-white/40 text-white'
                            : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                    )}
                >
                    All
                </button>
                {categories.map(([key, { label }]) => (
                    <button
                        key={key}
                        onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                        className={clsx(
                            'px-3 py-1 rounded-full text-xs border transition-all',
                            activeCategory === key
                                ? 'bg-yellow-400/15 border-yellow-400/40 text-yellow-300'
                                : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Count */}
            <p className="text-xs text-white/30 px-1">
                {visibleConcepts.length} concepts
                {activeCategory && ` in ${grouped[activeCategory]?.label}`}
            </p>

            {/* Accordion */}
            <div className='flex flex-col gap-2'>
                {visibleConcepts.map((concept, i) => (
                    <div
                        key={concept.id}
                        className={clsx(
                            'border rounded-xl overflow-hidden transition-all',
                            expanded === concept.id
                                ? 'border-white/20 bg-white/[0.04]'
                                : 'border-white/10 bg-white/[0.02] hover:border-white/15'
                        )}
                    >
                        {/* Header */}
                        <button
                            onClick={() => setExpanded(expanded === concept.id ? null : concept.id)}
                            className="w-full flex items-center gap-4 px-5 py-4 text-left"
                        >
                            <span className="text-white/20 text-xs font-mono w-5 shrink-0">
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1 text-sm font-medium text-white/90">
                                {concept.title}
                            </span>
                            <span className="text-xs text-white/20 bg-white/5 px-2 py-0.5 rounded hidden sm:block shrink-0">
                                {concept.category}
                            </span>
                            {expanded === concept.id
                                ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" />
                                : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                            }
                        </button>

                        {/* Expanded content */}
                        {expanded === concept.id && (
                            <div className="px-5 pb-5 border-t border-white/10">
                                <div className="pt-4 flex flex-col gap-4">

                                {/* Brief */}
                                <p className="text-sm text-white/70 leading-relaxed">
                                    {concept.brief}
                                </p>

                                {/* Example */}
                                {concept.example && (
                                    <div className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
                                        <p className="text-xs text-yellow-400/70 font-medium mb-1">Example</p>
                                        <p className="text-sm text-white/50 leading-relaxed">
                                            {concept.example}
                                        </p>
                                    </div>
                                )}

                                {/* Resources */}
                                {concept.resources && concept.resources.length > 0 && (
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        <span className='text-xs text-white/30'>Resources:</span>
                                        {concept.resources.map((r: {label: string; url: string}) => (
                                            <a
                                            key={r.url}
                                            href={r.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className='flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors'
                                            >
                                                {r.label}
                                                <ExternalLink className='w-3 h-3' />
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
        </div>
    )
}

'use client'

import { clsx } from "clsx"
import { Search, X } from "lucide-react"
import type { Topic, Company, Difficulty } from "@/types"

const TOPICS : Topic[] = [
  'arrays', 'strings', 'two-pointers', 'sliding-window',
  'binary-search', 'stacks', 'queues', 'linked-lists',
  'trees', 'heaps', 'graphs', 'backtracking', 'greedy', 'dp', 'math'
]

const COMPANIES : Company[] = [
  'google', 'amazon', 'microsoft', 'meta',
  'flipkart', 'swiggy', 'zomato', 'atlassian', 'salesforce', 'adobe'
]

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard']

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20',
  medium: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10 hover:bg-yellow-400/20',
  hard: 'text-red-400 border-red-400/30 bg-red-400/10 hover:bg-red-400/20',
}

const COMPANY_LOGOS: Record<Company, string> = {
  google: 'G', amazon: 'A', microsoft: 'M', meta: 'M',
  flipkart: 'F', swiggy: 'S', zomato: 'Z',
  atlassian: 'At', salesforce: 'SF', adobe: 'Ad'
}

export interface FilterState {
    search : string
    topics : Topic[]
    companies : Company[]
    difficulties : Difficulty[]
}

interface FilterBarProps {
    filters : FilterState
    onChange : (filters: FilterState) => void
    totalCount : number
    filteredCount : number
}

export function FilterBar({ filters, onChange, totalCount, filteredCount } : FilterBarProps) {

    const toggleTopic = (topic : Topic) => {
        const next = filters.topics.includes(topic)
        ? filters.topics.filter(t => t !== topic)
        : [...filters.topics, topic]
        onChange({ ...filters, topics:next })
    }

    const toggleCompany = (company : Company) => {
        const next = filters.companies.includes(company)
        ? filters.companies.filter(c => c !== company)
        : [...filters.companies, company]
        onChange({ ...filters, companies:next })
    }

    const toggleDifficulty = (difficulty : Difficulty) => {
        const next = filters.difficulties.includes(difficulty)
        ? filters.difficulties.filter(d => d !== difficulty)
        : [...filters.difficulties, difficulty]
        onChange({ ...filters, difficulties:next })
    }

    const clearAll = () => { onChange({ search: '', topics: [], companies: [], difficulties: [] }) }

    const hasActiveFilters = filters.search || filters.topics.length || filters.companies.length || filters.difficulties.length

    return (

        <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/10 rounded-xl p-4">

            { /* Search Count */ }
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search questions...."
                        value = {filters.search}
                        onChange={e => onChange({ ...filters, search:e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder: text-white/30 focus: outline-none focus: border-white/30 transition-colors"
                        />
               </div>
               <span className="text-sm text-white/40 whitespace-nowrap">
                {filteredCount} / {totalCount}
               </span>
               {hasActiveFilters && (
                <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
                        < X className="w-3.5 h-3.5" />
                        Clear
                    </button>
               )}
            </div>

            {/* Difficulty */}

            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-white/30 uppercase tracking-wider w-16 shrink-0">Difficulty</span>
                { DIFFICULTIES.map(d => (
                    <button
                        key={d}
                        onClick={() => toggleDifficulty(d)}
                        className={clsx(
                            'px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all',
                            filters.difficulties.includes(d)
                            ? DIFFICULTY_COLORS[d]
                            : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                        )}
                        >
                            {d}
                    </button>
                )) }
            </div>

            {/* TOPICS */}

            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-white/30 uppercase tracking-wider w-16 shrink-0">Topic</span>
                {TOPICS.map(t => (
                    <button
                        key={t}
                        onClick={() => toggleTopic(t)}
                        className={clsx(
                            "px-3 py-1 rounded-full text-xs border capitalize transition-all",
                            filters.topics.includes(t)
                            ? 'bg-white/15 border-white/40 text-white'
                            : 'text-white/40 border-white/10 hover:border-white/20 hover:border-white/60'
                        )}
                    >
                        {t.replace('-',' ')}
                    </button>
                ))}
            </div>

        </div>

    )


}
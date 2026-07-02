'use client'

import { useState, useMemo } from "react"
import { ExternalLink, Bookmark, BookmarkCheck } from "lucide-react"
import { clsx } from "clsx"
import { useProgress } from "@/hooks/useProgress"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/dist/server/api-utils"

const ALL_COMPANIES = ['google','amazon','microsoft','meta','flipkart','swiggy','zomato','atlassian','salesforce','adobe']
const ALL_TAGS = ['hashing','databases','scalability','feed','caching','websockets','messaging','cdn','streaming','geolocation','matching','realtime','queues','distributed','trie','ranking','algorithms','api','pub-sub','crdt','low-latency','transactions','routing','concurrency','edge']

interface SDQuestion {
    id: string,
    title: string,
    url: string,
    companies: string[],
    tags: string[],
    order_index: number
}

export function SystemDesignList({ questions } : { questions: SDQuestion[] }) {
    const { progress, bookmarks, toggleComplete, toggleBookmark, isLoggedIn } = useProgress()
    const [showAuthPrompt, setShowAuthPrompt] = useState(false)
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [search, setSearch] = useState('')

    const filtered = useMemo(() => {
        return questions.filter(q => {
            if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false
            if (selectedCompanies.length && !selectedCompanies.some(c => q.companies.includes(c))) return false
            if (selectedTags.length && !selectedTags.some(t => q.tags.includes(t))) return false
            return true
        })
    }, [questions, search, selectedCompanies, selectedTags])

    const toggle = (arr: string[], val: string, set:(v: string[]) =>  void) => {
        set(arr.includes(val) ? arr.filter(x => x!==val) : [...arr, val])
    }

    const handleAction = async (fn :() => Promise<boolean>, id:string)=> {
        if (!isLoggedIn){
            setShowAuthPrompt(true)
            return
        }
        await fn()
    }

    const handleSignIn = () => {
        const supabase = createClient()
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${location.origin}/auth/callback` }
        })
    }

    return (
        <div className="flex flex-col gap-4">

            {showAuthPrompt && (
            <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-3">
                <p className="text-sm text-yellow-300">Sign in to track your progress</p>
                <div className="flex items-center gap-3">
                    <button onClick={handleSignIn} className="text-sm font-medium text-yellow-400 hover:text-yellow-300">Sign in with Google</button>
                    <button onClick={() => setShowAuthPrompt(false)} className="text-xs text-white/30 hover:text-white/50">Dismiss</button>
                </div>
            </div>
            )}

            {/* Filters */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-col gap-3">
                <input
                    type="text"
                    placeholder="Search system design questions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
                />
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/30 uppercase tracking-wider w-16 shrink-0">Company</span>
                    {ALL_COMPANIES.map(c => (
                        <button
                            key={c}
                            onClick={() => toggle(selectedCompanies, c, setSelectedCompanies)}
                            className={clsx('px-3 py-1 rounded-lg text-xs border capitalize transition-all',
                                selectedCompanies.includes(c)
                                    ? 'bg-blue-400/15 border-blue-400/40 text-blue-300'
                                    : 'bg-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                        )}>
                            {c}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-white/30 uppercase tracking-wider w-16 shrink-0">Tag</span>
                    {ALL_TAGS.slice(0,12).map(t => (
                        <button
                            key={t}
                            onClick={() => toggle(selectedTags, t, setSelectedTags)}
                            className={clsx('px-3 py-1 rounded-full text-xs border capitalize transition-all',
                                selectedTags.includes(t)
                                    ? 'bg-white/15 border-white/40 text-white'
                                    : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
                        )}>
                            {t}
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-xs text-white/30">
                        {filtered.length} / {questions.length} questions
                    </span>
                    {( selectedCompanies.length > 0 || selectedTags.length > 0 || search ) && (
                        <button onClick={() => { setSelectedCompanies([]); setSelectedTags([]); setSearch('') }}
                        className="text-xs text-white/40 hover:text-white/70">
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            {isLoggedIn && (
                <div className="flex items-center gap-3 px-1">
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${(Object.values(progress).filter(Boolean).length / questions.length)}`}} />
                    </div>
                    <span className="text-xs text-white/40 shrink-0">
                        {Object.values(progress).filter(Boolean).length} / {questions.length} done
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {filtered.map(q => (
                    <div
                        key={q.id} className={clsx('group bg-white/[0.02] border rounded-xl p-5 transition-all',
                            progress[q.id] ? 'border-white/5' : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
                        )}>
                            <div className="flex items-start gap-4">
                                {/* Checkbox */}
                                <button
                                    onClick={() => handleAction(() => toggleComplete(q.id), q.id)}
                                    className={clsx('mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                                        progress[q.id] ? 'bg-green-500 border-green-500' : 'border-white/20 hover:border-white/50'
                                    )}
                                >
                                    {progress[q.id] && (
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                <div className="flex-1 min-w-0">
                                    {/* Title */}
                                    <a href={q.url} target="_blank" rel="noopener noreferrer"
                                        className={clsx('font-medium flex items-center gap-2 group/link mb-2',
                                            progress[q.id] ? 'text-white/40 line-through' : 'text-white hover:text-yellow-400'
                                    )}>
                                        {q.title}
                                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
                                    </a>

                                    {/* Tags row */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {q.tags.map(t => (
                                            <span key={t} className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded capitalize">
                                                {t}
                                            </span>
                                        ))}
                                        <span className="text-white/20 text-xs">.</span>
                                        {q.companies.slice(0,4).map(c => (
                                            <span key={c} className="text-xs text-blue-400/60 capitalize">{c}</span>
                                        ))}
                                        {q.companies.length > 4 && (
                                            <span className="text-xs text-white/20">+{q.companies.length - 4}</span>
                                        )}
                                    </div>

                                </div>

                                {/* Bookmark button */}
                                <button 
                                    onClick={() => handleAction(() => toggleBookmark(q.id), q.id)}
                                    className={clsx(
                                        'shrink-0 transition-colors mt-0.5',
                                        bookmarks[q.id] ? 'text-yellow-400' : 'text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100'
                                    )}
                                >
                                    {bookmarks[q.id] ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                </button>

                            </div>
                    </div>
                ))}
            </div>

        </div>
    )

}
'use client'

import { useState, useMemo } from 'react'
import { FilterBar, type FilterState } from './FilterBar'
import { QuestionCard } from './QuestionCard'
import { useProgress } from '@/hooks/useProgress'
import type { Question } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { fileURLToPath } from 'url'

interface QuestionListProps {
    questions : Question[]
}

export function QuestionList({ questions }: QuestionListProps) {

    const { progress, bookmarks, toggleComplete, toggleBookmark, isLoggedIn } = useProgress()
    const [showAuthPrompt, setShowAuthPrompt] = useState(false)
    const [filters, setFilters] = useState<FilterState>({ 
        search: '', topics:[], companies:[], difficulties:[]
    })

    const filtered = useMemo(() => {
        return questions.filter(q => {
            if(filters.search && !q.title.toLowerCase().includes(filters.search.toLowerCase())) return false
            if(filters.difficulties.length && !filters.difficulties.includes(q.difficulty)) return false
            if(filters.companies.length && !filters.companies.some(c => q.companies.includes(c))) return false
            if(filters.topics.length && filters.topics.some(t => q.topics.includes(t))) return false
            return true
        })
    }, [questions, filters])


    const handleSignIn = () => {
        const supabase = createClient()
        supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${location.origin}/auth/callback` }
        })
    }

    return (
        <div className='flex flex-col gap-4'>
            {/* Auth nudge */}
            {showAuthPrompt && (
                <div className='flex items-center justify-between bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-3'>
                    <p className='text-sm text-yellow-300'>Sign in to track your progress FLAWLESSly</p>
                    <div className='flex items-center gap-3'>
                        <button
                            onClick={handleSignIn}
                            className='text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors'>
                                Sign in with Google →
                        </button>
                        <button 
                            onClick={() => setShowAuthPrompt(false)}
                            className='text-xs text-white/30 hover:text-white/50'>
                                Dismiss
                        </button>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <FilterBar
                filters={filters}
                onChange={setFilters}
                totalCount={questions.length}
                filteredCount={filtered.length}
            />

            {/* Progress Report */}

            {isLoggedIn && (
                <div className='flex items-center gap-3 px-1'>
                    <div className='flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden'>
                        <div className='h-full bg-green-500 rounded-full transition-all duration-500'
                        style={{ width: `${(Object.values(progress).filter(Boolean).length / questions.length) * 100}%` }} />
                    </div>
                    <span className='text-xs text-white/40 shrink-0'>
                    {Object.values(progress).filter(Boolean).length} / {questions.length} solved
                    </span>
                </div>
            )}

            {/* LIST */}

            <div className='flex flex-col gap-1.5'>
                {filtered.length === 0 ? (
                    <div className='text-center py-16 text-white/30 text-sm'>
                        No questions match your filters
                    </div>
                ) : (
                    filtered.map(q => (
                        <QuestionCard
                            key={q.id}
                            question={q}
                            completed={progress[q.id] ?? false}
                            bookmarked={bookmarks[q.id] ?? false}
                            onToggleComplete={() => toggleComplete(q.id)}
                            onToggleBookmark={() => toggleBookmark(q.id)}
                            isLoggedIn={isLoggedIn}
                            onAuthRequired={() => setShowAuthPrompt(true)}
                    />
                    ))
                )}
            </div>

        </div>
    )
    
}
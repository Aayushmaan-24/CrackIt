'use client'

import { clsx } from "clsx"
import { ExternalLink, Bookmark, BookmarkCheck, StickyNote } from "lucide-react"
import { useState, useEffect, useRef } from 'react'
import type { Question, Difficulty } from '@/types'
import { posthog } from "@/lib/posthog"

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  easy: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  hard: 'text-red-400 bg-red-400/10',
}

const MAX_NOTE_LENGTH = 500

interface QuestionCardProps {
    question: Question
    completed: boolean
    bookmarked: boolean
    note: string
    onToggleComplete: () => void
    onToggleBookmark: () => void
    onSaveNote : (note: string) => void
    isLoggedIn: boolean
    onAuthRequired: () => void
}

export function QuestionCard ({
    question,
    completed,
    bookmarked,
    note,
    onToggleComplete,
    onToggleBookmark,
    onSaveNote,
    isLoggedIn,
    onAuthRequired,
}: QuestionCardProps) {

    const [noteOpen, setNoteOpen] = useState(false)
    const [localNote, setLocalNote] = useState(note ?? '')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Sync if note changes from outside (initial load)
    useEffect(() => {
        setLocalNote(note ?? '')
    }, [note])

    const handleNoteChange = (value: string) => {
        if(value.length > MAX_NOTE_LENGTH) return
        setLocalNote(value)

        // Debounce — save 1 second after user stops typing
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            onSaveNote(value)
        }, 1000)
    }

    const handleCheck = () => {
        if(!isLoggedIn) {
            onAuthRequired();
            return
        }
        onToggleComplete()
        posthog.capture('question_completed', {
            question_id : question.id,
            title : question.title,
            difficulty : question.difficulty,
            topics : question.topics,
            companies: question.companies
        })
    }

    const handleBookmark = () => {
        if(!isLoggedIn) {
            onAuthRequired();
            return
        }
        onToggleBookmark()
        posthog.capture('question_bookmarked', {
            question_id : question.id,
            difficulty : question.difficulty
        })
    }

    const handleNoteToggle = () => {
        if(!isLoggedIn) {
            onAuthRequired();
            return
        }
        setNoteOpen(prev => !prev)
    }

    const hasNote = localNote.trim().length > 0

    return (

        <div className={clsx('rounded-lg border transition-all',
            completed
            ? 'bg-white/[0.02] border-white/5'
            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
        )}>

        <div/>
        <div className='group flex items-center gap-4 px-4 py-3 rounded-lg border transition-all min-h-[2.75rem]'>

            {/* CheckBox */}
            <button
                onClick={handleCheck}
                className={clsx(
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all flex-shrink-0',
                    completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-white/20 hover:border-white/50'
                )}
                aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
            >
                {completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Title */}

            <a href={question.leetcode_url}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
                'flex-1 text-sm font-medium flex items-center gap-2 group/link min-w-0',
                completed ? 'text-white/40 line-through' : 'text-white hover:text-yellow-400'
            )}
            >
                <span className="truncate">{question.title}</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 flex-shrink-0" />
            </a>

            {/* Tags — hidden on mobile, visible md+ */}
            <div className="hidden md:flex items-center gap-2 shrink-0 flex-shrink-0">
                 {question.topics.slice(0, 2).map(topic => (
                    <span key={topic} className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded capitalize whitespace-nowrap">
                        {topic.replace('-', ' ')}
                    </span>
                ))}
            </div>

            { /* Company Count */ }
            <span className="hidden sm:block text-xs text-white/25 shrink-0 flex-shrink-0 w-10 text-right">
                {question.companies.length} co.
            </span>

            {/* Difficulty */}
            <span className={clsx(
                'text-xs font-medium px-2 py-0.5 rounded capitalize shrink-0 flex-shrink-0 whitespace-nowrap',
                DIFFICULTY_BADGE[question.difficulty]
            )}>
                {question.difficulty}
            </span>

            {/* Notes toggle */}
            <button
                onClick={handleNoteToggle}
                className={clsx(
                    'shrink-0 flex-shrink-0 w-5 h-5 flex items-center justify-center transition-colors',
                    hasNote ? 'text-yellow-400' : noteOpen ? 'text-white/60' : 'text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100'
                )}
                aria-label={hasNote ? "View note" : "Add note"}
            >
                <StickyNote className="w-4 h-4" />
            </button>

            {/* Bookmark */}
            <button
                onClick={handleBookmark}
                className={clsx(
                    'shrink-0 transition-colors flex-shrink-0 w-5 h-5 flex items-center justify-center',
                    bookmarked ? 'text-yellow-400' : 'text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100'
                )}
                aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
                {bookmarked
                ? <BookmarkCheck className="w-4 h-4" />
                : <Bookmark className="w-4 h-4" />
                }
            </button>
        </div>

        {/* Notes panel — expands below the row */}
        {noteOpen && (
            <div className="px-4 pb-3 border-t border-white/5">
                <div className="pt-2 flex flex-col gap-1.5">
                    <textarea
                        value={localNote}
                        onChange = {e => handleNoteChange(e.target.value)}
                        placeholder="Write your approach, key insight, or anything to remember..."
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/25 resize-none transition-colors"
                    />
                    <div className="flex items-center justify-between px-0.5">
                        <span className="text-xs text-white/20">Auto saves as you type</span>
                        <span className={clsx(
                            'text-xs',
                            localNote.length > 450? 'text-yellow-400' : 'text-white/20'
                        )}>
                            {localNote.length}/{MAX_NOTE_LENGTH}
                        </span>
                    </div>
                </div>
            </div>
        )}
        </div>
    )
}
'use client'

import { clsx } from "clsx"
import { ExternalLink, Bookmark, BookmarkCheck } from "lucide-react"
import type { Question, Difficulty } from '@/types'
import { posthog } from "@/lib/posthog"

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
  easy: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  hard: 'text-red-400 bg-red-400/10',
}

interface QuestionCardProps {
    question: Question
    completed: boolean
    bookmarked: boolean
    onToggleComplete: () => void
    onToggleBookmark: () => void
    isLoggedIn: boolean
    onAuthRequired: () => void
}

export function QuestionCard ({
    question,
    completed,
    bookmarked,
    onToggleComplete,
    onToggleBookmark,
    isLoggedIn,
    onAuthRequired,
}: QuestionCardProps) {

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

    return (
        <div className={clsx(
            'group flex items-center gap-4 px-4 py-3 rounded-lg border transition-all',
            completed 
            ? 'bg-white/[0.02] border-white/5'
            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
        )}>

            {/* CheckBox */}
            <button
                onClick={handleCheck}
                className={clsx(
                    'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                    completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-white/20 hover:border-white/50'
                )}
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
                'flex-1 text-sm font-medium flex items-center gap-2 group/link',
                completed ? 'text-white/40 line-through' : 'text-white hover:text-yellow-400'
            )}
            >
                {question.title}
                <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0" />
            </a>

            {/* Tags — hidden on mobile, visible md+ */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
                 {question.topics.slice(0, 2).map(topic => (
                    <span key={topic} className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded capitalize">
                        {topic.replace('-', ' ')}
                    </span>
                ))}
            </div>

            { /* Company Count */ }
            <span className="hidden sm:block text-xs text-white/25 shrink-0">
                {question.companies.length} co.
            </span>

            {/* Difficulty */}
            <span className={clsx(
                'text-xs font-medium px-2 py-0.5 rounded capitalize shrink-0',
                DIFFICULTY_BADGE[question.difficulty]
            )}>
                {question.difficulty}
            </span>

            {/* Bookmark */}
            <button
                onClick={handleBookmark}
                className={clsx(
                    'shrink-0 transition-colors',
                    bookmarked ? 'text-yellow-400' : 'text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100'
                )}
            >
                {bookmarked
                ? <BookmarkCheck className="w-4 h-4" />
                : <Bookmark className="w-4 h-4" />
                }
            </button>

        </div>
    )
}
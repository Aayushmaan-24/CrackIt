'use client'
import { useState, useMemo } from 'react'
import { FilterBar, type FilterState } from '../FilterBar'
import { QuestionCard } from '../QuestionCard'
import { useProgress } from '@/hooks/useProgress'
import type { Question } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { clsx } from 'clsx'

type Mode = 'beginner' | 'experienced' | 'all'

// Topic display order and labels for roadmap view
const TOPIC_META: Record<string, { label: string; order: number; beginner: boolean }> = {
  'arrays':            { label: 'Arrays',              order: 1,  beginner: true },
  'strings':           { label: 'Strings',             order: 2,  beginner: true },
  'hash-map':          { label: 'Hash Map',            order: 3,  beginner: true },
  'two-pointers':      { label: 'Two Pointers',        order: 4,  beginner: true },
  'prefix-sum':        { label: 'Prefix Sum',          order: 5,  beginner: true },
  'sliding-window':    { label: 'Sliding Window',      order: 6,  beginner: true },
  'stacks':            { label: 'Stacks',              order: 7,  beginner: true },
  'queues':            { label: 'Queues',              order: 8,  beginner: true },
  'linked-lists':      { label: 'Linked Lists',        order: 9,  beginner: true },
  'binary-search':     { label: 'Binary Search',       order: 10, beginner: true },
  'trees':             { label: 'Trees',               order: 11, beginner: true },
  'heaps':             { label: 'Heaps',               order: 12, beginner: true },
  'fast-slow-pointers':{ label: 'Fast & Slow Pointers',order: 13, beginner: false },
  'backtracking':      { label: 'Backtracking',        order: 14, beginner: false },
  'greedy':            { label: 'Greedy',              order: 15, beginner: false },
  'intervals':         { label: 'Intervals',           order: 16, beginner: false },
  'graphs':            { label: 'Graphs',              order: 17, beginner: false },
  'union-find':        { label: 'Union Find',          order: 18, beginner: false },
  'monotonic-stack':   { label: 'Monotonic Stack',     order: 19, beginner: false },
  'dp':                { label: 'Dynamic Programming', order: 20, beginner: false },
  'math':              { label: 'Bit Manipulation & Math', order: 21, beginner: false },
}

const DIFFICULTY_ORDER = { easy: 0, medium: 1, hard: 2 }

const DIFF_BADGE = {
  easy: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  hard: 'text-red-400 bg-red-400/10',
}

// Get the primary topic for grouping — use the one with lowest order
function getPrimaryTopic(question: Question): string {
  let best = { topic: question.topics[0] ?? 'arrays', order: 999 }
  for (const t of question.topics) {
    const meta = TOPIC_META[t]
    if (meta && meta.order < best.order) {
      best = { topic: t, order: meta.order }
    }
  }
  return best.topic
}

interface QuestionListProps {
  questions: Question[]
  initialFilter?: string
}

export function QuestionList({ questions, initialFilter }: QuestionListProps) {
  const { progress, bookmarks, notes, toggleComplete, toggleBookmark, saveNote, isLoggedIn } = useProgress()
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [mode, setMode] = useState<Mode>('beginner')
  const [filters, setFilters] = useState<FilterState>({
    search: '', topics: [], companies: [], difficulties: []
  })
  const [bookmarkMode, setBookmarkMode] = useState(initialFilter === 'bookmarked')

  // Base list depending on mode
  const baseList = useMemo(() => {
    if (mode === 'beginner') return questions.filter(q => q.beginner_eligible)
    if (mode === 'experienced') return questions
    return questions
  }, [questions, mode])

  // Apply filters on top
  const filtered = useMemo(() => {
    let list = baseList

    if (bookmarkMode) list = list.filter(q => bookmarks[q.id])

    if (filters.search.trim()) {
      list = list.filter(q =>
        q.title.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    if (filters.difficulties.length)
      list = list.filter(q => filters.difficulties.includes(q.difficulty))
    if (filters.topics.length)
      list = list.filter(q => filters.topics.some(t => q.topics.includes(t)))
    if (filters.companies.length)
      list = list.filter(q => filters.companies.some(c => q.companies.includes(c)))

    return list
  }, [baseList, filters, bookmarkMode, bookmarks])

  // Group by primary topic for beginner/experienced, flat for all
  const grouped = useMemo(() => {
    if (mode === 'all') return null

    const groups: Record<string, Question[]> = {}
    for (const q of filtered) {
      const topic = getPrimaryTopic(q)
      if (!groups[topic]) groups[topic] = []
      groups[topic].push(q)
    }

    // Sort questions within each group by difficulty then order_index
    for (const topic of Object.keys(groups)) {
      groups[topic].sort((a, b) => {
        const diffDiff = DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty]
        return diffDiff !== 0 ? diffDiff : a.order_index - b.order_index
      })
    }

    // Sort topics by canonical order
    const sortedTopics = Object.keys(groups).sort((a, b) => {
      const aOrder = TOPIC_META[a]?.order ?? 99
      const bOrder = TOPIC_META[b]?.order ?? 99
      return aOrder - bOrder
    })

    return sortedTopics.map(topic => ({
      topic,
      label: TOPIC_META[topic]?.label ?? topic,
      questions: groups[topic],
    }))
  }, [filtered, mode])

  const solvedCount = questions.filter(q => progress[q.id]).length

  const handleSignIn = () => {
    createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
  }

  const TABS: { id: Mode; label: string; desc: string }[] = [
    { id: 'beginner', label: 'Beginner', desc: 'Arrays → Trees · Easy & Medium only' },
    { id: 'experienced', label: 'Experienced', desc: 'Full roadmap · All difficulties' },
    { id: 'all', label: 'All', desc: 'Flat list · Use filters' },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Mode tabs */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setMode(tab.id); setBookmarkMode(false) }}
            className={clsx(
              'flex flex-col items-start px-4 py-3 rounded-xl border text-left transition-all',
              mode === tab.id
                ? 'bg-yellow-400/10 border-yellow-400/30 text-white'
                : 'bg-white/[0.02] border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
            )}
          >
            <span className={clsx(
              'text-sm font-semibold',
              mode === tab.id ? 'text-yellow-400' : ''
            )}>
              {tab.label}
            </span>
            <span className="text-xs text-white/30 mt-0.5 hidden sm:block">
              {tab.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Auth nudge */}
      {showAuthPrompt && (
        <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-3">
          <p className="text-sm text-yellow-300">Sign in to track your progress across devices</p>
          <div className="flex items-center gap-3">
            <button onClick={handleSignIn} className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">
              Sign in with Google →
            </button>
            <button onClick={() => setShowAuthPrompt(false)} className="text-xs text-white/30 hover:text-white/50">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Bookmark mode banner */}
      {bookmarkMode && (
        <div className="flex items-center justify-between bg-blue-400/10 border border-blue-400/20 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-300">
            Showing bookmarked questions
            {filtered.length === 0 && isLoggedIn && ' — you have no bookmarks yet'}
          </p>
          <button onClick={() => setBookmarkMode(false)} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Show all →
          </button>
        </div>
      )}

      <FilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={bookmarkMode ? filtered.length : baseList.length}
        filteredCount={filtered.length}
      />

      {/* Overall progress bar */}
      {isLoggedIn && !bookmarkMode && (
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(solvedCount / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-white/40 shrink-0">
            {solvedCount} / {questions.length} solved
          </span>
        </div>
      )}

      {/* GROUPED VIEW — Beginner / Experienced */}
      {grouped && (
        <div className="flex flex-col gap-8">
          {grouped.map(({ topic, label, questions: topicQs }) => {
            const topicSolved = topicQs.filter(q => progress[q.id]).length
            const pct = Math.round((topicSolved / topicQs.length) * 100)

            return (
              <div key={topic}>
                {/* Topic header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-white/90">{label}</h2>
                    <span className="text-xs text-white/30">{topicQs.length} questions</span>
                    {/* Difficulty breakdown */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {(['easy', 'medium', 'hard'] as const).map(diff => {
                        const count = topicQs.filter(q => q.difficulty === diff).length
                        if (!count) return null
                        return (
                          <span key={diff} className={clsx('text-xs px-1.5 py-0.5 rounded capitalize', DIFF_BADGE[diff])}>
                            {count} {diff}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  {isLoggedIn && (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/30">{topicSolved}/{topicQs.length}</span>
                    </div>
                  )}
                </div>

                {/* Questions in this topic */}
                <div className="flex flex-col gap-1.5">
                  {topicQs.map(q => (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      completed={progress[q.id] ?? false}
                      bookmarked={bookmarks[q.id] ?? false}
                      note={notes[q.id] ?? ''}
                      onToggleComplete={() => toggleComplete(q.id)}
                      onToggleBookmark={() => toggleBookmark(q.id)}
                      onSaveNote={(note) => saveNote(q.id, note)}
                      isLoggedIn={isLoggedIn}
                      onAuthRequired={() => setShowAuthPrompt(true)}
                    />
                  ))}
                </div>
              </div>
            )
          })}

          {grouped.length === 0 && (
            <div className="text-center py-16 text-white/30 text-sm">
              {bookmarkMode && !isLoggedIn
                ? 'Sign in to see your bookmarked questions.'
                : 'No questions match your filters.'}
            </div>
          )}
        </div>
      )}

      {/* FLAT VIEW — All tab */}
      {!grouped && (
        <div className="flex flex-col gap-1.5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-white/30 text-sm">
              No questions match your filters.
            </div>
          ) : (
            filtered.map(q => (
              <QuestionCard
                key={q.id}
                question={q}
                completed={progress[q.id] ?? false}
                bookmarked={bookmarks[q.id] ?? false}
                note={notes[q.id] ?? ''}
                onToggleComplete={() => toggleComplete(q.id)}
                onToggleBookmark={() => toggleBookmark(q.id)}
                onSaveNote={(note) => saveNote(q.id, note)}
                isLoggedIn={isLoggedIn}
                onAuthRequired={() => setShowAuthPrompt(true)}
              />
            ))
          )}
        </div>
      )}

    </div>
  )
}
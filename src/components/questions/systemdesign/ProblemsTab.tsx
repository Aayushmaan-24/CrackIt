'use client'
import { useState } from 'react'
import { clsx } from 'clsx'
import { ExternalLink, Bookmark, BookmarkCheck } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { createClient } from '@/lib/supabase/client'

type SubTab = 'hld' | 'lld' | 'machine_coding'

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: 'hld', label: 'HLD Problems' },
  { id: 'lld', label: 'LLD Problems' },
  { id: 'machine_coding', label: 'Machine Coding' },
]

interface Problem {
  id: string
  title: string
  description?: string
  url?: string
  companies?: string[]
  tags: string[]
  problem_type: string
  order_index: number
}

interface Props {
  hldProblems: Problem[]
  lldProblems: Problem[]
}

export function ProblemsTab({ hldProblems, lldProblems }: Props) {
  const [activeTab, setActiveTab] = useState<SubTab>('hld')
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const { progress, bookmarks, toggleComplete, toggleBookmark, isLoggedIn } = useProgress()

  const hldOnly = hldProblems.filter(p => p.problem_type === 'hld')
  const machineOnly = hldProblems.filter(p => p.problem_type === 'machine_coding')

  const problemsToShow =
    activeTab === 'hld' ? hldOnly :
    activeTab === 'lld' ? lldProblems :
    machineOnly

  const handleAction = async (fn: () => Promise<boolean>) => {
    if (!isLoggedIn) { setShowAuthPrompt(true); return }
    await fn()
  }

  const handleSignIn = () => {
    createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` }
    })
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Auth nudge */}
      {showAuthPrompt && (
        <div className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/20 rounded-lg px-4 py-3">
          <p className="text-sm text-yellow-300">Sign in to track your progress</p>
          <div className="flex items-center gap-3">
            <button onClick={handleSignIn} className="text-sm font-medium text-yellow-400 hover:text-yellow-300">
              Sign in with Google →
            </button>
            <button onClick={() => setShowAuthPrompt(false)} className="text-xs text-white/30 hover:text-white/50">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="flex gap-2">
        {SUB_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
              activeTab === tab.id
                ? 'bg-white/10 border-white/30 text-white'
                : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
            )}
          >
            {tab.label}
            <span className="ml-2 text-xs text-white/30">
              {tab.id === 'hld' ? hldOnly.length :
               tab.id === 'lld' ? lldProblems.length :
               machineOnly.length}
            </span>
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {isLoggedIn && problemsToShow.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{
                width: `${(problemsToShow.filter(q => progress[q.id]).length / problemsToShow.length) * 100}%`
              }}
            />
          </div>
          <span className="text-xs text-white/40 shrink-0">
            {problemsToShow.filter(q => progress[q.id]).length} / {problemsToShow.length} done
          </span>
        </div>
      )}

      {/* Problem cards */}
      <div className="flex flex-col gap-3">
        {problemsToShow.map(problem => (
          <div
            key={problem.id}
            className={clsx(
              'group bg-white/[0.02] border rounded-xl p-5 transition-all',
              progress[problem.id]
                ? 'border-white/5'
                : 'border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
            )}
          >
            <div className="flex items-start gap-4">

              {/* Checkbox */}
              <button
                onClick={() => handleAction(() => toggleComplete(problem.id))}
                className={clsx(
                  'mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all',
                  progress[problem.id]
                    ? 'bg-green-500 border-green-500'
                    : 'border-white/20 hover:border-white/50'
                )}
              >
                {progress[problem.id] && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <div className="flex-1 min-w-0">
                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  {problem.url ? (
                    
                      <a href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={clsx(
                        'font-medium text-sm flex items-center gap-1.5 group/link',
                        progress[problem.id]
                          ? 'text-white/40 line-through'
                          : 'text-white hover:text-yellow-400'
                      )}
                    >
                      {problem.title}
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <span className={clsx(
                      'font-medium text-sm',
                      progress[problem.id] ? 'text-white/40 line-through' : 'text-white'
                    )}>
                      {problem.title}
                    </span>
                  )}
                </div>

                {/* Description */}
                {problem.description && (
                  <p className="text-xs text-white/40 leading-relaxed mb-2">
                    {problem.description}
                  </p>
                )}

                {/* Tags + companies */}
                <div className="flex items-center gap-2 flex-wrap">
                  {problem.tags.map(tag => (
                    <span key={tag} className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded capitalize">
                      {tag}
                    </span>
                  ))}
                  {problem.companies && problem.companies.length > 0 && (
                    <>
                      <span className="text-white/20 text-xs">·</span>
                      {problem.companies.slice(0, 3).map(c => (
                        <span key={c} className="text-xs text-blue-400/60 capitalize">{c}</span>
                      ))}
                      {problem.companies.length > 3 && (
                        <span className="text-xs text-white/20">+{problem.companies.length - 3}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Bookmark */}
              <button
                onClick={() => handleAction(() => toggleBookmark(problem.id))}
                className={clsx(
                  'shrink-0 transition-colors mt-0.5',
                  bookmarks[problem.id]
                    ? 'text-yellow-400'
                    : 'text-white/20 hover:text-white/50 opacity-0 group-hover:opacity-100'
                )}
              >
                {bookmarks[problem.id]
                  ? <BookmarkCheck className="w-4 h-4" />
                  : <Bookmark className="w-4 h-4" />
                }
              </button>
            </div>
          </div>
        ))}

        {problemsToShow.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No problems found.
          </div>
        )}
      </div>
    </div>
  )
}
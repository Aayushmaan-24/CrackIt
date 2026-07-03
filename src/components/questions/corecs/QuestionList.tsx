'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { clsx } from 'clsx'

type Subject = 'os' | 'dbms' | 'cn'

const SUBJECT_LABELS: Record<Subject, string> = {
  os: 'Operating Systems',
  dbms: 'DBMS',
  cn: 'Computer Networks',
}

const SUBJECT_COLORS: Record<Subject, string> = {
  os: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  dbms: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  cn: 'text-green-400 bg-green-400/10 border-green-400/20',
}

const DIFFICULTY_COLORS = {
  easy: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  hard: 'text-red-400 bg-red-400/10',
}

interface CoreQuestion {
  id: string
  subject: Subject
  question: string
  answer: string
  difficulty: string
  order_index: number
}

export function CoreCSList({ questions }: { questions: CoreQuestion[] }) {
  const [activeTab, setActiveTab] = useState<Subject>('os')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = questions.filter(q => q.subject === activeTab)

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev === id ? null : id)
  }

  // short answer = first paragraph of the answer
  const shortAnswer = (answer: string) => answer.split('\n\n')[0]
  const hasMore = (answer: string) => answer.split('\n\n').length > 1

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {(['os', 'dbms', 'cn'] as Subject[]).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setExpanded(null) }}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium border transition-all',
              activeTab === tab
                ? SUBJECT_COLORS[tab]
                : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
            )}
          >
            {SUBJECT_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* Question count */}
      <p className="text-xs text-white/30 mb-4 px-1">{filtered.length} questions</p>

      {/* Questions */}
      <div className="flex flex-col gap-2">
        {filtered.map((q, i) => (
          <div
            key={q.id}
            className={clsx(
              'border rounded-xl overflow-hidden transition-all',
              expanded === q.id
                ? 'border-white/20 bg-white/[0.04]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.03]'
            )}
          >
            {/* Question row */}
            <button
              onClick={() => toggleExpand(q.id)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left"
            >
              <span className="text-white/20 text-xs font-mono w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-sm font-medium text-white/90">{q.question}</span>
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded capitalize shrink-0',
                DIFFICULTY_COLORS[q.difficulty as keyof typeof DIFFICULTY_COLORS]
              )}>
                {q.difficulty}
              </span>
              {expanded === q.id
                ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0" />
                : <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
              }
            </button>

            {/* Answer */}
            {expanded === q.id && (
              <div className="px-5 pb-5 border-t border-white/10">
                <div className="pt-4">
                  {/* Short answer always visible */}
                  <p className="text-sm text-white/70 leading-relaxed">
                    {shortAnswer(q.answer)}
                  </p>

                  {/* Full answer — remaining paragraphs */}
                  {hasMore(q.answer) && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      {q.answer.split('\n\n').slice(1).map((para, idx) => (
                        <p key={idx} className="text-sm text-white/50 leading-relaxed mb-2 last:mb-0 whitespace-pre-line">
                          {para}
                        </p>
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
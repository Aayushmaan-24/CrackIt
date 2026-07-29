'use client'
import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Lightbulb, Zap } from 'lucide-react'
import { clsx } from 'clsx'

const COMPANIES = [
  { id: 'google', label: 'Google' },
  { id: 'amazon', label: 'Amazon' },
  { id: 'microsoft', label: 'Microsoft' },
  { id: 'meta', label: 'Meta' },
  { id: 'flipkart', label: 'Flipkart' },
  { id: 'swiggy', label: 'Swiggy' },
  { id: 'zomato', label: 'Zomato' },
  { id: 'atlassian', label: 'Atlassian' },
  { id: 'adobe', label: 'Adobe' },
  { id: 'salesforce', label: 'Salesforce' },
  { id: 'goldman_sachs', label: 'Goldman Sachs' },
  { id: 'jpmorgan', label: 'JP Morgan' },
  { id: 'morgan_stanley', label: 'Morgan Stanley' },
  { id: 'bny_mellon', label: 'BNY Mellon' },
  { id: 'deutsche_bank', label: 'Deutsche Bank' },
  { id: 'wells_fargo', label: 'Wells Fargo' },
]

const DIFFICULTY_COLORS = {
  easy: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  hard: 'text-red-400 bg-red-400/10',
}

interface Resource {
  label: string
  url: string
}

interface AptitudeQuestion {
  id: string
  topic: string
  question: string
  options: string[]
  answer: string
  explanation: string
  shortcut?: string
  difficulty: 'easy' | 'medium' | 'hard'
  companies: string[]
  resources: Resource[]
  order_index: number
}

interface AptitudeTopic {
  id: string
  topic: string
  resources: Resource[]
  order_index: number
}

interface Props {
  questions: AptitudeQuestion[]
  topics: AptitudeTopic[]
}

export function AptitudeList({ questions, topics }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [activeCompany, setActiveCompany] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return questions.filter(q => {
      if (activeTopic && q.topic !== activeTopic) return false
      if (activeCompany && !q.companies.includes(activeCompany)) return false
      return true
    })
  }, [questions, activeTopic, activeCompany])

  const handleSelect = (questionId: string, option: string) => {
    if (revealed[questionId]) return
    setSelectedAnswer(prev => ({ ...prev, [questionId]: option }))
  }

  const handleReveal = (questionId: string) => {
    setRevealed(prev => ({ ...prev, [questionId]: true }))
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Concept reference links — from DB */}
      <div className="bg-white/[0.02] border border-white/10 rounded-xl p-5">
        <h2 className="text-sm font-medium mb-4 text-white/70">
          📚 Concept Reference — practice by topic
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {topics.map(topic => (
            <div key={topic.id} className="flex flex-col gap-1.5">
              <p className="text-xs text-white/40 font-medium">{topic.topic}</p>
              <div className="flex items-center gap-2 flex-wrap">
                {topic.resources.map(link => (
                  
                    <a key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/30 uppercase tracking-wider w-14 shrink-0">Topic</span>
          <button
            onClick={() => setActiveTopic(null)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs border transition-all',
              activeTopic === null
                ? 'bg-white/15 border-white/40 text-white'
                : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
            )}
          >
            All
          </button>
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTopic(activeTopic === t.topic ? null : t.topic)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs border transition-all',
                activeTopic === t.topic
                  ? 'bg-yellow-400/15 border-yellow-400/40 text-yellow-300'
                  : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
              )}
            >
              {t.topic}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/30 uppercase tracking-wider w-14 shrink-0">Company</span>
          <button
            onClick={() => setActiveCompany(null)}
            className={clsx(
              'px-3 py-1 rounded-full text-xs border transition-all',
              activeCompany === null
                ? 'bg-white/15 border-white/40 text-white'
                : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
            )}
          >
            All
          </button>
          {COMPANIES.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCompany(activeCompany === c.id ? null : c.id)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs border transition-all',
                activeCompany === c.id
                  ? 'bg-blue-400/15 border-blue-400/40 text-blue-300'
                  : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-white/30 px-1">
          {filtered.length} / {questions.length} questions
        </p>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-3">
        {filtered.map((q, i) => {
          const isExpanded = expanded === q.id
          const userAnswer = selectedAnswer[q.id]
          const isRevealed = revealed[q.id]
          const isCorrect = userAnswer === q.answer

          return (
            <div
              key={q.id}
              className={clsx(
                'border rounded-xl overflow-hidden transition-all',
                isExpanded
                  ? 'border-white/20 bg-white/[0.04]'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/15'
              )}
            >
              {/* Header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : q.id)}
                className="w-full flex items-start gap-4 px-5 py-4 text-left"
              >
                <span className="text-white/20 text-xs font-mono w-5 shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/90 leading-relaxed">
                    {q.question}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded capitalize',
                      DIFFICULTY_COLORS[q.difficulty]
                    )}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-white/25 bg-white/5 px-2 py-0.5 rounded">
                      {q.topic}
                    </span>
                    {isRevealed && (
                      <span className={clsx(
                        'text-xs px-2 py-0.5 rounded',
                        isCorrect
                          ? 'text-green-400 bg-green-400/10'
                          : 'text-red-400 bg-red-400/10'
                      )}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                  : <ChevronDown className="w-4 h-4 text-white/40 shrink-0 mt-0.5" />
                }
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-white/10">
                  <div className="pt-4 flex flex-col gap-4">

                    {/* MCQ Options */}
                    <div className="grid sm:grid-cols-2 gap-2">
                      {q.options.map(option => {
                        const isSelected = userAnswer === option
                        const isAnswerCorrect = option === q.answer
                        let optionStyle = 'border-white/10 text-white/60 hover:border-white/25 hover:text-white/80'
                        if (isRevealed) {
                          if (isAnswerCorrect) optionStyle = 'border-green-500/50 bg-green-500/10 text-green-400'
                          else if (isSelected) optionStyle = 'border-red-500/50 bg-red-500/10 text-red-400'
                          else optionStyle = 'border-white/5 text-white/30'
                        } else if (isSelected) {
                          optionStyle = 'border-yellow-400/50 bg-yellow-400/10 text-yellow-300'
                        }

                        return (
                          <button
                            key={option}
                            onClick={() => handleSelect(q.id, option)}
                            disabled={isRevealed}
                            className={clsx(
                              'px-4 py-2.5 rounded-lg border text-sm text-left transition-all',
                              optionStyle,
                              !isRevealed && 'cursor-pointer'
                            )}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>

                    {/* Reveal button */}
                    {!isRevealed && (
                      <button
                        onClick={() => handleReveal(q.id)}
                        className="self-start px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-sm text-white/60 hover:text-white hover:border-white/30 transition-all"
                      >
                        Show Answer & Explanation
                      </button>
                    )}

                    {/* Answer + Explanation */}
                    {isRevealed && (
                      <div className="flex flex-col gap-3">

                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3">
                          <p className="text-xs text-green-400/70 font-medium mb-1">Correct Answer</p>
                          <p className="text-sm text-green-300 font-medium">{q.answer}</p>
                        </div>

                        <div className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                            <p className="text-xs text-yellow-400/70 font-medium">Explanation</p>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed">{q.explanation}</p>
                        </div>

                        {q.shortcut && (
                          <div className="bg-blue-400/5 border border-blue-400/15 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Zap className="w-3.5 h-3.5 text-blue-400" />
                              <p className="text-xs text-blue-400/70 font-medium">Shortcut / Trick</p>
                            </div>
                            <p className="text-sm text-white/50 leading-relaxed font-mono">{q.shortcut}</p>
                          </div>
                        )}

                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-white/30">Asked by:</span>
                          {q.companies.map(c => (
                            <span key={c} className="text-xs text-blue-400/60">
                              {COMPANIES.find(co => co.id === c)?.label ?? c}
                            </span>
                          ))}
                        </div>

                        {q.resources && q.resources.length > 0 && (
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-white/30">Practice more:</span>
                            {q.resources.map(r => (
                              
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
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-white/30 text-sm">
            No questions match your filters.
          </div>
        )}
      </div>
    </div>
  )
}
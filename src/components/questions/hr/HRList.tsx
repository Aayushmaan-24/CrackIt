'use client'
import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
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

const FRAMEWORK_COLORS: Record<string, string> = {
    STAR: 'text-yellow-400 bg-yellow-400/10',
    General: 'text-blue-400 bg-blue-400/10',
    Situational: 'text-purple-400 bg-purple-400/10',
  }

interface HRQuestion {
    id: string
    category: string
    question: string
    what_they_evaluate: string
    sample_answer: string
    dos: string[]
    donts: string[]
    framework: string
    companies: string[]
    resources: { label: string; url: string }[]
    order_index: number
  }
  
export function HRList({ questions } : { questions: HRQuestion[] }) {
    const [expanded, setExpanded] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [activeCompany, setActiveCompany] = useState<string | null>(null)

    const categories = [...new Set(questions.map(q => q.category))]
    const filtered = useMemo(() => {
        return questions.filter(q => {
            if (activeCategory && q.category !== activeCategory) return false
            if (activeCompany && !q.companies.includes(activeCompany)) return false
            return true
        })
    }, [questions, activeCategory, activeCompany])

    return (
      <div className="flex flex-col gap-6">

      {/* STAR framework explainer */}
      <div className="bg-yellow-400/5 border border-yellow-400/15 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-yellow-400 mb-3">
          The STAR Framework — use this for every behavioral question
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { letter: 'S', word: 'Situation', desc: 'Set the context briefly' },
            { letter: 'T', word: 'Task', desc: 'What was your responsibility' },
            { letter: 'A', word: 'Action', desc: 'Exactly what YOU did' },
            { letter: 'R', word: 'Result', desc: 'Measurable outcome' },
          ].map(item => (
            <div key={item.letter} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 font-bold text-lg w-5">{item.letter}</span>
                <span className="text-sm font-medium text-white/80">{item.word}</span>
              </div>
              <p className="text-xs text-white/40 ml-7">{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-3 ml-0">
          Keep S and T brief — spend 70% of your answer on A and R. Always quantify results where possible.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/30 uppercase tracking-wider w-16 shrink-0">Category</span>
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
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={clsx(
                'px-3 py-1 rounded-full text-xs border transition-all',
                activeCategory === cat
                  ? 'bg-yellow-400/15 border-yellow-400/40 text-yellow-300'
                  : 'text-white/40 border-white/10 hover:border-white/20 hover:text-white/60'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-white/30 uppercase tracking-wider w-16 shrink-0">Company</span>
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
                      'text-xs px-2 py-0.5 rounded',
                      FRAMEWORK_COLORS[q.framework]
                    )}>
                      {q.framework}
                    </span>
                    <span className="text-xs text-white/25 bg-white/5 px-2 py-0.5 rounded">
                      {q.category}
                    </span>
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

                    {/* What they evaluate */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
                      <p className="text-xs text-white/30 font-medium mb-1">What the interviewer is evaluating</p>
                      <p className="text-sm text-white/60 leading-relaxed">{q.what_they_evaluate}</p>
                    </div>

                    {/* Sample answer */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3">
                      <p className="text-xs text-white/30 font-medium mb-2">Sample Answer</p>
                      <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                        {q.sample_answer}
                      </p>
                    </div>

                    {/* Dos and Don'ts */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="bg-green-500/5 border border-green-500/15 rounded-lg px-4 py-3">
                        <p className="text-xs text-green-400/70 font-medium mb-2">✓ Do</p>
                        <ul className="flex flex-col gap-1.5">
                          {q.dos.map((item, idx) => (
                            <li key={idx} className="text-xs text-white/50 leading-relaxed flex gap-2">
                              <span className="text-green-400/50 shrink-0">→</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-red-500/5 border border-red-500/15 rounded-lg px-4 py-3">
                        <p className="text-xs text-red-400/70 font-medium mb-2">✗ Don't</p>
                        <ul className="flex flex-col gap-1.5">
                          {q.donts.map((item, idx) => (
                            <li key={idx} className="text-xs text-white/50 leading-relaxed flex gap-2">
                              <span className="text-red-400/50 shrink-0">→</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Companies */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-white/30">Asked at:</span>
                      {q.companies.map(c => (
                        <span key={c} className="text-xs text-blue-400/60">
                          {COMPANIES.find(co => co.id === c)?.label ?? c}
                        </span>
                      ))}
                    </div>

                    {/* Resources */}
                    {q.resources && q.resources.length > 0 && (
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xs text-white/30">Resources:</span>
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
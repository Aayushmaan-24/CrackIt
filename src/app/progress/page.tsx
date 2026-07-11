import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'
import Link from "next/link";
import { clsx } from "clsx";

export const metadata = {title: 'Progress — CrackIt'}

const COMPANIES = ['google','amazon','microsoft','meta','flipkart','swiggy','zomato','atlassian','salesforce','adobe']
const TOPICS = ['arrays','strings','two-pointers','sliding-window','binary-search','stacks','queues','linked-lists','trees','heaps','graphs','backtracking','greedy','dp','math']

const COMPANY_COLORS: Record<string, string> = {
    google: 'from-blue-500 to-green-400',
    amazon: 'from-orange-500 to-yellow-400',
    microsoft: 'from-blue-400 to-cyan-400',
    meta: 'from-blue-600 to-blue-400',
    flipkart: 'from-yellow-500 to-orange-400',
    swiggy: 'from-orange-500 to-red-400',
    zomato: 'from-red-500 to-pink-400',
    atlassian: 'from-blue-500 to-indigo-400',
    salesforce: 'from-cyan-500 to-blue-400',
    adobe: 'from-red-600 to-orange-500',
  }

const READINESS_LABEL = (pct: number) => {
    if (pct === 0) return { label: 'Not started', color: 'text-white/30' }
    if (pct < 25) return { label: 'Just started', color: 'text-red-400' }
    if (pct < 50) return { label: 'In progress', color: 'text-orange-400' }
    if (pct < 75) return { label: 'Getting there', color: 'text-yellow-400' }
    if (pct < 100) return { label: 'Almost ready', color: 'text-green-400' }
    return { label: 'Interview ready ⚡', color: 'text-green-400' }
  }

export default async function ProgressPage() {
    const supabase = await createClient()
    const { data : { user }} = await supabase.auth.getUser()

    if (!user) redirect('/')
    // Fetch all questions + user progress in parallel

    const [
        {data: allQuestions},
        {data: allSD},
        {data: allCS},
        {data: userProgress},
    ] = await Promise.all([
        supabase.from('questions').select('id, topics, companies, difficulty'),
        supabase.from('system_design_questions').select('id, companies'),
        supabase.from('core_cs_questions').select('id, subject'),
        supabase.from('user_progress').select('question_id, completed, completed_at').eq('user_id', user.id),
    ])

    const completedSet = new Set(
        userProgress?.filter(r => r.completed).map(r => r.question_id) ?? []
    )

    // overall stats
    const totalDSA = allQuestions?.length ?? 0
    const totalSD = allSD?.length ?? 0
    const totalCS = allCS?.length ?? 0
    const totalAll = totalDSA + totalSD + totalCS
    const solvedDSA = allQuestions?.filter(q => completedSet.has(q.id)).length ?? 0
    const solvedSD = allSD?.filter(q => completedSet.has(q.id)).length ?? 0
    const solvedCS = allCS?.filter(q => completedSet.has(q.id)).length ?? 0
    const solvedAll = solvedDSA + solvedSD + solvedCS
    const overallPct = totalAll > 0 ? Math.round((solvedAll / totalAll) * 100) : 0

    // company readiness (DSA based)
    const companyStats = COMPANIES.map(company => {
        const companyQs = allQuestions?.filter(q => q.companies.include(company)) ?? []
        const solved = companyQs.filter(q => completedSet.has(q.id)).length
        const total = companyQs.length
        const pct = total > 0 ? Math.round((solved / total) * 100) : 0
        return { company, solved, total, pct }
    }).sort((a, b) => b.pct - a.pct)

    // Topic breakdown (DSA)
    const topicStats = TOPICS.map(topic => {
        const topicQs = allQuestions?.filter(q => q.topics.includes(topic)) ?? []
        const solved = topicQs.filter(q => completedSet.has(q.id)).length
        const total = topicQs.length
        const pct = total > 0 ? Math.round((solved / total) * 100) : 0
        return { topic, solved, total, pct }
    }).filter(t => t.total > 0)

    // Recent activity — last 5 solved
    const recentIds = userProgress
        ?.filter(r => r.completed && r.completed_at)
        .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
        .slice(0, 5)
        .map(r => r.question_id) ?? []

    const { data: recentQuestions } = await supabase
        .from('questions')
        .select('id, title, difficulty, topics')
        .in('id', recentIds.length > 0 ? recentIds : ['none'])
    
    const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Header */}
            <div className="mb-10">
                <h1 className="text-2xl font-bold mb-1">Year Progress</h1>
                <p className="text-white/50 text-sm">Here's a full breakdown of where you stand, {firstName}.</p>
            </div>

            {/* Overall Stats Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                    { label: 'Total Solved', value: solvedAll, sub: `of ${totalAll}` },
                    { label: 'DSA', value: solvedDSA, sub: `of ${totalDSA}` },
                    { label: 'System Design', value: solvedSD, sub: `of ${totalSD}` },
                    { label: 'Core CS', value: solvedCS, sub: `of ${totalCS}` },
                ].map(stat => (
                    <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold text-yellow-400">{stat.value}</div>
                        <div className="text-xs text-white/40 mt-0.5">{stat.label}</div>
                        <div className="text-xs text-white/20 mt-0.5">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Overall progress bar */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm text-white/50">{overallPct}%</span>
                </div>
                <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-700"
                        style={{ width: `${overallPct}%`}}
                    />
                </div>
            </div>

            {/* Company Readiness */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-base font-semibold mb-1">Company Readiness</h2>
                <p className="text-xs text-white/30 mb-6">Based on DSA questions tagged per company</p>
                <div className="flex flex-col gap-5">
                    {companyStats.map(({ company, solved, total, pct }) => {
                        const {label, color} = READINESS_LABEL(pct)
                        return (
                            <div key={company}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium capitalize">{company}</span>
                                        <span className={clsx('text-xs', color)}>{label}</span>
                                    </div>
                                    <span className="text-xs text-white/40">{solved} / {total}</span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={clsx(
                                            'h-full rounded-full bg-gradient-to-r trasition-all duration-700', COMPANY_COLORS[company]
                                        )}
                                        style={{ width : `${pct}%` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Topic Breakdown */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-6">
                <h2 className="text-base font-semibold mb-1">Topic Breakdown</h2>
                <p className="text-xs text-white/30 mb-6">Your strength across DSA topics</p>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                    {topicStats.map(({ topic, solved, total, pct }) => (
                        <div key={topic}>
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-sm capitalize">{topic.replace('-', ' ')}</span>
                                <span className="text-xs text-white/40">{solved} / {total}</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-400 rounded-full transition-all duration-700"
                                    style={{ width : `${pct}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            {recentQuestions && recentQuestions.length > 0 && (
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
                    <h2 className="text-base font-semibold mb-4">Recently Solved</h2>
                    <div className="flex flex-col gap-2">
                        {recentIds.map(id => {
                            const q = recentQuestions.find(r => r.id === id)
                            if (!q) return null
                            return (
                                <div key={q.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                                    <span className="text-sm text-white/80 flex-1">{q.title}</span>
                                    <span className={clsx('text-xs px-2 py-0.5 rounded capitalize',
                                        q.difficulty === 'easy' ? 'text-green-400 bg-green-400/10' :
                                        q.difficulty === 'medium' ? 'text-yellow-400 bg-yellow-400/10' :
                                        'text-red-400 bg-red-400/10'
                                    )}>
                                        {q.difficulty}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Empty state — no progress yet */}
            {solvedAll === 0 && (
                <div className="text-center py-16 border border-white/10 rounded-xl bg-white/[0.02]">
                    <p className="text-white/40 text-sm mb-4">You haven't solved any questions yet.</p>
                    <Link href='/dsa'
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors">
                            Start with DSA →
                    </Link>
                </div>
            )}

        </div>
    )
    
}
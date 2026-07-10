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
    
}
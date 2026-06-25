import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Zap, Target, BookMarked, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Dashboard — CrackIt' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not logged in, send to landing
  if (!user) redirect('/')

  // Fetch user's progress stats
  const { data: progressRows } = await supabase
    .from('user_progress')
    .select('question_id, completed, bookmarked, completed_at')
    .eq('user_id', user.id)

  const { data: totalQuestions } = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })

  const completed = progressRows?.filter(r => r.completed) ?? []
  const bookmarked = progressRows?.filter(r => r.bookmarked) ?? []
  const total = totalQuestions ?? 0
  const completedToday = completed.filter(r => {
    if (!r.completed_at) return false
    const today = new Date().toDateString()
    return new Date(r.completed_at).toDateString() === today
  })

  const percent = total > 0 ? Math.round((completed.length / (total as number)) * 100) : 0
  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  const stats = [
    { label: 'Solved', value: completed.length, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { label: 'Today', value: completedToday.length, icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Bookmarked', value: bookmarked.length, icon: BookMarked, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Completion', value: `${percent}%`, icon: Target, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-1">
          <img
            src={user.user_metadata?.avatar_url}
            alt="avatar"
            className="w-9 h-9 rounded-full border border-white/20"
          />
          <h1 className="text-2xl font-bold">Hey, {firstName} 👋</h1>
        </div>
        <p className="text-white/50 text-sm ml-12">Here's where you stand today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex flex-col gap-3">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium">Overall DSA Progress</h2>
          <span className="text-sm text-white/50">{completed.length} / {total as number}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-white/30 mt-2">
          {percent < 30 && "Just getting started — keep going! 💪"}
          {percent >= 30 && percent < 60 && "Good momentum — you're getting there 🔥"}
          {percent >= 60 && percent < 90 && "Seriously impressive — almost there 🚀"}
          {percent >= 90 && "Interview ready. Go get that offer. ⚡"}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-3">
        <Link
          href="/dsa"
          className="bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] rounded-xl p-5 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Continue DSA</h3>
            <span className="text-white/30 group-hover:text-white/60 transition-colors">→</span>
          </div>
          <p className="text-sm text-white/40">Pick up where you left off. {(total as number) - completed.length} questions remaining.</p>
        </Link>

        <Link
          href="/dsa"
          className="bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] rounded-xl p-5 transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Bookmarked</h3>
            <span className="text-white/30 group-hover:text-white/60 transition-colors">→</span>
          </div>
          <p className="text-sm text-white/40">
            {bookmarked.length > 0
              ? `You have ${bookmarked.length} questions saved for revision.`
              : 'Bookmark questions to build your revision list.'}
          </p>
        </Link>
      </div>

    </div>
  )
}
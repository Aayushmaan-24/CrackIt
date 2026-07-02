import { createClient } from '@/lib/supabase/server'
import { QuestionList } from '@/components/questions/dsa/QuestionList'
import type { Question } from '@/types'

export const metadata = { title: 'DSA Questions — CrackIt' }

export default async function DSAPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const supabase = await createClient()
  const { filter } = await searchParams

  const { data } = await supabase
    .from('questions')
    .select('*')
    .order('order_index', { ascending: true })

  const questions: Question[] = data ?? []

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">
          {filter === 'bookmarked' ? 'Bookmarked Questions' : 'DSA Questions'}
        </h1>
        <p className="text-white/50 text-sm">
          {filter === 'bookmarked'
            ? 'Your saved questions for revision'
            : `${questions.length} questions · sorted by topic progression · click any question to open on LeetCode`}
        </p>
      </div>

      <QuestionList questions={questions} initialFilter={filter} />
    </div>
  )
}
import { createClient } from '@/lib/supabase/server'
import { AptitudeList } from '@/components/questions/aptitude/AptitudeList'
import { QuestionPageSkeleton } from '@/components/questions/QuestionListSkeleton'
import { Suspense } from 'react'

export const metadata = { title: 'Aptitude — CrackIt' }

async function AptitudeContent() {
  const supabase = await createClient()

  const [{ data: questions }, { data: topics }] = await Promise.all([
    supabase.from('aptitude_questions').select('*').order('order_index'),
    supabase.from('aptitude_topics').select('*').order('order_index'),
  ])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Aptitude & Logical Reasoning</h1>
        <p className="text-white/50 text-sm">
          {questions?.length ?? 0} questions · MCQ with full solutions · shortcut tricks · company tagged
        </p>
      </div>
      <AptitudeList questions={questions ?? []} topics={topics ?? []} />
    </div>
  )
}

export default async function AptitudePage() {
  return (
    <Suspense fallback={<QuestionPageSkeleton />}>
      <AptitudeContent />
    </Suspense>
  )
}
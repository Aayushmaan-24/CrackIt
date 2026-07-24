import { createClient } from '@/lib/supabase/server'
import { SEList } from '@/components/questions/se/SEList'

export const metadata = { title: 'Software Engineering — CrackIt' }

export default async function SEPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('se_topics')
    .select('*')
    .order('order_index')

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Software Engineering</h1>
        <p className="text-white/50 text-sm">
          {data?.length ?? 0} topics · engineering practices · why each matters in interviews
        </p>
      </div>
      <SEList topics={data ?? []} />
    </div>
  )
}
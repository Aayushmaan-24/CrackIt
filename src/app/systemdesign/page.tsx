import { createClient } from "@/lib/supabase/server";
import { SystemDesignList } from '@/components/questions/systemdesign/QuestionList';

export const metadata = {
    title: 'System Design — CrackIt'
}

export default async function SystemDesignPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('system_design_questions')
    .select('*')
    .order('order_index', { ascending: true })

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">System Design</h1>
                <p className="text-white/50 text-sm">
                    {data?.length ?? 0} questions · click any question to open on systemdesignschool.io
                </p>
            </div>
            <SystemDesignList questions={data ?? []} />
        </div>
    )

}
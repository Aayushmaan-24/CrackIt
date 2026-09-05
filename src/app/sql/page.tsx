import { createClient } from "@/lib/supabase/server";
import { SQLList } from '@/components/questions/sql/SQLList'
import { QuestionPageSkeleton } from "@/components/questions/QuestionListSkeleton";
import { Suspense } from "react";

export const metadata = {title: 'SQL — CrackIt'}

async function SQLContent() {
    const supabase = await createClient()
    const { data } = await supabase
    .from('sql_topics')
    .select('*')
    .order('order_index')

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">SQL</h1>
                <p className="text-white/50 text-sm">
                    {data?.length ?? 0} topics · expandable explanations · LeetCode practice links
                </p>
            </div>
            <SQLList topics={data ?? []} />
        </div>
    )
}

export default async function SQLPage() {
    return (
        <Suspense fallback={<QuestionPageSkeleton />}>
            <SQLContent />
        </Suspense>
    )
}
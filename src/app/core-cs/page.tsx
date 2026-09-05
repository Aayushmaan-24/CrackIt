import { createClient } from "@/lib/supabase/server";
import { CoreCSList } from "@/components/questions/corecs/QuestionList";
import { QuestionPageSkeleton } from "@/components/questions/QuestionListSkeleton";
import { Suspense } from "react";

export const metadata = {
    title : 'Core CS — CrackIt'
}

async function CoreCSContent() {
    const supabase = await createClient()
    const { data } = await supabase
    .from('core_cs_questions')
    .select('*')
    .order('order_index', { ascending: true })

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Core CS</h1>
                <p className="text-white/50 text-sm">
                    Operating Systems · DBMS · Computer Networks — click any question to expand
                </p>
            </div>
            <CoreCSList questions={data ?? []} />
        </div>
    )
}

export default async function CoreCSPage() {
    return (
        <Suspense fallback={<QuestionPageSkeleton />}>
            <CoreCSContent />
        </Suspense>
    )
}
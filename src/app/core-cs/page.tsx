import { createClient } from "@/lib/supabase/server";
import { CoreCSList } from "@/components/questions/corecs/QuestionList";

export const metadata = {
    title : 'Core CS — CrackIt'
}

export default async function CoreCSPage() {

    const supabase = await createClient()
    const { data } = await supabase
    .from('core_cs_questions')
    .select('*')
    .order('order_index', { ascending: true })

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px8 py-10">
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
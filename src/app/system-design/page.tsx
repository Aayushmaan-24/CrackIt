import { createClient } from "@/lib/supabase/server";
import { SystemDesignTabs } from '@/components/questions/systemdesign/Tabs';

export const metadata = {
    title: 'System Design — CrackIt'
}

export default async function SystemDesignPage() {
    const supabase = await createClient()

    const [
        {data: hldConcepts},
        {data: lldConcepts},
        {data: hldProblems},
        {data: lldProblems},
    ] = await Promise.all([
        supabase.from('hld_concepts').select('*').order('order_index'),
        supabase.from('lld_concepts').select('*').order('order_index'),
        supabase.from('hld_problems').select('*').order('order_index'),
        supabase.from('lld_problems').select('*').order('order_index'),
    ])

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">System Design</h1>
                <p className="text-white/50 text-sm">
                    HLD concepts · LLD patterns · Design problems — all in one place
                </p>
            </div>
            <SystemDesignTabs 
                hldConcepts={hldConcepts ?? []}
                lldConcepts={lldConcepts ?? []}
                hldProblems={hldProblems ?? []}
                lldProblems={lldProblems ?? []}
            />
        </div>
    )
}
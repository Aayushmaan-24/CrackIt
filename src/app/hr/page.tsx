import { createClient } from '@/lib/supabase/server';
import { HRList } from '@/components/questions/hr/HRList';

export const metadata = {title: 'HR & Behavioral — CrackIt'}

export default async function HRPage() {
    const supabase = await createClient();
    const { data } = await supabase
    .from("hr_questions")
    .select("*")
    .order("order_index")

    return (
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10'>
            <div className='mb-8'>
                <h1 className='text-2xl font-bold mb-1'>HR & Behavioral</h1>
                <p className='text-white/50 text-sm'>
                    {data?.length ?? 0} questions · STAR framework · sample answers · dos and don'ts · company tagged
                </p>
            </div>
            <HRList questions = {data ?? []} />
        </div>
    )
}

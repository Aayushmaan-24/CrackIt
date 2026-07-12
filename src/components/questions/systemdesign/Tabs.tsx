'use client'
import { useState } from "react"
import { clsx } from "clsx"
import { ConceptsAccordion } from './ConceptsAccordion'
import { ProblemsTab } from './ProblemsTab'

type MainTab = 'hld' | 'lld' | 'problems'

interface Props {
    hldConcepts : any[]
    lldConcepts : any[]
    hldProblems : any[]
    lldProblems : any[]
}

const MAIN_TABS : {
    id: MainTab;
    label: string;
    count?: string
}[] = [
    {id : 'hld', label: 'HLD Concepts'},
    {id : 'lld', label: 'LLD Concepts'},
    {id : 'problems', label: 'Problems'},
]

export function SystemDesignTabs({
    hldConcepts, lldConcepts, hldProblems, lldProblems
} : Props) {
    const [activeTab, setActiveTab] = useState<MainTab>('hld')
    return (
        <div>
            {/* Main tab switcher */}
            <div className="flex gap-2 mb-8 border-b border-white/10 pb-0">
                {MAIN_TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all',
                            activeTab === tab.id
                                ? 'border-yellow-400 text-yellow-400'
                                : 'border-transparent text-white/50 hover:text-white/80'
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'hld' && (
                <ConceptsAccordion
                concepts={hldConcepts}
                groupKey="category_id"
                groupLabel="category"
                emptyMessage="No HLD Concepts found."
            />
            )}

            {activeTab === 'lld' && (
                <ConceptsAccordion
                concepts={lldConcepts}
                groupKey="category_id"
                groupLabel="category"
                emptyMessage="No LLD Concepts found."
            />
            )}

            {activeTab === 'problems' && (
                <ProblemsTab
                    hldProblems={hldProblems}
                    lldProblems={lldProblems}
                />
            )}
        </div>
    )
}
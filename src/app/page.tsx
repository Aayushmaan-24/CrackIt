'use client'

import Link from 'next/link'
import { Zap, CheckCircle2, Brain, BarChart3, BookOpen, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const stats = [
  { value: '200+', label: 'DSA Questions' },
  { value: '10', label: 'Companies' },
  { value: '3', label: 'Core CS Subjects' },
  { value: '100%', label: 'Free Forever' },
]

const router = useRouter()
const [navigating, setNavigating] = useState(false)

const handleStart = () => {
  setNavigating(true)
  router.push('/dsa')
}

const features = [
  {
    icon: BookOpen,
    title: 'Company-wise DSA',
    description: 'Questions tagged by Google, Amazon, Microsoft, Meta, Flipkart and more. Filter by topic, difficulty, or company.',
  },
  {
    icon: CheckCircle2,
    title: 'Track Your Progress',
    description: 'Check off questions as you solve them. Your progress syncs across devices. Never lose track again.',
  },
  {
    icon: Brain,
    title: 'AI Study Partner',
    description: 'Stuck? Get hints, full explanations, or let the AI quiz you on your approach. Context-aware for every question.',
  },
  {
    icon: BarChart3,
    title: 'Readiness Score',
    description: 'See exactly how prepared you are for each company. Spot weak areas before your interview.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6 max-w-3xl">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60">
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            Built for Indian college placements
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
            Crack every round.
            <br />
            <span className="text-yellow-400">Land every offer.</span>
          </h1>

          <p className="text-lg text-white/50 max-w-xl leading-relaxed">
            The only placement prep guide you need. 200+ company-tagged DSA questions,
            system design, core CS — all tracked, all in one place.
          </p>

          <div className="flex items-center gap-3 mt-2">
            <Link href="/dsa">
              <Button 
                onClick={handleStart}
                disabled={navigating}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 h-11 text-sm">
                {navigating ? (
                  <>
                    <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    Loading ...
                  </>
                ) : (
                  <>
                    Start Preparing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline" className="border-white/20 bg-transparent hover:bg-white/5 text-white h-11 text-sm px-6">
                View Progress
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-bold text-yellow-400">{stat.value}</span>
                <span className="text-sm text-white/50">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-3">Everything you need. Nothing you don't.</h2>
          <p className="text-white/50">No fluff. No paywalls. Just the prep material that actually matters.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(feature => (
            <div
              key={feature.title}
              className="bg-white/[0.03] border border-white/10 rounded-xl p-6 flex flex-col gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                <feature.icon className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1.5">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold">Ready to start cracking?</h2>
          <p className="text-white/50 max-w-md">
            Join thousands of students preparing smarter. Sign in with Google and your progress syncs everywhere.
          </p>
          <Link href="/dsa">
            <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 h-11">
              Browse Questions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
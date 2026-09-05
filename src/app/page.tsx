'use client'

import Link from 'next/link'
import { Zap, CheckCircle2, Users, BarChart3, BookOpen, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ScrollReveal } from '@/components/ScrollReveal'

const stats = [
  { value: '200+', label: 'DSA Questions' },
  { value: '10', label: 'Companies' },
  { value: '3', label: 'Core CS Subjects' },
  { value: '100%', label: 'Free Forever' },
]


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
    icon: Users,
    title: 'Community Solutions',
    description: 'Learn from community-curated solutions and approaches. Understand multiple ways to solve each problem.',
  },
  {
    icon: BarChart3,
    title: 'Readiness Score',
    description: 'See exactly how prepared you are for each company. Spot weak areas before your interview.',
  },
]

export default function LandingPage() {
  const router = useRouter()
  const [navigating, setNavigating] = useState(false)

  const handleStart = () => {
  setNavigating(true)
  router.push('/dsa')
}
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 min-h-[60vh] flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-400/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative flex flex-col items-center gap-4 sm:gap-6 max-w-3xl">
          <ScrollReveal delay={0}>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm text-white/60">
              <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <span>Built for Indian college placements</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Practise systematically
              <br />
              <span className="text-yellow-400">Ace your interviews.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-base sm:text-lg text-white/50 max-w-xl leading-relaxed">
              The only placement prep guide you need. 200+ company-tagged DSA questions,
              system design, core CS — all tracked, all in one place.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="flex flex-col sm:flex-row items-center gap-3 mt-2 sm:mt-4 w-full sm:w-auto justify-center">
              <Link href="/dsa" className="w-full sm:w-auto">
                <Button
                  onClick={handleStart}
                  disabled={navigating}
                  className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 h-12 sm:h-11 text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                  {navigating ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      <span>Loading</span>
                    </>
                  ) : (
                    <>
                      <span>Start Preparing</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 100}>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-yellow-400">{stat.value}</span>
                  <span className="text-xs sm:text-sm text-white/50 text-center">{stat.label}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <ScrollReveal>
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Everything you need. Nothing you don't.</h2>
            <p className="text-white/50 text-sm sm:text-base">No fluff. No paywalls. Just the prep material that actually matters.</p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 100}>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 sm:p-6 flex flex-col gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all active:scale-95 sm:active:scale-100">
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5 text-sm sm:text-base">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-white/50 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col items-center text-center gap-4 sm:gap-6">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-3xl font-bold">Ready to start cracking?</h2>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-white/50 max-w-md text-sm sm:text-base">
              Join thousands of students preparing smarter. Sign in with Google and your progress syncs everywhere.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <Link href="/dsa" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 sm:px-8 h-12 sm:h-11 transition-all active:scale-95 sm:active:scale-100">
                Browse Questions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

    </div>
  )
}
'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'
import { createClient } from '@/lib/supabase/client'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    initPostHog()
  }, [])

  // Identify user when auth state changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        posthog.identify(session.user.id, {
          email: session.user.email,
          name: session.user.user_metadata?.full_name,
          avatar: session.user.user_metadata?.avatar_url,
        })
      } else {
        posthog.reset() // clears identity on sign out
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // Track every page navigation
  useEffect(() => {
    posthog.capture('$pageview', { path: pathname })
  }, [pathname])

  return <>{children}</>
}
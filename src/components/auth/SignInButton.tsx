'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

export function SignInButton() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = () => supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${location.origin}/auth/callback` }
  })

  const signOut = () => supabase.auth.signOut()

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <img
            src={user.user_metadata.avatar_url}
            alt="avatar"
            className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 transition-colors cursor-pointer"
          />
        </Link>
        <button
          onClick={signOut}
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Button
      onClick={signIn}
      size="sm"
      className="bg-white text-black hover:bg-white/90 font-medium text-sm"
    >
      Sign in with Google
    </Button>
  )
}
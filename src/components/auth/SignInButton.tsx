'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

export function SignInButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signIn = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        } }
    })
  }

  const signOut = async () => {

    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Image
            src={user.user_metadata.avatar_url}
            alt="avatar"
            width={36}
            height={36}
            className="w-8 h-8 rounded-full border border-white/20 hover:border-white/50 transition-colors cursor-pointer"
          />
        </Link>
        <button
          onClick={signOut}
          disabled={loading}
          className="text-xs text-white/40 hover:text-white/70 transition-colors disabled:opacity-50"
        >
          {loading ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    )
  }

  return (
    <Button
      onClick={signIn}
      disabled={loading}
      size="sm"
      className="bg-white text-black hover:bg-white/90 font-medium text-sm min-w-[140px]"
    >
      {loading ? (
        <>
          <Loader2 className='w-3.5 h-3.5 mr-2 animate-spin' />
        </>
      ) : (
      'Sign in with Google'
      )}
    </Button>
  )
}
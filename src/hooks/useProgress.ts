'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, boolean>>({})
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!userId) return
    supabase
      .from('user_progress')
      .select('question_id, completed, bookmarked, notes')
      .eq('user_id', userId)
      .then(({ data }) => {
        const prog: Record<string, boolean> = {}
        const book: Record<string, boolean> = {}
        const note: Record<string, string> = {}
        data?.forEach(row => {
          prog[row.question_id] = row.completed
          book[row.question_id] = row.bookmarked
          note[row.question_id] = row.notes ?? ''
        })
        setProgress(prog)
        setBookmarks(book)
        setNotes(note)
      })
  }, [userId])


const toggleComplete = useCallback(async (questionId: string) => {
    if (!userId) return false

    const current = progress[questionId] ?? false;

    setProgress(prev => ({ ...prev, [questionId]: !current }))

    await supabase.from('user_progress').upsert({
        user_id : userId,
        question_id : questionId,
        question_type : 'dsa',
        completed : !current,
        completed_at : !current ? new Date().toISOString() : null,
    }, {
        onConflict : 'user_id,question_id'
    })
    return true
}, [userId, progress])

const toggleBookmark = useCallback(async (questionId: string) => {
    if (!userId) return false

    const current = bookmarks[questionId] ?? false

    setBookmarks(prev => ({ ...prev, [questionId]: !current }))

    await supabase.from('user_progress').upsert({
      user_id: userId,
      question_id: questionId,
      question_type: 'dsa',
      bookmarked: !current,
    }, { 
      onConflict: 'user_id,question_id' 
    })
    return true
  }, [userId, bookmarks])


  const saveNote = useCallback(async (questionId: string, note: string) => {
    if (!userId) return false

    setNotes(prev => ({...prev, [questionId]: note}))

    await supabase.from("user_progress").upsert({
      user_id: userId,
      question_id: questionId,
      question_type: "dsa",
      notes: note,
    }, {
      onConflict: "user_id,question_id"
    })
  }, [userId  ])

const completedCount = Object.values(progress).filter(Boolean).length

return {
    progress, bookmarks, notes,
    toggleComplete, toggleBookmark, saveNote,
    isLoggedIn : !!userId, loading, 
    completedCount : completedCount
}

}
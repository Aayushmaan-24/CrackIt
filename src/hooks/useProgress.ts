'use client'

import { useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase/server"

export function useProgress() {

    const [progress, setProgress] = useState<Record<string, boolean>>({})
    const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({})
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
            .select('question_id, completed, bookmarked')
            .eq('user_id', userId)
            .then(({ data }) => {
                const prog : Record<string, boolean> = {}
                const book : Record<string, boolean> = {}

                data?.forEach(row => {

                    prog[row.question_id] = row.completed
                    book[row.question_id] = row.bookmarked

                });

                setProgress(prog)
                setBookmarks(book)
            }, [userId])
    })

}


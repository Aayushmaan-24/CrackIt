import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation'
import Link from "next/link";
import { clsx } from "clsx";

export const metadata = {title: 'Progress — CrackIt'}

const COMPANIES = ['google','amazon','microsoft','meta','flipkart','swiggy','zomato','atlassian','salesforce','adobe']
const TOPICS = ['arrays','strings','two-pointers','sliding-window','binary-search','stacks','queues','linked-lists','trees','heaps','graphs','backtracking','greedy','dp','math']

const COMPANY_COLORS: Record<string, string> = {
    google: 'from-blue-500 to-green-400',
    amazon: 'from-orange-500 to-yellow-400',
    microsoft: 'from-blue-400 to-cyan-400',
    meta: 'from-blue-600 to-blue-400',
    flipkart: 'from-yellow-500 to-orange-400',
    swiggy: 'from-orange-500 to-red-400',
    zomato: 'from-red-500 to-pink-400',
    atlassian: 'from-blue-500 to-indigo-400',
    salesforce: 'from-cyan-500 to-blue-400',
    adobe: 'from-red-600 to-orange-500',
  }

const READINESS_LABEL = (pct: number) => {
    if (pct === 0) return { label: 'Not started', color: 'text-white/30' }
    if (pct < 25) return { label: 'Just started', color: 'text-red-400' }
    if (pct < 50) return { label: 'In progress', color: 'text-orange-400' }
    if (pct < 75) return { label: 'Getting there', color: 'text-yellow-400' }
    if (pct < 100) return { label: 'Almost ready', color: 'text-green-400' }
    return { label: 'Interview ready ⚡', color: 'text-green-400' }
  }


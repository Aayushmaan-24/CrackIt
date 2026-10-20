export type Difficulty = 'easy' | 'medium' | 'hard'

export type Topic =
  | 'arrays' | 'strings' | 'hash-map' | 'two-pointers'
  | 'prefix-sum' | 'sliding-window' | 'fast-slow-pointers'
  | 'stacks' | 'queues' | 'linked-lists'
  | 'binary-search' | 'trees' | 'heaps'
  | 'backtracking' | 'greedy' | 'intervals'
  | 'graphs' | 'union-find' | 'trees'
  | 'monotonic-stack' | 'dp' | 'math'

export type Company =
  | 'google' | 'amazon' | 'microsoft' | 'meta'
  | 'flipkart' | 'swiggy' | 'zomato'
  | 'atlassian' | 'salesforce' | 'adobe'
  | 'goldman_sachs' | 'jpmorgan' | 'morgan_stanley'
  | 'bny_mellon' | 'deutsche_bank' | 'wells_fargo'
  | 'uber' | 'dropbox' | 'linkedin' | 'oracle' | 'paypal'

export interface Question {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  topics: Topic[]
  companies: Company[]
  leetcode_url: string
  order_index: number
  beginner_eligible: boolean
  topic_order: number
}

export interface UserProgress {
  question_id: string
  completed: boolean
  bookmarked: boolean
  notes?: string
  completed_at?: string
}
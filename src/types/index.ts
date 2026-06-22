export type Difficulty = 'easy' | 'medium' | 'hard'

export type Topic =
  | 'arrays' | 'strings' | 'two-pointers' | 'sliding-window'
  | 'binary-search' | 'stacks' | 'queues' | 'linked-lists'
  | 'trees' | 'heaps' | 'graphs' | 'backtracking'
  | 'greedy' | 'dp' | 'math'

export type Company =
  | 'google' | 'amazon' | 'microsoft' | 'meta'
  | 'flipkart' | 'swiggy' | 'zomato'
  | 'atlassian' | 'salesforce' | 'adobe'

export interface Question {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  topics: Topic[]
  companies: Company[]
  leetcode_url: string
  order_index: number
}

export interface UserProgress {
  question_id: string
  completed: boolean
  bookmarked: boolean
  notes?: string
  completed_at?: string
}
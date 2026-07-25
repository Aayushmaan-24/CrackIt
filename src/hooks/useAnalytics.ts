'use client'
import { posthog } from '@/lib/posthog'

export function useAnalytics() {

  const track = (event: string, properties?: Record<string, unknown>) => {
    posthog.capture(event, properties)
  }

  const trackQuestionCompleted = (question: {
    id: string
    title: string
    difficulty?: string
    topics?: string[]
    companies?: string[]
    section: 'dsa' | 'system_design' | 'lld'
  }) => {
    posthog.capture('question_completed', {
      question_id: question.id,
      question_title: question.title,
      difficulty: question.difficulty,
      topics: question.topics,
      companies: question.companies,
      section: question.section,
    })
  }

  const trackQuestionUncompleted = (questionId: string, section: string) => {
    posthog.capture('question_uncompleted', { question_id: questionId, section })
  }

  const trackBookmarked = (questionId: string, section: string) => {
    posthog.capture('question_bookmarked', { question_id: questionId, section })
  }

  const trackFilterUsed = (filterType: string, value: string, section: string) => {
    posthog.capture('filter_used', { filter_type: filterType, value, section })
  }

  const trackLinkClicked = (label: string, url: string, context: string) => {
    posthog.capture('external_link_clicked', { label, url, context })
  }

  const trackAuthPromptShown = (section: string) => {
    posthog.capture('auth_prompt_shown', { section })
  }

  const trackSignIn = () => {
    posthog.capture('sign_in_clicked')
  }

  const trackSignOut = () => {
    posthog.capture('sign_out_clicked')
  }

  const trackSectionVisited = (section: string) => {
    posthog.capture('section_visited', { section })
  }

  return {
    track,
    trackQuestionCompleted,
    trackQuestionUncompleted,
    trackBookmarked,
    trackFilterUsed,
    trackLinkClicked,
    trackAuthPromptShown,
    trackSignIn,
    trackSignOut,
    trackSectionVisited,
  }
}
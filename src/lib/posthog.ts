import posthog from 'posthog-js'

export const initPostHog = () => {
  if (typeof window === 'undefined') return
  if (posthog.__loaded) return

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true, // captures clicks, inputs automatically
  })
}

export { posthog }
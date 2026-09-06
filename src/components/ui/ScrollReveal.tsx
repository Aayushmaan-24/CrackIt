'use client'

import { useInView } from '@/hooks/useInView'
import { clsx } from 'clsx'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const { ref, isInView } = useInView({
    threshold: 0.1,
    margin: '0px 0px -100px 0px',
  })

  return (
    <div
      ref={ref}
      className={clsx(
        'transition-all duration-700 ease-out',
        isInView
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      )}
      style={{
        transitionDelay: isInView ? `${delay}ms` : '0ms',
      }}
    >
      <div className={className}>
        {children}
      </div>
    </div>
  )
}

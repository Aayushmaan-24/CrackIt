import { Zap } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto bg-[#0a0a0a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">

          <div className="flex items-center gap-2 text-center sm:text-left">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="font-semibold text-sm sm:text-base">CrackIt</span>
              <span className="text-white/40 text-xs sm:text-sm">Crack every round. Land every offer.</span>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/50">
            <span className="hidden sm:inline">
              Connect with me
            </span>

            <a
              href="https://www.linkedin.com/in/aayushmaanchakraborty"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors py-2 px-2 rounded-md hover:bg-white/5 active:bg-white/10"
            >
              LinkedIn
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
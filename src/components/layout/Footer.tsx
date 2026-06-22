import { Zap } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">CrackIt</span>
            <span className="text-white/40 text-sm ml-2">Crack every round. Land every offer.</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/50">
            <span>
              Built by{' Aayushmaan Chakraborty '}
            </span>
              
            <a href="https://github.com/Aayushmaan-24"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/80 hover:text-white transition-colors underline underline-offset-4"
              >
                GitHub
            </a>
            
            <a href="https://www.linkedin.com/in/aayushmaanchakraborty"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              LinkedIn
            </a>
          </div>

        </div>
      </div>
    </footer>
  )
}
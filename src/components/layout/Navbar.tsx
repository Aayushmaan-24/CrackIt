'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignInButton } from '@/components/auth/SignInButton'
import { Zap } from 'lucide-react'
import clsx from 'clsx'
import path from 'path'

const navLinks = [
    { href: '/dsa', label: 'DSA' },
    { href: '/system-design', label: 'System Design' },
    { href: '/core-cs', label: 'Core CS' },
    { href: '/progress', label: 'Progress' },
]

export function NavBar() {
    const pathname = usePathname()

    return (

        <nav className='border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-0 z-50'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span>CrackIt</span>
                            </Link>

                            {/* NavLinks */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map(link => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={clsx(
                                    'px-3 py-1.5 rounded-md text-sm transition-colors',
                                    pathname === link.href
                                        ? 'bg-white/10 text-white font-medium'
                                        : 'text-white/60 hover:text-white hover:bg-white/5'
                                    )}
                                >
                                    {link.label}
                                </Link>
                                ))}
                            </div>

                            {/* Auth */}
                            <SignInButton />
                </div>
            </div>
        </nav>

    )

}
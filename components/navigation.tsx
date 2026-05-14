'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import { Home, Wallet, ArrowDownCircle, ArrowUpCircle, CircleDot, User, Settings } from 'lucide-react'

interface NavItem {
  href: string
  labelKey: 'dashboard' | 'deposit' | 'withdraw' | 'wheel' | 'profile'
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: <Home className="h-5 w-5" /> },
  { href: '/deposit', labelKey: 'deposit', icon: <ArrowDownCircle className="h-5 w-5" /> },
  { href: '/wheel', labelKey: 'wheel', icon: <CircleDot className="h-5 w-5" /> },
  { href: '/withdraw', labelKey: 'withdraw', icon: <ArrowUpCircle className="h-5 w-5" /> },
  { href: '/profile', labelKey: 'profile', icon: <User className="h-5 w-5" /> },
]

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[64px]',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              )}
            >
              <span className={cn(isActive && 'text-glow-purple')}>{item.icon}</span>
              <span className="text-xs font-medium">{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

interface TopNavProps {
  showBack?: boolean
  title?: string
  rightElement?: React.ReactNode
}

export function TopNav({ showBack, title, rightElement }: TopNavProps) {
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50 safe-area-pt">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {showBack ? (
          <Link href="/dashboard" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <div className="w-10" />
        )}
        
        <h1 className="text-lg font-semibold text-glow-purple">
          {title || t('appName')}
        </h1>
        
        {rightElement || <div className="w-10" />}
      </div>
    </header>
  )
}

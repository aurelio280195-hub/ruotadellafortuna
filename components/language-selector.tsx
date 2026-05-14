'use client'

import { useLanguage } from '@/lib/language-context'
import { Language, languageNames } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'

const flags: Record<Language, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
}

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass">
        {(Object.keys(languageNames) as Language[]).map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className={language === lang ? 'bg-primary/20' : ''}
          >
            <span className="mr-2">{flags[lang]}</span>
            {languageNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface LanguageSelectProps {
  value: Language
  onChange: (lang: Language) => void
}

export function LanguageSelect({ value, onChange }: LanguageSelectProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.keys(languageNames) as Language[]).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
            value === lang 
              ? 'border-primary bg-primary/20 text-foreground glow-purple' 
              : 'border-border bg-secondary/50 text-muted-foreground hover:bg-secondary'
          }`}
        >
          <span className="text-xl">{flags[lang]}</span>
          <span className="font-medium">{languageNames[lang]}</span>
        </button>
      ))}
    </div>
  )
}

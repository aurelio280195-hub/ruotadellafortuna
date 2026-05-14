'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Language, translations, TranslationKey, getTranslation } from '@/lib/translations'
import { createClient } from '@/lib/supabase/client'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children, initialLanguage = 'it' }: { children: ReactNode; initialLanguage?: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const supabase = createClient()

  useEffect(() => {
    // Load language from profile if logged in
    const loadLanguage = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('language')
          .eq('id', user.id)
          .single()
        
        if (profile?.language) {
          setLanguageState(profile.language as Language)
        }
      }
    }
    loadLanguage()
  }, [supabase])

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    
    // Update in database if logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ language: lang })
        .eq('id', user.id)
    }
  }

  const t = (key: TranslationKey) => getTranslation(language, key)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

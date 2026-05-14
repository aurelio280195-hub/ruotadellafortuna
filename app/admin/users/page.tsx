'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/language-context'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { 
  ArrowLeft,
  Loader2,
  Search,
  Edit,
  Trash2,
  Save,
  X,
  User
} from 'lucide-react'

interface Profile {
  id: string
  email: string
  display_name: string | null
  phone: string | null
  referral_code: string
  referred_by: string | null
  balance: number
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [editBalance, setEditBalance] = useState('')
  const supabase = createClient()
  const { t } = useLanguage()

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) {
        setUsers(data)
        setFilteredUsers(data)
      }
      setLoading(false)
    }

    fetchUsers()
  }, [supabase])

  useEffect(() => {
    if (search) {
      const filtered = users.filter(u => 
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.referral_code.toLowerCase().includes(search.toLowerCase())
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [search, users])

  const handleEditBalance = (userId: string, currentBalance: number) => {
    setEditingUser(userId)
    setEditBalance(currentBalance.toString())
  }

  const handleSaveBalance = async (userId: string) => {
    const newBalance = parseFloat(editBalance)
    if (isNaN(newBalance) || newBalance < 0) return

    const { error } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('id', userId)

    if (!error) {
      setUsers(users.map(u => 
        u.id === userId ? { ...u, balance: newBalance } : u
      ))
      setEditingUser(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo utente?')) return

    const { error } = await supabase.auth.admin.deleteUser(userId)
    
    if (!error) {
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-4 max-w-4xl mx-auto">
          <Link href="/admin" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold">{t('users')}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 py-6 max-w-4xl mx-auto space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, name or referral code..."
            className="pl-10 bg-secondary/50"
          />
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {filteredUsers.map((user) => (
            <GlassCard key={user.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-xl bg-primary/20 shrink-0">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{user.display_name || 'No name'}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Code: <span className="font-mono">{user.referral_code}</span>
                      {user.referred_by && (
                        <span className="ml-2">Ref: <span className="font-mono">{user.referred_by}</span></span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  {editingUser === user.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editBalance}
                        onChange={(e) => setEditBalance(e.target.value)}
                        className="w-24 h-8 text-sm"
                        step="0.01"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleSaveBalance(user.id)}
                        className="h-8 w-8"
                      >
                        <Save className="h-4 w-4 text-neon-emerald" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setEditingUser(null)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="font-bold text-neon-gold">${user.balance.toFixed(2)}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditBalance(user.id, user.balance)}
                          className="h-7 w-7"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteUser(user.id)}
                          className="h-7 w-7 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Nessun utente trovato</p>
        )}
      </main>
    </div>
  )
}

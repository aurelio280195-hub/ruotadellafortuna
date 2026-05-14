import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: adminEmail } = await supabase
    .from('admin_emails')
    .select('email')
    .eq('email', user.email)
    .single()

  if (!adminEmail) {
    redirect('/dashboard')
  }

  return <>{children}</>
}

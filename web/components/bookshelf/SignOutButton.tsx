'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      aria-label="Sign out"
      className="font-ui"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48px',
        height: '48px',
        backgroundColor: 'transparent',
        border: '2px solid #000000',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#222222',
        flexShrink: 0,
        letterSpacing: '1px',
      }}
    >
      Out
    </button>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import PrimaryButton from '@/components/libm/PrimaryButton'
import TextField from '@/components/libm/TextField'

function getLoginErrorMessage(message: string) {
  const normalized = message.toLowerCase()

  if (normalized.includes('user not found') || normalized.includes('email not found')) {
    return "We don't recognise that email."
  }

  if (normalized.includes('invalid password') || normalized.includes('incorrect password')) {
    return 'Incorrect password. Please try again.'
  }

  if (
    normalized.includes('network') ||
    normalized.includes('fetch failed') ||
    normalized.includes('failed to fetch')
  ) {
    return 'Something went wrong. Please check your connection and try again.'
  }

  if (normalized.includes('invalid login credentials')) {
    return "That email or password didn't match an invited account. Please try again."
  }

  return 'Unable to sign in right now. Please try again.'
}

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setErrorMessage(getLoginErrorMessage(error.message))
      setLoading(false)
      return
    }

    router.push('/home')
    router.refresh()
  }

  return (
    <main className="libm-login-screen">
      <div className="libm-login-scroll">
        <div className="libm-login-column">
          <h1 className="libm-display">LibM</h1>
          <p className="libm-tagline">your shared shelf</p>
          <form className="libm-form" onSubmit={handleLogin}>
            <TextField
              label="Email"
              value={email}
              onChange={setEmail}
              type="email"
              autoComplete="email"
              spellCheck={false}
              disabled={loading}
            />
            <TextField
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              autoComplete="current-password"
              spellCheck={false}
              disabled={loading}
            />
            {errorMessage ? (
              <>
                <p className="libm-inline-error">{errorMessage}</p>
                <p className="libm-help-note">
                  Having trouble? This app is private. Make sure you&apos;re using
                  your invited account.
                </p>
              </>
            ) : null}
            <div style={{ marginTop: 24 }}>
              <PrimaryButton type="submit" loading={loading} loadingText="Signing in...">
                SIGN IN
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

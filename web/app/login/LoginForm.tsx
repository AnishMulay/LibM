'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      // Generic error message — never indicate which field was wrong (per D-06)
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    // Successful login — redirect to home (middleware protects other routes)
    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-white px-xl py-2xl w-full max-w-sm">
      {/* App name and tagline */}
      <div className="mb-2xl text-center">
        <h1
          className="font-georgia font-bold text-text-primary"
          style={{ fontSize: '48px', lineHeight: '1.0', letterSpacing: '2px' }}
        >
          LibM
        </h1>
        <p
          className="font-georgia italic text-text-secondary mt-sm"
          style={{ fontSize: '14px', lineHeight: '1.4' }}
        >
          your shared shelf
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Email field */}
        <div className="mb-md">
          <label
            htmlFor="email"
            className="block font-georgia text-body text-text-primary mb-sm"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full h-input bg-white border-2 border-border px-md font-georgia text-body text-text-primary focus:outline-none focus:border-forest-green"
            disabled={loading}
          />
        </div>

        {/* Password field */}
        <div className="mb-md">
          <label
            htmlFor="password"
            className="block font-georgia text-body text-text-primary mb-sm"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full h-input bg-white border-2 border-border px-md font-georgia text-body text-text-primary focus:outline-none focus:border-forest-green"
            disabled={loading}
          />
        </div>

        {/* Error message — shown below password, above button (per UI-SPEC) */}
        {error && (
          <p
            className="font-georgia text-dark-red py-xs"
            style={{ fontSize: '13px', lineHeight: '1.4' }}
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Sign In button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-input bg-forest-green border-2 border-border text-white font-georgia font-bold flex items-center justify-center disabled:cursor-not-allowed hover:bg-[#1f3329] transition-colors"
          style={{ fontSize: '16px', letterSpacing: '1px' }}
        >
          {loading ? (
            /* Circular spinner — 20x20px, white, 2px stroke (per UI-SPEC) */
            <svg
              className="animate-spin"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-label="Signing in"
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="25 50"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            'SIGN IN'
          )}
        </button>
      </form>
    </div>
  )
}

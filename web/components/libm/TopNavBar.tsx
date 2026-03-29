'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

function isLibraryPath(pathname: string) {
  return pathname === '/home' || pathname === '/library'
}

export default function TopNavBar({ actions }: { actions?: ReactNode }) {
  const pathname = usePathname()

  return (
    <header className="libm-top-nav">
      <div className="libm-top-nav-left">
        <nav className="libm-top-nav-links" aria-label="Primary">
          <Link
            href="/home"
            className={`libm-top-nav-link ${isLibraryPath(pathname) ? 'is-active' : ''}`.trim()}
            aria-current={isLibraryPath(pathname) ? 'page' : undefined}
          >
            Library
          </Link>
          <Link
            href="/wishlist"
            className={`libm-top-nav-link ${pathname === '/wishlist' ? 'is-active' : ''}`.trim()}
            aria-current={pathname === '/wishlist' ? 'page' : undefined}
          >
            Wishlist
          </Link>
        </nav>
      </div>
      <div className="libm-top-nav-actions">{actions}</div>
    </header>
  )
}

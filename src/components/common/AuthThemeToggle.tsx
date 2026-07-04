'use client'

import ThemeToggle from '@/components/common/ThemeToggle'

export default function AuthThemeToggle() {
  return (
    <div className="absolute top-4 right-4 z-10 max-[900px]:hidden">
      <ThemeToggle />
    </div>
  )
}

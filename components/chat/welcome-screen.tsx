"use client"

import Link from "next/link"
import { useAuth } from "@/lib/providers/auth-provider"
import { SuggestedPrompts } from "./SuggestedPrompts"

interface WelcomeScreenProps {
  onQuickStart: (message: string) => void
  onSettingsClick?: () => void
  disabled?: boolean
}

export function WelcomeScreen({ onQuickStart, disabled }: WelcomeScreenProps) {
  const { user } = useAuth()

  const getGreeting = () => {
    const hour = new Date().getHours()
    const name = user?.user_metadata?.full_name?.split(' ')[0] ||
                 user?.user_metadata?.name?.split(' ')[0] || ''
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
    return name ? `${timeGreeting}, ${name}.` : `${timeGreeting}.`
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 pb-8 sm:p-8 bg-transparent">
      <div className="max-w-2xl mx-auto text-center space-y-6 px-2">
        <h1 className="text-2xl sm:text-4xl font-semibold text-balance text-foreground tracking-tight h-auto">
          {getGreeting()}
        </h1>

        <SuggestedPrompts onSelect={onQuickStart} disabled={disabled} />

        <Link
          href="/guide"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-2 inline-block"
        >
          See how to get the most from Pelican →
        </Link>
      </div>
    </div>
  )
}

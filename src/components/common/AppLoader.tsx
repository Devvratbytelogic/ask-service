"use client"

import React from "react"

interface AppLoaderProps {
  /** Optional message below the spinner */
  message?: string
  /** Use full viewport overlay (default: true) */
  fullScreen?: boolean
}

export default function AppLoader({ message = "Loading...", fullScreen = true }: AppLoaderProps) {
  return (
    <div
      className={
        fullScreen
          ? "fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm"
          : "flex flex-col items-center justify-center gap-4 py-12"
      }
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div
        className="size-12 rounded-full border-4 border-primaryColor/20 border-t-primaryColor animate-spin"
        aria-hidden
      />
      {message && (
        <p className="mt-4 text-sm font-medium text-fontBlack">{message}</p>
      )}
    </div>
  )
}

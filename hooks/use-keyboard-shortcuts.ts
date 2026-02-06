'use client'

import { useEffect, useCallback } from 'react'

interface KeyboardShortcutsOptions {
  onGenerate: () => void
  canGenerate: boolean
}

export function useKeyboardShortcuts({ onGenerate, canGenerate }: KeyboardShortcutsOptions) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Cmd/Ctrl + Enter to generate
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      if (canGenerate) {
        onGenerate()
      }
    }
  }, [onGenerate, canGenerate])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

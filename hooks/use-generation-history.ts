'use client'

import { useState, useEffect, useCallback } from 'react'

const HISTORY_KEY = 'seo-optimizer-history:v1'
const MAX_HISTORY_ITEMS = 10

export interface HistoryItem {
  id: string
  title: string
  seoTitle: string
  metaDescription: string
  slug: string
  ogPrompt: string
  createdAt: number
}

export function useGenerationHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load history on mount
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch {
        // Invalid data, ignore
      }
    }
    setIsHydrated(true)
  }, [])

  const addToHistory = useCallback((item: Omit<HistoryItem, 'id' | 'createdAt'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS)
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(HISTORY_KEY)
  }, [])

  const getHistoryItem = useCallback((id: string): HistoryItem | undefined => {
    return history.find(item => item.id === id)
  }, [history])

  return { history, addToHistory, clearHistory, getHistoryItem, isHydrated }
}

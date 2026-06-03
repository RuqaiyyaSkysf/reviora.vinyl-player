'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CollapsibleMenuProps {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  theme?: string
}

export function CollapsibleMenu({
  title,
  isOpen,
  onToggle,
  children,
  theme,
}: CollapsibleMenuProps) {
  return (
    <div className="w-full">
      {/* Header */}
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200',
          'bg-white/5 hover:bg-white/10 border border-white/20',
          isOpen && 'bg-white/10 border-white/30'
        )}
      >
        <p className="font-medium text-sm text-white">{title}</p>
        <ChevronDown
          size={16}
          className={cn(
            'text-white/70 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Content */}
      {isOpen && (
        <div className="mt-2 space-y-2 pl-2">
          {children}
        </div>
      )}
    </div>
  )
}

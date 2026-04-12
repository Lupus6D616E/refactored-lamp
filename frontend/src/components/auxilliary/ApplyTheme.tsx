// src/components/ThemeSwitcherCard.tsx
import { useEffect, useState } from 'react'
import { themeChange } from 'theme-change'

const themes = ['light', 'dark', 'aqua', 'cupcake'] as const
type Theme = (typeof themes)[number]

export function ApplyTheme() {
      // Optional: read initial theme from localStorage (theme-change already does this)
      useEffect(() => {
        const saved = localStorage.getItem('theme') as Theme
        document.documentElement.setAttribute('data-theme', saved)
      }, [])
    
    return (
        <div data-choose-theme ></div>
    )
}
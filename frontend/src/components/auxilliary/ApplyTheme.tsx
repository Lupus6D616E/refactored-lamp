// src/components/ThemeSwitcherCard.tsx
import { useEffect, useState } from 'react'
import { themeChange } from 'theme-change'

const themes = ['light', 'dark', 'aqua', 'cupcake'] as const
type Theme = (typeof themes)[number]

export function ApplyTheme() {
    const [selectedTheme, setSelectedTheme] = useState<Theme>('light')
      // Optional: read initial theme from localStorage (theme-change already does this)
      useEffect(() => {
        const saved = localStorage.getItem('theme') as Theme | null
        if (saved && themes.includes(saved)) {
          setSelectedTheme(saved)
        document.documentElement.setAttribute('data-theme', selectedTheme)
        }
      }, [])
    
    return (
        <div></div>
    )
}
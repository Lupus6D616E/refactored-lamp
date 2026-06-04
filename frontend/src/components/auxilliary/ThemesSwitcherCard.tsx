// src/components/ThemeSwitcherCard.tsx
import { useEffect, useState } from 'react'

const themes = ['light', 'dark', 'aqua', 'cupcake','mytheme'] as const
type Theme = (typeof themes)[number]

export default function ThemeSwitcherCard() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>()

  // Optional: read initial theme from localStorage (theme-change already does this)
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved && themes.includes(saved)) {
      setSelectedTheme(saved)
    }
  }, [])


  return (
   
  <div className="card-body p-2">
    {/* Header with Icon */}
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-primary/10 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.172-1.172a4 4 0 115.656 5.656l-1.172 1.172" />
        </svg>
      </div>
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider opacity-60">Appearance</h2>
        <p className="text-xs">Customize your visual experience</p>
      </div>
    </div>

    {/* Current Selection Display */}
    <div className="flex items-center justify-between px-1 mb-2">
      <span className="text-sm font-medium">Active Theme</span>
      <span className="badge badge-primary badge-outline font-mono text-[10px] uppercase tracking-widest">
        {selectedTheme}
      </span>
    </div>

    {/* Styled Select Container */}
    <div className="relative group">
      <select
        className="select select-bordered select-sm w-full bg-base-100 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
        value={selectedTheme}
        onChange={(e) => {
          const newTheme = e.target.value as Theme;
          setSelectedTheme(newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
        }}
        data-choose-theme
      >
        {themes.map((theme) => (
          <option key={theme} value={theme}>
             {theme.charAt(0).toUpperCase() + theme.slice(1)} Mode
          </option>
        ))}
      </select>
    </div>

    <p className="mt-4 text-[10px] text-center italic opacity-40">
      Changes are saved automatically to your browser.
    </p>
  </div>

  )
}
// src/components/ThemeSwitcherCard.tsx
import { useEffect, useState } from 'react'

const themes = ['light', 'dark', 'aqua', 'cupcake'] as const
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
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Theme Switcher</h2>
        <p className="mb-4">
          Current theme: <strong>{selectedTheme}</strong>
        </p>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Select theme</span>
          </label>
          <select
            className="select select-bordered w-full max-w-xs"
            value={selectedTheme}
            onChange={(e) => {
              const newTheme = e.target.value as Theme
              setSelectedTheme(newTheme)
              // theme-change handles the rest (including localStorage)
              document.documentElement.setAttribute('data-theme', newTheme)
              localStorage.setItem('theme', newTheme) // optional – theme-change already does it
            }}
            data-choose-theme // ← theme-change looks for this attribute
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'

const navItems = ['Todos', 'Argentina', 'Libertadores', 'Sudamericana', 'Champions', 'La Liga', 'Premier', 'NBA', 'Pumas']

interface HeaderProps {
  activeSport: string
  onSportChange: (sport: string) => void
}

export function Header({ activeSport, onSportChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg shadow-black/15 border-b border-black/10">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-4 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <img
              src="/banner-left-illustration.png"
              alt=""
              className="h-5 w-auto object-contain sm:h-10"
            />
            <img
              src="/banner-left-text.png"
              alt="Argentina Deportes"
              className="h-5 w-auto object-contain sm:h-10"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onSportChange(item)}
                className={`rounded-full border border-transparent px-3 py-1.5 text-sm font-medium transition duration-200 ease-out ${
                  activeSport === item
                    ? 'bg-black text-white shadow-md shadow-black/30'
                    : 'text-black/70 hover:text-black hover:bg-black/10'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile Hamburger Menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center w-7 h-7 space-y-1"
              aria-label="Toggle menu"
            >
              <span className={`block w-4 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-4 h-0.5 bg-black transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-4 h-0.5 bg-black transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden mt-2 py-2 border-t border-black/10">
            <nav className="flex flex-wrap gap-1 justify-center">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onSportChange(item)
                    setIsMenuOpen(false)
                  }}
                  className={`rounded-full border border-transparent px-2 py-1 text-xs font-medium transition duration-200 ease-out ${
                    activeSport === item
                      ? 'bg-black text-white shadow-md shadow-black/30'
                      : 'text-black/70 hover:text-black hover:bg-black/10'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

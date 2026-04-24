'use client'

const navItems = ['Todos', 'Argentina', 'Libertadores', 'Sudamericana', 'Champions', 'La Liga', 'Premier', 'NBA', 'Pumas']

interface HeaderProps {
  activeSport: string
  onSportChange: (sport: string) => void
}

export function Header({ activeSport, onSportChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg shadow-black/20 border-b border-black/10">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/banner-left-illustration.png"
              alt=""
              className="h-8 w-auto object-contain sm:h-10"
            />
            <img
              src="/banner-left-text.png"
              alt="Argentina Deportes"
              className="h-8 w-auto object-contain sm:h-10"
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

          {/* Mobile: current sport indicator */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="rounded-full bg-black/20 px-2 py-1 text-xs text-black sm:px-3">
              {activeSport}
            </span>
          </div>
        </div>

        {/* Mobile Nav - Scrollable */}
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-2 lg:hidden scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onSportChange(item)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition duration-200 ease-out ${
                activeSport === item
                  ? 'bg-black text-white shadow-md shadow-black/30'
                  : 'bg-black/10 text-black/70'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}

'use client'

const navItems = ['Todos', 'Argentina', 'Libertadores', 'Sudamericana', 'Champions', 'La Liga', 'Premier', 'NBA', 'Pumas']

interface HeaderProps {
  activeSport: string
  onSportChange: (sport: string) => void
}

export function Header({ activeSport, onSportChange }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-foreground">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-background">DeportesAR</span>
          
          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onSportChange(item)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                  activeSport === item
                    ? 'bg-background text-foreground'
                    : 'text-background/70 hover:text-background hover:bg-background/10'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Mobile: current sport indicator */}
          <div className="flex items-center gap-2 lg:hidden">
            <span className="rounded-full bg-background/20 px-3 py-1 text-xs text-background">
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
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeSport === item
                  ? 'bg-background text-foreground'
                  : 'bg-background/10 text-background/70'
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

import Image from "next/image"
import type { SportEvent } from "@/lib/api"

interface EventRowProps {
  event: SportEvent
}

const sportColors: Record<string, string> = {
  Argentina: "bg-blue-500",
  Libertadores: "bg-amber-500",
  Sudamericana: "bg-red-500",
  Champions: "bg-indigo-500",
  "La Liga": "bg-orange-500",
  Premier: "bg-purple-500",
  NBA: "bg-rose-500",
  Pumas: "bg-cyan-500",
  default: "bg-gray-500",
}

export function EventRow({ event }: EventRowProps) {
  const statusStyles = {
    live: "bg-red-500 text-white",
    upcoming: "bg-foreground text-background",
    finished: "bg-muted-foreground/20 text-muted-foreground",
  }

  const statusLabels = {
    live: "EN VIVO",
    upcoming: "PROXIMO",
    finished: "FIN",
  }

  const sportColor = sportColors[event.sport] || sportColors.default
  const isLive = event.status === "live"

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-all hover:border-foreground/20 ${isLive ? "border-red-500/50 bg-red-500/5" : ""}`}>
      {/* Color indicator */}
      <div className={`h-10 w-1 shrink-0 rounded-full ${sportColor} ${isLive ? "animate-pulse" : ""}`} />
      
      {/* Sport badge */}
      <div className="hidden w-24 shrink-0 sm:block">
        <span className="text-xs font-semibold uppercase text-muted-foreground">
          {event.sport}
        </span>
      </div>

      {/* Time */}
      <div className="w-16 shrink-0 text-center">
        <span className={`text-lg font-bold ${isLive ? "text-red-500" : "text-foreground"}`}>
          {event.time}
        </span>
        {isLive && <span className="block text-[10px] font-bold text-red-500 animate-pulse">EN VIVO</span>}
      </div>

      {/* Teams */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* Home Team */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {event.homeLogo && (
            <div className="relative h-6 w-6 shrink-0">
              <Image
                src={event.homeLogo}
                alt={event.homeTeam}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
          <span className="truncate text-sm font-medium text-foreground">
            {event.homeTeam}
          </span>
        </div>

        {/* Score or VS */}
        <div className="flex w-20 shrink-0 items-center justify-center gap-1">
          {event.status === "upcoming" ? (
            <span className="text-xs text-muted-foreground">vs</span>
          ) : (
            <>
              <span className={`text-lg font-bold ${isLive ? "text-red-500" : "text-foreground"}`}>
                {event.homeScore ?? "-"}
              </span>
              <span className="text-muted-foreground">-</span>
              <span className={`text-lg font-bold ${isLive ? "text-red-500" : "text-foreground"}`}>
                {event.awayScore ?? "-"}
              </span>
            </>
          )}
        </div>

        {/* Away Team */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className="truncate text-right text-sm font-medium text-foreground">
            {event.awayTeam}
          </span>
          {event.awayLogo && (
            <div className="relative h-6 w-6 shrink-0">
              <Image
                src={event.awayLogo}
                alt={event.awayTeam}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>

      {/* Date */}
      <div className="hidden w-20 shrink-0 text-right md:block">
        <span className="text-xs text-muted-foreground">{event.date}</span>
      </div>

      {/* Status badge (mobile hidden) */}
      <div className="hidden w-20 shrink-0 justify-end sm:flex">
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[event.status]}`}>
          {statusLabels[event.status]}
        </span>
      </div>
    </div>
  )
}

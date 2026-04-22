export interface SportEvent {
  id: string
  sport: string
  league: string
  homeTeam: string
  awayTeam: string
  homeScore?: string
  awayScore?: string
  time: string
  date: string
  status: "live" | "upcoming" | "finished"
  venue?: string
  homeLogo?: string
  awayLogo?: string
  sortDate: number
}

// ESPN API endpoints - gratuita y con datos reales actualizados
const ESPN_ENDPOINTS: Record<string, string> = {
  // Futbol
  argentina: "https://site.api.espn.com/apis/site/v2/sports/soccer/arg.1/scoreboard",
  libertadores: "https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.libertadores/scoreboard",
  sudamericana: "https://site.api.espn.com/apis/site/v2/sports/soccer/conmebol.sudamericana/scoreboard",
  champions: "https://site.api.espn.com/apis/site/v2/sports/soccer/uefa.champions/scoreboard",
  laliga: "https://site.api.espn.com/apis/site/v2/sports/soccer/esp.1/scoreboard",
  premier: "https://site.api.espn.com/apis/site/v2/sports/soccer/eng.1/scoreboard",
  // Basquet
  nba: "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20260420-20260430",
  // Rugby - Los Pumas
  rugbyChampionship: "https://site.api.espn.com/apis/site/v2/sports/rugby/rugby.championship/scoreboard",
  rugbyTests: "https://site.api.espn.com/apis/site/v2/sports/rugby/test.matches/scoreboard",
}

const SPORT_NAMES: Record<string, string> = {
  argentina: "Argentina",
  libertadores: "Libertadores",
  sudamericana: "Sudamericana",
  champions: "Champions",
  laliga: "La Liga",
  premier: "Premier",
  nba: "NBA",
  rugbyChampionship: "Pumas",
  rugbyTests: "Pumas",
}

function convertToArgentinaTime(dateString: string): { time: string; date: string } {
  try {
    const utcDate = new Date(dateString)
    
    // Argentina es UTC-3
    const argentinaOffset = -3 * 60 * 60 * 1000
    const argentinaTime = new Date(utcDate.getTime() + argentinaOffset)
    
    const hours = argentinaTime.getUTCHours().toString().padStart(2, "0")
    const minutes = argentinaTime.getUTCMinutes().toString().padStart(2, "0")
    
    const day = argentinaTime.getUTCDate()
    const month = argentinaTime.getUTCMonth() + 1
    const year = argentinaTime.getUTCFullYear()
    
    // Fecha actual en Argentina
    const now = new Date()
    const nowArgentina = new Date(now.getTime() + argentinaOffset)
    const todayDay = nowArgentina.getUTCDate()
    const todayMonth = nowArgentina.getUTCMonth() + 1
    
    let dateLabel: string
    if (day === todayDay && month === todayMonth) {
      dateLabel = "Hoy"
    } else if (day === todayDay + 1 && month === todayMonth) {
      dateLabel = "Manana"
    } else if (day === todayDay - 1 && month === todayMonth) {
      dateLabel = "Ayer"
    } else {
      const dayNames = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
      const dayOfWeek = argentinaTime.getUTCDay()
      dateLabel = `${dayNames[dayOfWeek]} ${day}/${month}`
    }
    
    return {
      time: `${hours}:${minutes}`,
      date: dateLabel,
    }
  } catch {
    return { time: "A confirmar", date: "" }
  }
}

function getEventStatus(state: string, completed?: boolean): "live" | "upcoming" | "finished" {
  if (completed) return "finished"
  
  const stateLower = state?.toLowerCase() || ""
  
  if (stateLower === "in" || stateLower.includes("progress")) {
    return "live"
  }
  if (stateLower === "post" || stateLower === "final" || stateLower.includes("final")) {
    return "finished"
  }
  return "upcoming"
}

interface ESPNTeam {
  displayName?: string
  shortDisplayName?: string
  abbreviation?: string
  logo?: string
}

interface ESPNCompetitor {
  team?: ESPNTeam
  homeAway?: string
  score?: string
}

interface ESPNCompetition {
  competitors?: ESPNCompetitor[]
  venue?: {
    fullName?: string
  }
}

interface ESPNEvent {
  id: string
  date: string
  name?: string
  shortName?: string
  status?: {
    type?: {
      state?: string
      completed?: boolean
      description?: string
    }
  }
  competitions?: ESPNCompetition[]
}

interface ESPNResponse {
  events?: ESPNEvent[]
  leagues?: Array<{
    name?: string
    abbreviation?: string
  }>
}

async function fetchESPNData(endpoint: string, sportKey: string): Promise<SportEvent[]> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "Accept": "application/json",
      },
      next: { revalidate: 60 }
    })
    
    if (!response.ok) {
      return []
    }
    
    const data: ESPNResponse = await response.json()
    
    if (!data.events || data.events.length === 0) {
      return []
    }
    
    const events: SportEvent[] = []
    
    for (const event of data.events) {
      const competition = event.competitions?.[0]
      if (!competition?.competitors) continue
      
      const homeTeam = competition.competitors.find((c) => c.homeAway === "home")
      const awayTeam = competition.competitors.find((c) => c.homeAway === "away")
      
      if (!homeTeam || !awayTeam) continue
      
      // Para rugby de Pumas, filtrar solo partidos donde juega Argentina
      if (sportKey === "rugbyChampionship" || sportKey === "rugbyTests") {
        const homeName = (homeTeam.team?.displayName || "").toLowerCase()
        const awayName = (awayTeam.team?.displayName || "").toLowerCase()
        const hasArgentina = homeName.includes("argentina") || awayName.includes("argentina") ||
                           homeName.includes("pumas") || awayName.includes("pumas")
        if (!hasArgentina) continue
      }
      
      const { time, date } = convertToArgentinaTime(event.date)
      const status = getEventStatus(
        event.status?.type?.state || "",
        event.status?.type?.completed
      )
      
      events.push({
        id: `${sportKey}-${event.id}`,
        sport: SPORT_NAMES[sportKey],
        league: data.leagues?.[0]?.name || SPORT_NAMES[sportKey],
        homeTeam: homeTeam.team?.shortDisplayName || homeTeam.team?.displayName || "Local",
        awayTeam: awayTeam.team?.shortDisplayName || awayTeam.team?.displayName || "Visitante",
        homeScore: status !== "upcoming" ? homeTeam.score : undefined,
        awayScore: status !== "upcoming" ? awayTeam.score : undefined,
        time,
        date,
        status,
        venue: competition.venue?.fullName,
        homeLogo: homeTeam.team?.logo,
        awayLogo: awayTeam.team?.logo,
        sortDate: new Date(event.date).getTime(),
      })
    }
    
    return events
  } catch (error) {
    console.error(`[v0] Error fetching ${sportKey}:`, error)
    return []
  }
}

export async function fetchAllSportsEvents(): Promise<SportEvent[]> {
  const allEvents: SportEvent[] = []
  
  // Fetch de todas las ligas en paralelo
  const promises = Object.entries(ESPN_ENDPOINTS).map(async ([key, endpoint]) => {
    const events = await fetchESPNData(endpoint, key)
    return events
  })
  
  const results = await Promise.all(promises)
  
  for (const events of results) {
    allEvents.push(...events)
  }
  
  // Ordenar: primero proximos, luego en vivo, luego finalizados
  allEvents.sort((a, b) => {
    const statusOrder = { upcoming: 0, live: 1, finished: 2 }
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }
    
    // Dentro del mismo status, ordenar por fecha
    return a.sortDate - b.sortDate
  })
  
  return allEvents
}

export async function fetchEventsBySport(sport: string): Promise<SportEvent[]> {
  if (sport.toLowerCase() === "todos") {
    return fetchAllSportsEvents()
  }
  
  const sportKeyMap: Record<string, string[]> = {
    argentina: ["argentina"],
    libertadores: ["libertadores"],
    sudamericana: ["sudamericana"],
    champions: ["champions"],
    "la liga": ["laliga"],
    premier: ["premier"],
    nba: ["nba"],
    pumas: ["rugbyChampionship", "rugbyTests"],
  }
  
  const keys = sportKeyMap[sport.toLowerCase()]
  if (!keys) {
    return fetchAllSportsEvents()
  }
  
  const promises = keys.map((key) => fetchESPNData(ESPN_ENDPOINTS[key], key))
  const results = await Promise.all(promises)
  
  const events = results.flat()
  
  // Ordenar: primero proximos, luego en vivo, luego finalizados
  events.sort((a, b) => {
    const statusOrder = { upcoming: 0, live: 1, finished: 2 }
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }
    return a.sortDate - b.sortDate
  })
  
  return events
}

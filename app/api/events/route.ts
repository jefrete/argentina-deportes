import { fetchAllSportsEvents, fetchEventsBySport } from "@/lib/api"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const sport = searchParams.get("sport")
  
  try {
    let events
    
    if (sport && sport !== "todos") {
      events = await fetchEventsBySport(sport)
    } else {
      events = await fetchAllSportsEvents()
    }
    
    return NextResponse.json({ events, timestamp: new Date().toISOString() })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Failed to fetch events", events: [] },
      { status: 500 }
    )
  }
}

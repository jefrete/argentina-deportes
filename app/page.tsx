"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { EventsSection } from "@/components/events-section"

export default function Home() {
  const [activeSport, setActiveSport] = useState("Todos")

  return (
    <main className="min-h-screen bg-background">
      <Header activeSport={activeSport} onSportChange={setActiveSport} />
      <EventsSection activeSport={activeSport} />
    </main>
  )
}
